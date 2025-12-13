import { useCallback, useEffect, useRef, RefObject, useLayoutEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { TIMELINE_SCROLL_CONFIG } from '@/config/timelineScroll';

interface UseVirtualTimelineScrollProps {
  viewportRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  yearGroupRefs: RefObject<HTMLDivElement[]>;
  eventYears: number[];
  selectedYear: number;
  selectedCaseId: string;
  expandedYears: number[];
  onRequestYearChange: (nextYear: number, meta: { source: "wheel" }) => void;
}

const DEBUG_SCROLL = false;

interface MeasurementResult {
  offsets: number[];
  heights: number[];
  contentHeight: number;
  viewportHeight: number;
  maxScroll: number;
}

export function useVirtualTimelineScroll({
  viewportRef,
  contentRef,
  yearGroupRefs,
  eventYears,
  selectedYear,
  selectedCaseId,
  expandedYears,
  onRequestYearChange,
}: UseVirtualTimelineScrollProps) {
  // Motion values for smooth animation
  const y = useMotionValue(0);
  const ySpring = useSpring(y, { stiffness: 260, damping: 30 });
  
  // Measurement refs
  const offsetsRef = useRef<number[]>([]);
  const heightsRef = useRef<number[]>([]);
  const contentHeightRef = useRef<number>(0);
  const viewportHeightRef = useRef<number>(0);
  const maxScrollRef = useRef<number>(0);
  const wheelAccumRef = useRef(0);
  const pendingIndexRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const yearGroupObserversRef = useRef<Map<number, ResizeObserver>>(new Map());
  const currentIndexRef = useRef<number>(0);
  const isWheelScrollingRef = useRef(false);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCaseIdRef = useRef<string>(selectedCaseId);
  const isMeasuringRef = useRef(false);
  const snapToIndexRef = useRef<((idx: number, opts?: { animate?: boolean }) => Promise<void>) | null>(null);

  // Safe index resolution - finds nearest year if exact match not found
  const getIndexForYear = useCallback((year: number): number => {
    if (eventYears.length === 0) return 0;
    
    const idx = eventYears.indexOf(year);
    if (idx !== -1) {
      return idx;
    }

    // Find nearest year by numeric distance
    let best = 0;
    for (let i = 0; i < eventYears.length; i++) {
      if (Math.abs(eventYears[i] - year) < Math.abs(eventYears[best] - year)) {
        best = i;
      }
    }
    return best;
  }, [eventYears]);

  // Continuous y clamping function - prevents any overshoot
  const clampY = useCallback((value: number): number => {
    const maxScroll = maxScrollRef.current;
    return Math.max(-maxScroll, Math.min(0, value));
  }, []);

  // Single deterministic measurement function
  const measure = useCallback((): MeasurementResult | null => {
    const viewportEl = viewportRef.current;
    const contentEl = contentRef.current;
    
    if (!viewportEl || !contentEl || !yearGroupRefs.current || eventYears.length === 0) {
      return null;
    }

    // Measure viewport height using clientHeight (visible area)
    const viewportHeight = viewportEl.clientHeight;
    
    // Measure content height - prefer scrollHeight, fallback to bounding rect
    // scrollHeight includes padding and is more accurate for dynamic content
    const contentScrollHeight = contentEl.scrollHeight;
    const contentRectHeight = contentEl.getBoundingClientRect().height;
    const contentHeight = contentScrollHeight > 0 ? contentScrollHeight : contentRectHeight;
    
    // Use getBoundingClientRect for accurate positions (accounts for transforms)
    const contentRect = contentEl.getBoundingClientRect();
    const currentY = y.get();
    
    const heights: number[] = [];
    const offsets: number[] = [];
    
    for (let i = 0; i < eventYears.length; i++) {
      const groupEl = yearGroupRefs.current[i];
      if (!groupEl) {
        return null; // Missing ref - measurement incomplete
      }
      
      // Measure height using offsetHeight (includes padding/border)
      const height = groupEl.offsetHeight;
      heights.push(height);
      
      // Measure offset relative to content container
      // Normalize using bounding rects to account for transforms
      const groupRect = groupEl.getBoundingClientRect();
      // Calculate: group top relative to content top, accounting for current transform
      const groupTop = groupRect.top - contentRect.top + currentY;
      offsets.push(groupTop);
    }
    
    // Verify contentHeight makes sense - if scrollHeight wasn't reliable, calculate from heights
    const totalHeightFromGroups = heights.reduce((sum, h) => sum + h, 0) + TIMELINE_SCROLL_CONFIG.CONTENT_BOTTOM_PADDING;
    
    // Use the larger of the two to ensure we never underestimate
    const finalContentHeight = Math.max(contentHeight, totalHeightFromGroups);
    
    // Calculate max scroll
    const maxScroll = Math.max(0, finalContentHeight - viewportHeight);
    
    return {
      offsets,
      heights,
      contentHeight: finalContentHeight,
      viewportHeight,
      maxScroll,
    };
  }, [viewportRef, contentRef, yearGroupRefs, eventYears, y]);

  // Update measurements and clamp y position
  const updateMeasurements = useCallback(() => {
    if (isMeasuringRef.current) return; // Prevent concurrent measurements
    isMeasuringRef.current = true;
    
    const result = measure();
    if (!result) {
      isMeasuringRef.current = false;
      return;
    }
    
    // Store measurements
    offsetsRef.current = result.offsets;
    heightsRef.current = result.heights;
    contentHeightRef.current = result.contentHeight;
    viewportHeightRef.current = result.viewportHeight;
    maxScrollRef.current = result.maxScroll;
    
    // Clamp current y to valid bounds immediately
    const currentY = y.get();
    const clampedY = clampY(currentY);
    if (Math.abs(currentY - clampedY) > 0.1) {
      y.set(clampedY);
    }
    
    if (DEBUG_SCROLL) {
      console.log('[YearScroll] measured:', result);
    }
    
    isMeasuringRef.current = false;
  }, [measure, y, clampY]);

  // Compute target Y position for a year index (with clamping)
  const computeTargetY = useCallback((idx: number): number | null => {
    if (eventYears.length === 0 || idx < 0 || idx >= eventYears.length) return null;
    if (offsetsRef.current.length === 0 || offsetsRef.current[idx] === undefined) return null;

    // Anchor year group at top of viewport
    const yearOffset = offsetsRef.current[idx];
    let target = -yearOffset;
    
    // Clamp to valid scroll bounds (always)
    target = clampY(target);
    
    return target;
  }, [eventYears, clampY]);

  // Snap to year index with proper ordering: expand -> measure -> clamp -> animate
  const snapToYearIndex = useCallback(async (idx: number, opts: { animate?: boolean } = {}): Promise<void> => {
    const { animate = true } = opts;
    
    if (eventYears.length === 0 || idx < 0 || idx >= eventYears.length) return;
    
    // Step 1: Wait for DOM to commit (expansion/collapse should already be done by commitYear)
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
    
    // Step 2: Measure (ensure we have fresh offsets and bounds)
    updateMeasurements();
    
    // Wait one more frame for measurements to settle
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    // Step 3: Guard - check offsets are valid
    if (offsetsRef.current.length !== eventYears.length || offsetsRef.current[idx] === undefined) {
      pendingIndexRef.current = idx;
      return;
    }
    
    // Step 4: Compute and clamp target
    const target = computeTargetY(idx);
    if (target === null) return;
    
    // Step 5: Set y (spring will animate if animate=true, otherwise immediate)
    y.set(target);
    currentIndexRef.current = idx;
    
    if (DEBUG_SCROLL) {
      const targetYear = eventYears[idx];
      console.log('[YearScroll] snapToYearIndex:', { idx, target, animate, year: targetYear });
    }
  }, [eventYears, updateMeasurements, computeTargetY, y]);

  // Scroll to a specific year index (wrapper around snapToYearIndex)
  const scrollToIndex = useCallback((idx: number, options: { immediate?: boolean } = {}) => {
    if (eventYears.length === 0) return;
    
    // Guard: Don't scroll if offsets are stale or don't match current years
    if (offsetsRef.current.length !== eventYears.length) {
      pendingIndexRef.current = idx;
      return;
    }
    
    // Clamp to valid range
    if (idx < 0) idx = 0;
    if (idx >= eventYears.length) idx = eventYears.length - 1;
    
    // If offsets not ready for this index, store as pending
    if (offsetsRef.current[idx] === undefined) {
      if (!isWheelScrollingRef.current) {
        pendingIndexRef.current = idx;
      }
      return;
    }

    // Use snapToYearIndex for proper ordering
    snapToYearIndex(idx, { animate: !options.immediate });
  }, [eventYears, snapToYearIndex]);

  // Store snapToYearIndex ref for external use
  useEffect(() => {
    snapToIndexRef.current = snapToYearIndex;
  }, [snapToYearIndex]);

  // Continuous clamping via spring onChange listener
  useEffect(() => {
    const unsubscribe = ySpring.on('change', (latest) => {
      const clamped = clampY(latest);
      if (Math.abs(latest - clamped) > 0.1) {
        // If spring value exceeds bounds, clamp it immediately
        y.set(clamped);
      }
    });

    return unsubscribe;
  }, [ySpring, y, clampY]);

  // Wheel event handler with visibility guarantees
  const onWheel = useCallback((e: WheelEvent) => {
    // Only handle if event target is within viewport
    const viewport = viewportRef.current;
    if (!viewport?.contains(e.target as Node)) {
      return; // Let normal page scroll handle it
    }

    // Guard: Don't process wheel if measurements are stale
    if (offsetsRef.current.length !== eventYears.length || offsetsRef.current.length === 0) {
      return;
    }

    // Prevent default scroll and stop propagation
    e.preventDefault();
    e.stopPropagation();

    if (eventYears.length < 2) return;

    // Mark that we're actively wheel scrolling
    isWheelScrollingRef.current = true;

    // Clear existing timeout
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }

    // Set timeout to clear wheel scrolling flag after 180ms of inactivity
    wheelTimeoutRef.current = setTimeout(() => {
      isWheelScrollingRef.current = false;
    }, 180);

    // Normalize delta
    let delta = e.deltaY;
    if (e.deltaMode === 1) {
      delta *= 16; // Line mode
    } else if (e.deltaMode === 2) {
      const viewportH = viewport?.clientHeight || 400;
      delta *= viewportH; // Page mode
    }

    // Apply deadzone
    if (Math.abs(delta) < TIMELINE_SCROLL_CONFIG.DEADZONE_PX) {
      return;
    }

    // Accumulate wheel delta
    wheelAccumRef.current += delta;

    // Calculate steps using truncation
    let steps = 0;
    if (wheelAccumRef.current >= TIMELINE_SCROLL_CONFIG.WHEEL_THRESHOLD_PX) {
      steps = Math.min(
        TIMELINE_SCROLL_CONFIG.MAX_STEP_PER_EVENT,
        Math.floor(wheelAccumRef.current / TIMELINE_SCROLL_CONFIG.WHEEL_THRESHOLD_PX)
      );
      wheelAccumRef.current -= steps * TIMELINE_SCROLL_CONFIG.WHEEL_THRESHOLD_PX;
    } else if (wheelAccumRef.current <= -TIMELINE_SCROLL_CONFIG.WHEEL_THRESHOLD_PX) {
      steps = Math.max(
        -TIMELINE_SCROLL_CONFIG.MAX_STEP_PER_EVENT,
        Math.floor(wheelAccumRef.current / TIMELINE_SCROLL_CONFIG.WHEEL_THRESHOLD_PX)
      );
      wheelAccumRef.current -= steps * TIMELINE_SCROLL_CONFIG.WHEEL_THRESHOLD_PX;
    }

    // Apply steps if any - with visibility guarantee
    if (steps !== 0) {
      const newIndex = Math.max(0, Math.min(eventYears.length - 1, currentIndexRef.current + steps));
      const targetYear = eventYears[newIndex];
      
      if (targetYear !== undefined && offsetsRef.current[newIndex] !== undefined) {
        // Visibility guarantee: immediately clamp visual position to valid bounds
        // This prevents overshoot during fast scrolling
        const targetY = -offsetsRef.current[newIndex];
        const clampedTargetY = clampY(targetY);
        
        // Set visual position immediately (before commitYear) to prevent blank space
        y.set(clampedTargetY);
        currentIndexRef.current = newIndex;
        
        // Then trigger state update (which will trigger re-measure and proper anchoring)
        onRequestYearChange(targetYear, { source: "wheel" });
      }
    }
  }, [viewportRef, eventYears, onRequestYearChange, y, clampY]);

  // Handle case switching - reset state when case changes
  useEffect(() => {
    if (lastCaseIdRef.current !== selectedCaseId) {
      // Case changed - reset measurements and position
      offsetsRef.current = [];
      heightsRef.current = [];
      contentHeightRef.current = 0;
      viewportHeightRef.current = 0;
      maxScrollRef.current = 0;
      wheelAccumRef.current = 0;
      pendingIndexRef.current = null;
      currentIndexRef.current = 0;
      isWheelScrollingRef.current = false;
      
      // Reset y position
      y.set(0);
      
      lastCaseIdRef.current = selectedCaseId;
    }
  }, [selectedCaseId, y]);

  // Measure offsets after DOM updates - useLayoutEffect ensures it runs after paint
  useLayoutEffect(() => {
    if (isWheelScrollingRef.current) return;
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!isWheelScrollingRef.current) {
          updateMeasurements();
          
          // After measurement, handle pending index or re-anchor to selectedYear
          if (pendingIndexRef.current !== null && !isWheelScrollingRef.current) {
            const pendingIdx = pendingIndexRef.current;
            pendingIndexRef.current = null;
            snapToYearIndex(pendingIdx, { animate: false }).catch(() => {});
          } else {
            // Re-anchor to selectedYear after measurement
            const currentSelectedIdx = getIndexForYear(selectedYear);
            if (currentSelectedIdx >= 0 && currentSelectedIdx < eventYears.length) {
              if (offsetsRef.current.length === eventYears.length && offsetsRef.current[currentSelectedIdx] !== undefined) {
                const target = computeTargetY(currentSelectedIdx);
                if (target !== null) {
                  const currentY = y.get();
                  if (Math.abs(currentY - target) > 2) {
                    y.set(target);
                    currentIndexRef.current = currentSelectedIdx;
                  }
                }
              }
            }
          }
        }
      });
    });
  }, [updateMeasurements, selectedCaseId, expandedYears, selectedYear, eventYears.length, getIndexForYear, computeTargetY, snapToYearIndex, y]);

  // Setup ResizeObserver for viewport, content, and year groups
  useEffect(() => {
    const viewportEl = viewportRef.current;
    const contentEl = contentRef.current;
    if (!viewportEl || !contentEl) return;

    // Viewport and content observer
    const resizeObserver = new ResizeObserver(() => {
      if (!isWheelScrollingRef.current) {
        setTimeout(() => {
          if (!isWheelScrollingRef.current) {
            updateMeasurements();
          }
        }, 16);
      }
    });

    resizeObserver.observe(viewportEl);
    resizeObserver.observe(contentEl);
    resizeObserverRef.current = resizeObserver;

    // Year group observers
    const setupYearGroupObservers = () => {
      const observers = yearGroupObserversRef.current;
      
      // Cleanup old observers
      observers.forEach((observer, index) => {
        if (!yearGroupRefs.current?.[index]) {
          observer.disconnect();
          observers.delete(index);
        }
      });
      
      // Add observers for new year groups
      if (yearGroupRefs.current) {
        yearGroupRefs.current.forEach((groupEl, index) => {
          if (groupEl && !observers.has(index)) {
            const groupObserver = new ResizeObserver(() => {
              if (!isWheelScrollingRef.current) {
                setTimeout(() => {
                  if (!isWheelScrollingRef.current) {
                    updateMeasurements();
                  }
                }, 16);
              }
            });
            groupObserver.observe(groupEl);
            observers.set(index, groupObserver);
          }
        });
      }
    };

    setupYearGroupObservers();

    // Observe content changes for new year groups
    const contentObserver = new MutationObserver(() => {
      setupYearGroupObservers();
    });
    
    if (contentEl) {
      contentObserver.observe(contentEl, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      resizeObserver.disconnect();
      resizeObserverRef.current = null;
      
      const observers = yearGroupObserversRef.current;
      observers.forEach((observer) => observer.disconnect());
      observers.clear();
      
      contentObserver.disconnect();
    };
  }, [viewportRef, contentRef, yearGroupRefs, updateMeasurements, selectedCaseId]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isWheelScrollingRef.current) {
        updateMeasurements();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateMeasurements]);

  // Handle font loading
  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        if (!isWheelScrollingRef.current) {
          updateMeasurements();
        }
      });
    }
  }, [updateMeasurements, selectedCaseId]);

  // Attach wheel listener to viewport
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      viewport.removeEventListener('wheel', onWheel);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [onWheel, viewportRef]);

  // Sync with external selectedYear changes (from slider or wheel via commitYear)
  useEffect(() => {
    // Guard: Don't sync if offsets are stale
    if (offsetsRef.current.length !== eventYears.length || offsetsRef.current.length === 0) {
      return;
    }
    
    const idx = getIndexForYear(selectedYear);
    
    if (idx >= 0 && idx < eventYears.length && offsetsRef.current[idx] !== undefined && idx !== currentIndexRef.current) {
      scrollToIndex(idx, { immediate: false });
    }
  }, [selectedYear, eventYears, getIndexForYear, scrollToIndex]);

  return {
    ySpring,
    scrollToIndex,
    snapToYearIndex: snapToIndexRef.current || (async () => {}),
  };
}

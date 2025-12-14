/**
 * Shared configuration for timeline scroll sensitivity
 * Used uniformly across all case studies
 */
export const TIMELINE_SCROLL_CONFIG = {
  /** Pixel threshold to accumulate before stepping to next/previous year */
  WHEEL_THRESHOLD_PX: 360,
  
  /** Ignore wheel deltas smaller than this to reduce noise */
  DEADZONE_PX: 2,
  
  /** Maximum year steps per single wheel event (prevents wild jumps) */
  MAX_STEP_PER_EVENT: 3,
  
  /** Bottom padding in pixels for content (breathing room for last item) */
  CONTENT_BOTTOM_PADDING: 24,
} as const;


import { HelpCircle } from "lucide-react";
import { useState } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  tooltip?: string;
  sparkline?: number[];
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  tooltip,
  sparkline,
  className = "",
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`glass rounded-xl p-6 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-white/60 font-medium">{label}</p>
        {tooltip && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-white/40 hover:text-white/60 transition-colors"
              aria-label="More information"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-6 z-10 w-64 p-3 bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-lg text-xs text-white/80 leading-relaxed shadow-xl">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-white/95">{value}</p>
        {unit && <p className="text-sm text-white/50 font-medium">{unit}</p>}
      </div>
      {sparkline && sparkline.length > 0 && (
        <div className="mt-4">
          <MiniSparkline data={sparkline} />
        </div>
      )}
    </div>
  );
}

// Minimal inline sparkline (no D3, pure SVG)
function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const width = 100;
  const height = 24;
  const padding = 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-blue-400"
      />
    </svg>
  );
}

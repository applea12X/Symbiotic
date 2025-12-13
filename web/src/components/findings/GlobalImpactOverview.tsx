import { SectionHeader } from "./shared/SectionHeader";
import { MetricCard } from "./shared/MetricCard";
import { AttributionScore, EfficiencyMetric } from "@/types/findings";
import { Tooltip } from "./shared/Tooltip";

interface GlobalImpactOverviewProps {
  attributionScore: AttributionScore;
  efficiencyMetrics: EfficiencyMetric[];
}

export function GlobalImpactOverview({
  attributionScore,
  efficiencyMetrics,
}: GlobalImpactOverviewProps) {
  return (
    <section className="mb-16">
      <SectionHeader
        subtitle="Section 1"
        title="Global Impact Overview"
        description="Quantifying machine learning's contribution to scientific discovery across all disciplines."
      />

      {/* Attribution Score Visualization */}
      <div className="glass rounded-2xl p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-semibold text-white/90">
            Attribution Score
          </h3>
          <Tooltip content="Estimated contribution of ML tooling vs domain-specific insight to scientific outcomes. Based on controlled analysis of 847K papers." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <p className="text-4xl font-bold text-blue-400">
                {attributionScore.mlContribution}%
              </p>
              <p className="text-sm text-white/60">ML Contribution</p>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                style={{ width: `${attributionScore.mlContribution}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <p className="text-4xl font-bold text-purple-400">
                {attributionScore.domainInsight}%
              </p>
              <p className="text-sm text-white/60">Domain Insight</p>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                style={{ width: `${attributionScore.domainInsight}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-white/40 mt-4">
          Confidence interval: [{attributionScore.confidenceInterval[0]}%,{" "}
          {attributionScore.confidenceInterval[1]}%] — Causal decomposition
          remains methodologically challenging
        </p>
      </div>

      {/* Efficiency Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {efficiencyMetrics.map((metric, i) => (
          <MetricCard
            key={i}
            label={metric.label}
            value={metric.value.toLocaleString()}
            unit={metric.unit}
            tooltip={metric.description}
            sparkline={metric.trend}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { SectionHeader } from "./shared/SectionHeader";
import { CaseTrace, CaseTraceEvent } from "@/types/findings";
import { ChevronDown, ChevronRight, Zap, Users, TrendingUp } from "lucide-react";

interface CaseTracesProps {
  caseTraces: CaseTrace[];
}

export function CaseTraces({ caseTraces }: CaseTracesProps) {
  const [expandedCase, setExpandedCase] = useState<string | null>(caseTraces[0]?.id || null);

  return (
    <section className="mb-16">
      <SectionHeader
        subtitle="Section 5"
        title="Discovery-to-Impact Case Traces"
        description="Documented examples of ML methods translating into real-world scientific and therapeutic outcomes."
      />

      <div className="space-y-4">
        {caseTraces.map((caseTrace) => (
          <div key={caseTrace.id} className="glass rounded-2xl overflow-hidden">
            {/* Case Header */}
            <button
              onClick={() =>
                setExpandedCase(expandedCase === caseTrace.id ? null : caseTrace.id)
              }
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-white/90 mb-1">
                  {caseTrace.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <span>
                    <span className="font-medium text-white/60">Method:</span>{" "}
                    {caseTrace.mlMethod}
                  </span>
                  <span>•</span>
                  <span>
                    <span className="font-medium text-white/60">Domain:</span>{" "}
                    {caseTrace.domain}
                  </span>
                  <span>•</span>
                  <span>
                    <span className="font-medium text-blue-400">
                      {caseTrace.impactMetric.label}:
                    </span>{" "}
                    {caseTrace.impactMetric.value}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                {expandedCase === caseTrace.id ? (
                  <ChevronDown className="w-5 h-5 text-white/60" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/60" />
                )}
              </div>
            </button>

            {/* Timeline (expanded) */}
            {expandedCase === caseTrace.id && (
              <div className="px-6 pb-6 border-t border-white/10">
                <div className="relative pl-8 pt-6">
                  {/* Vertical line */}
                  <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

                  {caseTrace.timeline.map((event, i) => (
                    <TimelineEvent
                      key={i}
                      event={event}
                      isLast={i === caseTrace.timeline.length - 1}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

interface TimelineEventProps {
  event: CaseTraceEvent;
  isLast: boolean;
}

function TimelineEvent({ event, isLast }: TimelineEventProps) {
  const phaseConfig = {
    method: {
      icon: Zap,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/40",
    },
    adoption: {
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/40",
    },
    impact: {
      icon: TrendingUp,
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
      borderColor: "border-pink-500/40",
    },
  };

  const config = phaseConfig[event.phase];
  const Icon = config.icon;

  return (
    <div className={`relative ${isLast ? "pb-0" : "pb-8"}`}>
      {/* Dot and icon */}
      <div
        className={`absolute -left-[1.4rem] w-9 h-9 rounded-full border-2 ${config.borderColor} ${config.bgColor} backdrop-blur-sm flex items-center justify-center z-10`}
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="ml-6">
        <div className="mb-1 flex items-center gap-3">
          <p className="text-xs font-medium text-white/40">{event.date}</p>
          <span
            className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.bgColor} ${config.color} border ${config.borderColor}`}
          >
            {event.phase}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-white/90 mb-1">
          {event.title}
        </h4>
        <p className="text-sm text-white/60 leading-relaxed mb-2">
          {event.description}
        </p>
        {event.metric && (
          <div className="inline-flex items-baseline gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <span className="text-xs text-white/50">{event.metric.label}:</span>
            <span className="text-sm font-bold text-white/90">
              {event.metric.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

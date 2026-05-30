import React from "react";

function InsightPanel({insight}) {
  return (
    <div className="relative glass-panel rounded-3xl p-6 border border-primary/15 overflow-hidden">
      {/*//* Ambient glows */}
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-secondary/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
        {/*//* Left — AI label + message */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <span
                className="material-symbols-outlined text-white text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                psychology
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                AI Coach Priority
              </p>
              <p className="text-[10px] text-on-surface-variant">Just Now</p>
            </div>
          </div>

          <p className="text-on-surface text-sm leading-relaxed">
            Your technical skills are strong, but{" "}
            <span className="text-primary font-semibold">
              {insight.priority} needs improvement
            </span>{" "}
            to reach senior level. Focus on empathy-driven storytelling in your
            next session.
          </p>

          {/*//* CTA */}
          <button className="mt-4 flex items-center gap-2 text-xs font-bold text-primary hover:text-secondary transition-colors uppercase tracking-widest">
            Start Targeted Drill
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>

        {/*//* Right — score + trend */}
        <div className="flex-shrink-0 text-center md:text-right">
          <p className="font-headline font-extrabold text-5xl text-primary">
            {insight.score}
          </p>
          <p className="text-xs text-on-surface-variant mb-2">Overall Score</p>
          <div className="flex items-center justify-center md:justify-end gap-1">
            <span className="material-symbols-outlined text-[#48e5d0] text-sm">
              trending_up
            </span>
            <span className="text-xs font-bold text-[#48e5d0]">
              {insight.trend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsightPanel;

import { useState } from "react"

//todo STEP-1: Floating AI mentor panel — bottom right corner
//todo STEP-2: Dismissable with close button

export default function AIMentorPanel({ insight }) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="fixed bottom-8 right-8 max-w-sm z-50"
      style={{ animation: "bounce-subtle 4s ease-in-out infinite" }}>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
      `}</style>

      <div className="glass-panel rounded-2xl p-6 shadow-2xl border-l-4 border-[#48e5d0] border-t-0 border-r-0 border-b-0 relative">

        <div className="flex items-start gap-4">
          {/*//* Icon */}
          <div className="w-11 h-11 rounded-full bg-[#48e5d0]/15 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#48e5d0]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              smart_toy
            </span>
          </div>

          {/*//* Content */}
          <div className="flex-1 space-y-2">
            <h6 className="font-headline font-bold text-on-surface">AI Mentor Suggestion</h6>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {insight.message} Recommended focus:{" "}
              <span className={`font-bold ${insight.highlightColor}`}>
                {insight.highlight}
              </span>.
            </p>
            <button className="text-xs font-bold uppercase tracking-widest text-[#48e5d0] hover:text-[#48e5d0]/70 transition-colors pt-1">
              Apply Strategy
            </button>
          </div>

          {/*//* Close */}
          <button
            onClick={() => setVisible(false)}
            className="text-on-surface-variant hover:text-error transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  )
}
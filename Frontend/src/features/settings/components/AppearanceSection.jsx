// STEP-1: Theme preview cards — dark and light

const themes = [
  {
    id: 'dark',
    label: 'Obsidian Deep',
    preview: (
      <div className="w-full h-20 rounded-xl bg-[#060e20] flex flex-col p-2 gap-1.5">
        <div className="flex gap-1">
          <div className="w-12 h-full rounded bg-[#091328]" />
          <div className="flex-1 space-y-1">
            <div className="h-2 bg-[#a3a6ff]/30 rounded w-3/4" />
            <div className="h-1.5 bg-white/10 rounded w-1/2" />
          </div>
        </div>
        <div className="h-2 bg-[#a3a6ff]/20 rounded w-full" />
        <div className="h-2 bg-white/5 rounded w-2/3" />
      </div>
    ),
  },
  {
    id: 'light',
    label: 'Luminous Light',
    preview: (
      <div className="w-full h-20 rounded-xl bg-[#f0f4ff] flex flex-col p-2 gap-1.5">
        <div className="flex gap-1">
          <div className="w-12 h-full rounded bg-[#e0e6ff]" />
          <div className="flex-1 space-y-1">
            <div className="h-2 bg-[#4f52b2]/40 rounded w-3/4" />
            <div className="h-1.5 bg-[#4f52b2]/20 rounded w-1/2" />
          </div>
        </div>
        <div className="h-2 bg-[#4f52b2]/20 rounded w-full" />
        <div className="h-2 bg-[#4f52b2]/10 rounded w-2/3" />
      </div>
    ),
  },
]

export default function AppearanceSection({ theme, onThemeChange }) {
  return (
    <div className="glass-panel rounded-3xl p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-secondary"
          style={{ fontVariationSettings: "'FILL' 1" }}>
          palette
        </span>
        <h2 className="font-headline font-bold text-2xl text-on-surface">Appearance</h2>
      </div>

      {/* Theme cards */}
      <div className="grid grid-cols-2 gap-4">
        {themes.map((t) => {
          const isActive = theme === t.id
          return (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`relative p-4 rounded-2xl border text-left transition-all duration-300 ${isActive
                  ? 'border-primary shadow-[0_0_20px_rgba(163,166,255,0.15)]'
                  : 'border-white/5 bg-surface-container-high hover:border-white/10'
                }`}
            >
              {/* Preview */}
              {t.preview}

              {/* Label + active */}
              <div className="flex items-center justify-between mt-3">
                <p className={`font-headline font-semibold text-sm ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {t.label}{isActive ? ' (Active)' : ''}
                </p>
                {isActive && (
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[10px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
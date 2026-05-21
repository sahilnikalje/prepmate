import React from 'react'

function RecommendedCard({resource}) {
  const isLarge=resource.size==='large'
  return (
        <div className="glass-panel rounded-3xl p-7 flex flex-col gap-5 hover:border-primary/20 transition-all duration-300 border border-white/5">

      {/*//* Badge + duration */}
      <div className="flex items-start justify-between gap-3">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${resource.badgeColor}`}>
          {resource.badge}
        </span>
        <div className="flex items-center gap-1.5 text-on-surface-variant flex-shrink-0">
          <span className="material-symbols-outlined text-sm">schedule</span>
          <span className="text-xs font-semibold">{resource.duration}</span>
        </div>
      </div>

      {/*//* Title */}
      <h3 className="font-headline font-bold text-2xl text-on-surface leading-tight">
        {resource.title}
      </h3>

      {/*//* Description */}
      <p className="text-on-surface-variant text-sm leading-relaxed flex-1">
        {resource.desc}
      </p>

      {/*//* Tags + CTA */}
      <div className="flex items-center justify-between gap-4 mt-auto">
        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag, i) => (
            <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-full ${resource.tagStyle}`}>
              {tag}
            </span>
          ))}
        </div>
        <button className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 flex-shrink-0 ${resource.ctaStyle}`}>
          {resource.cta}
        </button>
      </div>
    </div>
  )
}

export default RecommendedCard
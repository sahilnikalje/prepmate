import { useState, useEffect } from "react"
import resourcesService from "../services/resourcesService"

// STEP-1: Full resource detail modal
// Opens when user clicks any resource card

export default function ResourceDetail({ resourceId, onClose }) {
  const [resource, setResource] = useState(null)
  const [loading,  setLoading]  = useState(true)

  // STEP-2: Fetch full resource on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await resourcesService.getResourceById(resourceId)
        setResource(data.resource)
      } catch (err) {
        console.error('Failed to load resource:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [resourceId])

  // STEP-3: Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const diffColor = {
    Beginner:     'text-[#48e5d0] bg-[#48e5d0]/10',
    Intermediate: 'text-secondary bg-secondary/10',
    Advanced:     'text-error bg-error/10',
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="glass-panel rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-primary/20">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <svg className="w-8 h-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}

        {/* Content */}
        {!loading && resource && (
          <div className="p-8 space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {resource.category}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${diffColor[resource.difficulty] || 'text-primary bg-primary/10'}`}>
                    {resource.difficulty}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-on-surface-variant">
                    {resource.type}
                  </span>
                </div>
                <h2 className="font-headline font-bold text-2xl text-on-surface">{resource.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-error transition-all flex-shrink-0"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Question */}
            <div className="bg-surface-container-low rounded-2xl p-5 border-l-4 border-primary">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Question</p>
              <p className="text-on-surface leading-relaxed">{resource.question}</p>
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#48e5d0] uppercase tracking-widest">Answer</p>
              <p className="text-on-surface-variant leading-relaxed">{resource.answer}</p>
            </div>

            {/* Explanation */}
            {resource.explanation && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Explanation</p>
                <p className="text-on-surface-variant leading-relaxed text-sm">{resource.explanation}</p>
              </div>
            )}

            {/* AI Insight */}
            {resource.aiInsight && (
              <div className="glass-panel rounded-2xl p-5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xs"
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      psychology
                    </span>
                  </div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">AI Insight</p>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed italic">"{resource.aiInsight}"</p>
              </div>
            )}

            {/* Tags */}
            {resource.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/5 text-on-surface-variant">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* External Links */}
            {resource.externalLinks?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Practice Here</p>
                <div className="flex flex-wrap gap-3">
                  {resource.externalLinks.map((link, i) => (
                    <a>
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-all"
                    
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Footer meta */}
            <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {resource.duration}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">visibility</span>
                {resource.viewCount} views
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">category</span>
                {resource.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
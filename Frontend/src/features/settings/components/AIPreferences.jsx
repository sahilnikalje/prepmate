import { useState } from 'react'

// STEP-1: Voice option cards data
const voiceOptions = [
  {
    id:    'female',
    name:  'Aria',
    desc:  'Warm & Encouraging',
    icon:  'face',
    color: 'text-secondary',
    bg:    'bg-secondary/10',
  },
  {
    id:    'male',
    name:  'Atlas',
    desc:  'Direct & Professional',
    icon:  'face_3',
    color: 'text-primary',
    bg:    'bg-primary/10',
  },
]

export default function AIPreferences({ voice, autoSave, onVoiceChange, onAutoSaveChange }) {
  return (
    <div className="glass-panel rounded-3xl p-8 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
        <h2 className="font-headline font-bold text-2xl text-on-surface">AI Interview Preferences</h2>
      </div>

      {/* Voice selection */}
      <div className="space-y-4">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          AI Voice Preference
        </p>
        <div className="grid grid-cols-2 gap-4">
          {voiceOptions.map((v) => {
            const isActive = voice === v.id
            return (
              <button
                key={v.id}
                onClick={() => onVoiceChange(v.id)}
                className={`relative p-5 rounded-2xl border text-left transition-all duration-300 ${
                  isActive
                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(163,166,255,0.15)]'
                    : 'border-white/5 bg-surface-container-high hover:border-white/10'
                }`}
              >
                {/* Active check */}
                {isActive && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xs"
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  </div>
                )}

                <div className={`w-10 h-10 rounded-xl ${v.bg} flex items-center justify-center mb-3`}>
                  <span className={`material-symbols-outlined ${v.color}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    {v.icon}
                  </span>
                </div>

                <p className="font-headline font-bold text-on-surface">{v.name}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{v.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Auto Save toggle */}
      <div className="flex items-center justify-between p-5 bg-surface-container-high rounded-2xl">
        <div>
          <p className="font-semibold text-on-surface">Auto-Save Session Transcripts</p>
          <p className="text-xs text-on-surface-variant mt-1">
            Automatically store all AI feedback and interview text in your library.
          </p>
        </div>

        {/* STEP-2: Toggle switch */}
        <button
          onClick={() => onAutoSaveChange(!autoSave)}
          className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
            autoSave ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-white/10'
          }`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
            autoSave ? 'left-6' : 'left-0.5'
          }`} />
        </button>
      </div>
    </div>
  )
}
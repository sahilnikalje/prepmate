import React, { useEffect, useRef, useState } from 'react'

function CameraView({ question, transcript, isListening, isSpeaking }) {
  const videoRef = useRef(null)

  // Persist the last question so subtitle never disappears
  const [displayedQuestion, setDisplayedQuestion] = useState(question)

  // Update displayed question only when a new non-empty question arrives
  useEffect(() => {
    if (question && question.trim()) {
      setDisplayedQuestion(question)
    }
  }, [question])

  // Start webcam on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.warn('Camera not available:', err)
      }
    }
    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // What to show in the subtitle bar
  const subtitleText = isListening && transcript ? transcript : displayedQuestion
  const isShowingTranscript = isListening && transcript

  return (
    <div className='w-full max-w-3xl mx-auto flex flex-col gap-4 flex-shrink-0'>

      {/* ── Camera box ──────────────────────────────────────────────────── */}
      <div
        className='relative w-full overflow-hidden bg-surface-container-low shadow-2xl'
        style={{
          aspectRatio: '16/9',
          maxHeight: '42vh',
          borderRadius: '1.25rem',
          border: '1.5px solid rgba(163,166,255,0.12)',
          boxShadow: '0 0 0 1px rgba(163,166,255,0.07), 0 8px 48px 0 rgba(0,0,0,0.45)',
        }}
      >
        {/* Webcam feed */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className='w-full h-full object-cover scale-x-[-1]'
        />

        {/* Soft vignette overlay for immersion */}
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.38) 100%)',
          }}
        />

        {/* Bottom gradient for text legibility */}
        <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/50 to-transparent pointer-events-none' />

        {/* Corner accents — refined */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/35 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary/35 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/20 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary/20 rounded-br-lg" />

        {/* REC badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
          <span className="text-[9px] font-bold tracking-[0.15em] text-white/80 uppercase">Live</span>
        </div>
      </div>

      {/* ── Subtitle / Question box ─────────────────────────────────────── */}
      <div className='w-full'>
        <div
          className='bg-surface-variant/40 backdrop-blur-3xl px-6 py-4 rounded-2xl inner-glow w-full text-center'
          style={{ minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <p
            className={`font-headline text-base font-medium leading-relaxed transition-colors duration-300 ${isShowingTranscript ? 'text-tertiary-dim' : 'text-on-surface'
              }`}
          >
            "{subtitleText}"
          </p>
        </div>

        {/* Status indicators */}
        <div className='flex items-center justify-center gap-4 mt-2 h-6'>
          {isListening && (
            <div className='flex items-center justify-center gap-2'>
              <div className='flex gap-1'>
                <div className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-1 h-5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-1 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
              <span className='font-headline font-extrabold text-xs tracking-[0.2em] text-primary italic'>
                LISTENING...
              </span>
            </div>
          )}

          {isSpeaking && !isListening && (
            <div className='flex items-center justify-center gap-2'>
              <span className='material-symbols-outlined text-secondary text-sm animate-pulse'>volume_up</span>
              <span className='font-headline font-extrabold text-xs tracking-[0.2em] text-secondary italic'>
                AI SPEAKING...
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default CameraView
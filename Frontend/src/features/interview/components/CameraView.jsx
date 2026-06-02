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

  // What to show in the subtitle bar (transcript shown separately in InterviewPage)
  const isShowingTranscript = isListening && transcript

  return (
    <div className='w-full max-w-4xl mx-auto flex flex-col gap-3 flex-shrink-0'>

      {/* ── Two equal square sections side by side ──────────────────────── */}
      <div className='flex gap-4 w-full'>

        {/* ── LEFT SQUARE: AI Question / Subtitles ──────────────────────── */}
        <div
          className='flex-1 relative overflow-hidden bg-surface-container-low flex flex-col items-center justify-center'
          style={{
            aspectRatio: '1/1',
            maxHeight: '38vh',
            borderRadius: '1.25rem',
            border: '1.5px solid rgba(163,166,255,0.15)',
            boxShadow: '0 0 0 1px rgba(163,166,255,0.07), 0 8px 48px 0 rgba(0,0,0,0.45)',
            background: 'linear-gradient(135deg, rgba(163,166,255,0.06) 0%, rgba(10,10,30,0.95) 100%)',
          }}
        >
          {/* Atmospheric glow */}
          <div
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none'
            style={{ background: 'radial-gradient(circle, rgba(163,166,255,0.12) 0%, transparent 70%)' }}
          />

          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/35 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary/35 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/20 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary/20 rounded-br-lg" />

          {/* AI label badge */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-bold tracking-[0.15em] text-white/80 uppercase">AI Question</span>
          </div>

          {/* Status: AI speaking indicator */}
          {isSpeaking && !isListening && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-secondary/20 backdrop-blur-md px-2 py-1 rounded-full">
              <span className='material-symbols-outlined text-secondary text-xs animate-pulse'>volume_up</span>
              <span className='font-headline font-extrabold text-[8px] tracking-widest text-secondary uppercase'>Speaking</span>
            </div>
          )}

          {/* Waveform animation when AI is speaking */}
          <div className='absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1 items-end h-6'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full ${isSpeaking ? 'bg-primary/60' : 'bg-primary/20'}`}
                style={{
                  height: isSpeaking ? `${Math.random() * 12 + 8}px` : '4px',
                  animation: isSpeaking ? `bounce 0.6s ${i * 0.1}s infinite alternate` : 'none',
                  transition: 'height 0.3s',
                }}
              />
            ))}
          </div>

          {/* Question text */}
          <div className='relative z-10 px-6 text-center flex flex-col items-center gap-3'>
            <p
              className='font-headline text-base font-semibold leading-relaxed text-on-surface'
              style={{ textShadow: '0 2px 12px rgba(163,166,255,0.18)' }}
            >
              "{displayedQuestion}"
            </p>
          </div>
        </div>

        {/* ── RIGHT SQUARE: User Camera Feed ────────────────────────────── */}
        <div
          className='flex-1 relative overflow-hidden bg-surface-container-low'
          style={{
            aspectRatio: '1/1',
            maxHeight: '38vh',
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
          <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/50 to-transparent pointer-events-none' />

          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary/35 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary/35 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary/20 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary/20 rounded-br-lg" />

          {/* REC badge */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
            <span className="text-[9px] font-bold tracking-[0.15em] text-white/80 uppercase">Live</span>
          </div>

          {/* Listening indicator */}
          {isListening && (
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full'>
              <div className='flex gap-0.5 items-end h-4'>
                <div className="w-1 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-1 h-4 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
              <span className='font-headline font-extrabold text-[9px] tracking-[0.2em] text-primary uppercase'>
                Listening
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Transcript / Answer area (unchanged position) ───────────────── */}
      <div className='w-full'>
        <div
          className='bg-surface-variant/40 backdrop-blur-3xl px-6 py-3 rounded-2xl inner-glow w-full text-center'
          style={{ minHeight: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <p
            className={`font-headline text-base font-medium leading-relaxed transition-colors duration-300 ${
              isShowingTranscript ? 'text-tertiary-dim' : 'text-on-surface/50'
            }`}
          >
            {isShowingTranscript
              ? `"${transcript}"`
              : <span className='text-on-surface-variant text-sm italic'>Your answer will appear here as you speak...</span>
            }
          </p>
        </div>
      </div>

    </div>
  )
}

export default CameraView
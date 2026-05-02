import React from 'react'

function ControlBar({isListening, isSpeaking, isMuted, onToggleMute, onToggleListen, onEndInterview}) {
  return (
    <footer className='h-28 flex items-center justify-center px-12 relative z-50 flex-shrink-0'>
       <div className='flex items-center gap-20'>
         
       {/*//* Mute button */}
        <button
         onClick={onToggleMute}
         className='flex flex-col items-center gap-2 group'
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all group-active:scale-95 inner-glow ${
            isMuted ? "bg-error/20" : "bg-surface-container-high"
           }`}>
            <span className={`material-symbols-outlined transition-colors ${
              isMuted ? "text-error" : "text-on-surface-variant group-hover:text-primary"
             }`}>
              {isMuted ? 'mic_off' : 'mic'}
            </span>
          </div>

          <span className='font-label text-[10px] font-bold tracking-widest text-on-surface-variant uppercase'>
             {isMuted ? 'Unmute' : 'Mute'}
          </span>
        </button>
  {/*//* Center mic button — main action */}
  {/*//* Disabled while AI is speaking */}
      <div className='flex flex-col items-center gap-3 -translate-y-3'>
        <button
          onClick={onToggleListen}
          disabled={isSpeaking}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
              isListening
                ? "bg-gradient-to-br from-secondary to-primary mic-glow"
                : "bg-gradient-to-br from-primary to-secondary mic-glow"
            }`}
        >
          <span
           className='material-symbols-outlined text-white text-2xl'
           style={{fontVariationSettings:"'FILL'1"}}
          >
            {isListening ? 'stop_circle' : 'psychology'}
          </span>
        </button>
        <span
         className='font-headline font-extrabold text-xs tracking-[0.2em] text-primary italic'
        >
         {isSpeaking ? "AI SPEAKING..." : isListening ? "STOP" : 'SPEAK'}
        </span>
      </div>

   {/*//* End Interview button */}
      <button
        onClick={onEndInterview}
        className='flex flex-col items-center gap-2 group'
      >
        <div className='w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center transition-all group-hover:bg-error-container/40 group-active:scale-95 border border-error/10'>
          <span
           className='material-symbols-outlined text-error'
           style={{fontVariationSettings: "'FILL'1"}}
          >
            call_end
          </span>
        </div>
        <span className='font-label text-[10px] font-bold tracking-widest text-error/80 uppercase'>
          End
        </span>
      </button>
       </div>

  {/*//* Utility buttons — right side */}
     <div className='absolute right-12 flex gap-2'>
       <button className='p-2.5 rounded-full hover:bg-white/5 transition-all text-on-surface-variant hover:text-on-surface'>
         <span className='material-symbols-outlined text-xl'>settings</span>
       </button>
       <button className='p-2.5 rounded-full hover:bg-white/5 transition-all text-on-surface-variant hover:text-on-surface'>
         <span className='material-symbols-outlined text-xl'>help</span>
       </button>
     </div>
    </footer>
  )
}

export default ControlBar
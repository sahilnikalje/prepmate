import React, { useEffect, useRef } from 'react'

function CameraView({question, transcript, isListening, isSpeaking}) {
   const videoRef=useRef(null)

 //todo Start webcam on mount
   useEffect(()=>{
     const startCamera=async()=>{
      try{
        const stream=await navigator.mediaDevices.getUserMedia({video:true, audio:false})
        if(videoRef.current){
          videoRef.current.srcObject=stream
        }
      }
     catch(err){
       console.warn('Camera not available:', err)
      }
     } 
     startCamera()

     return ()=>{
       if(videoRef.current?.srcObject){
         videoRef.current.srcObject.getTracks().forEach((track)=>track.stop())
       }
     }
   },[]) 
  return (
    <div className='relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-surface-container-low shadow-2xl flex-shrink-0'
         style={{aspectRatio:'16/9', maxHeight:'55vh'}}
    >
     {/*//* Webcam feed */}
       <video
         ref={videoRef}
         autoPlay
         muted
         playsInline
         className='w-full h-full object-cover scale-x-[-1]' //! mirror effect
       />

     {/*//todo Dark gradient overlay at bottom for text readability */}
       <div className='absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent'/>

     {/*//* Corner focus accents */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />

    {/*//* Bottom overlay — question subtitle OR transcript */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 text-center z-10'>
        <div className='bg-surface-variant/40 backdrop-blur-3xl px-8 py-4 rounded-xl inner-glow'>

          {/*//* Show transcript while listening, question while speaking or idle */}
            {isListening && transcript ? (
              <p className='font-headline text-base lg:text-lg font-medium leading-relaxed text-tertiary-dim'>
                "{transcript}"
              </p>
            ):(
              <p className='font-headline text-base lg:text-lg font-medium leading-relaxed text-on-surface'>
                "{question}"
              </p>
            )}
        </div>

    {/*//* Listening indicator below subtitle */}
       {isListening && (
         <div className='flex items-center justify-center gap-3 mt-3'>
           <div className='flex gap-1'>
              <div className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}/>
              <div className="w-1 h-5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}/>
              <div className="w-1 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}/>
           </div>
           <span className='font-headline font-extrabold text-xs tracking-[0.2em] text-primary italic'>
             LISTENING...
           </span>
         </div>
       )}

    {/*//* Speaking indicator */}
      {isSpeaking && (
        <div className='flex items-center justify-center gap-2 mt-3'>
           <span className='material-symbols-outlined text-secondary text-sm animate-pulse'>volume_up</span>
           <span className='font-headline font-extrabold text-xs tracking-[0.2em] text-secondary italic'>
              AI SPEAKING...
           </span>
        </div>
      )}
      </div>
    </div>
  )
}

export default CameraView
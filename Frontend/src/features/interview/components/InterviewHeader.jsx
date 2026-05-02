import React from 'react'

function InterviewHeader({title, role, currentIndex, total}) {
  return (
    <header className='h-16 px-8 flex justify-between items-center w-full z-50 flex-shrink-0'>

     {/*//* Left — job info */}
       <div className='flex flex-col'>
         <h1 className='font-headline font-bold text-base tracking-tight text-on-surface'>
           {role} Interview
         </h1>
         <p className='font-label text-xs text-on-surface-variant'>
           Round 1: Technical & Behavioral
         </p>
       </div>   
     
     {/*//* Right — stage pill */}
       <div className='bg-surface-container-high/60 backdrop-blur-xl px-5 py-2 rounded-full flex items-center gap-3 inner-glow'>
         <div className='flex gap-1.5'>
           {Array.from({length:total}).map((_,i)=>(
             <div
               key={i}
               className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? "bg-primary" : "bg-surface-variant"
                }`}
             />
           ))}
         </div>
         <span className='font-headline font-semibold text-sm text-primary tracking-wide'>
           Stage {currentIndex + 1} of {total}
         </span>
       </div>
    </header>
  )
}

export default InterviewHeader
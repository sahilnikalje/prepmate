import React from 'react'

function ContinueLearning({item}) {
  return (
    <div className={`glass-panel rounded-2xl p-5 border-l-4 ${item.borderColor} border-t-0 border-r-0 border-b-0`}>
       
      {/*//* Title + % */}
         <div className='flex items-start justify-between mb-3'>
           <h5 className='font-headline font-bold text-on-surface text-sm'>{item.title}</h5>
           <span className='text-xs text-on-surface-variant flex-shrink-0 ml-2'>{item.progress}% Done</span>
         </div>
        
      {/*//* Progress bar */}
         <div className='h-1 bg-white/10 rounded-full overflow-hidden'>
           <div
             className={`h-full ${item.barColor} rounded-full transition-all duration-700`}
             style={{width:`${item.progress}%`}}
           />
         </div>
        
      {/*//* Resume button */}
         <button className={`mt-4 text-xs font-bold flex items-center gap-1 hover:underline ${item.textColor}`}>
           Resume Reading
           <span className='material-symbols-outlined text-sm'>play_arrow</span>
         </button>
    </div>

     
  )
}

export default ContinueLearning
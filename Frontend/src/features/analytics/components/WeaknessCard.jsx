import React from 'react'

function WeaknessCard({area}) {
  return (
    <div className='glass-panel rounded-2xl p-5 hover:border-white/10 transition-all duration-300'>

     {/*//* Top row — title + score */}
       <div className='flex items-center justify-between mb-3'>
         <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0'>
              <span className={`material-symbols-outlined text-sm ${area.color}`}>
                {area.icon}
              </span>
            </div>
            <h4 className='font-headline font-semibold text-on-surface text-sm'>
                {area.title}
            </h4>
         </div>
         <span className={`font-headline font-bold text-xl ${area.color}`}>
            {area.score}
         </span>
       </div>

     {/*//* Progress bar */}
        <div className='h-1 bg-white/10 rounded-full overflow-hidden mb-3'>
           <div
              className={`h-full bg-gradient-to-r ${area.barColor} rounded-full`}
          style={{ width: `${area.score}%` }}
           />
        </div>
     
     {/*//* Insight text */}
         <div className='flex items-start gap-2'>
            <span className='material-symbols-outlined text-on-surface-variant text-sm flex-shrink-0 mt-0.5'>
                info
            </span>
            <p className='text-xs text-on-surface-variant leading-relaxed italic'>
                "{area.insight}"
            </p>
         </div>
    </div>
  )
}

export default WeaknessCard
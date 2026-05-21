import React from 'react'

function PracticeSetCard({set}) {
  return (
    <div className='flex items-center gap-5 p-5 bg-surface-container-low rounded-2xl
      hover:bg-surface-container-high transition-all duration-300 group cursor-pointer'>

      {/*//* Icon box */}
        <div className={`w-14 h-14 rounded-2xl ${set.iconBg} flex items-center justify-center flex-shrink-0`}>
          <span className={`material-symbols-outlined text-2xl ${set.iconColor}`}>
            {set.icon}
          </span>
        </div>
      
      {/*//* Title + meta */}
         <div className='flex-1 min-w-0'>
            <h4 className='font-headline font-bold text-on-surface'>{set.title}</h4>
            <p className='text-xs text-on-surface-variant mt-0.5'>{set.meta}</p>
         </div>
      
      {/*//* Badge + arrow */}
         <div className='flex flex-col items-end gap-2 flex-shrink-0'>
           <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${set.badgeColor}`}>
             {set.badge}
           </span>
           <span className='material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform'>
              arrow_forward
           </span>
         </div>
    </div>
  )
}

export default PracticeSetCard
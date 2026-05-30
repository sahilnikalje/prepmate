import React from 'react'

function StrengthCard({strength}) {
    const isLarge=strength.size==='large'
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-surface-container-high
      border border-white/5 hover:border-primary/20 transition-all duration-300
      ${isLarge ? "p-8" : "p-6"}`}
    >

     {/*//* Decorative glow blob */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
    
     {/*//* Tag */}
        <div className='flex items-center justify-between mb-6'>
            <span className={`text-xs font-bold uppercase tracking-widest ${strength.tagColor}`}>
                {strength.tag}
            </span>
            <div className='p-2 bg-white/5 rounded-xl'>
               <span className='material-symbols-outlined text-primary text-sm'
                   style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {strength.icon}
               </span>
            </div>
        </div>
    
     {/*//* Title + Score row */}
        <div className='flex items-end justify-between mb-3'>
            <div className='flex-1'>
                <h3 className={`font-headline font-bold text-on-surface ${isLarge ? "text-3xl" : "text-xl"}`}>
                    {strength.title}
                </h3>
             {isLarge && (
                <p className='text-on-surface-variant text-sm mt-3 leading-relaxed max-w-xs'>
                    {strength.desc}
                </p>
             )}
             {!isLarge && (
                <p className='text-on-surface-variant text-xs mt-2 leading-relaxed'>
                    {strength.desc}
                </p>
             )}
            </div>

         {/*//* Big score number */}
            <span className={`font-headline font-extrabold text-on-surface/20 flex-shrink-0 ml-4
               ${isLarge ? "text-7xl" : "text-5xl"}`}>
                  {strength.score}
            </span>
        </div>
         
         {/*//* Progress bar */}
           <div className='mt-4'>
               <div className='flex items-center justify-between mb-2'>
                  <span className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant'>
                     Score
                  </span>
                  <span className='text-sm font-bold text-on-surface'>{strength.score}%</span>
               </div>
               <div className='h-1.5 bg-white/10 rounded-full overflow-hidden'>
                  <div 
                     className={`h-full bg-gradient-to-r ${strength.barColor} rounded-full`}
                      style={{ width: `${strength.score}%` }}
                   />

                  </div>
               </div>
           </div>
  )
}

export default StrengthCard
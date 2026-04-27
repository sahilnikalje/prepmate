import React from 'react'

const tips = [
  {
    icon:  "lightbulb",
    color: "text-[#48e5d0]",
    text:  "The more detailed the job description, the more accurate the AI feedback will be.",
  },
  {
    icon:  "verified",
    color: "text-secondary",
    text:  "Practice in a quiet environment for the best audio analysis performance.",
  },
]


function PracticeTips() {
  return (
    <div className='px-2 space-y-4 mt-6'>
       {tips.map((tip, i)=>(
         <div key={i} className='flex gap-3 items-start'>
           <span className={`material-symbols-outlined text-xl flex-shrink-0 ${tip.color}`}>
             {tip.icon}
           </span>
           <p className='text-xs text-on-surface-variant leading-relaxed'>{tip.text}</p>
         </div>
       ))}
    </div>
  )
}

export default PracticeTips
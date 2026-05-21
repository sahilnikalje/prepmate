import React from 'react'

function CategoryCard({category}) {
  return (
    <div className='glass-panel rounded-2xl p-5 flex flex-col items-center text-center gap-3
      hover:border-white/10 transition-all duration-300 cursor-pointer group border border-white/5'>
       
      {/*//* Icon */}
         <div className={`w-14 h-14 rounded-2xl ${category.bg} flex items-center justify-center
           group-hover:scale-110 transition-transform duration-300`}>
            <span className={`material-symbols-outlined text-2xl ${category.color}`}>
              {category.icon}
            </span>
         </div>

      {/*//* Label + count */}
         <div>
            <p className='font-headline font-bold text-on-surface text-sm'>{category.label}</p>
            <p className='text-xs text-on-surface-variant mt-0.5'>{category.count} resources</p>
         </div>
    </div>
  )
}

export default CategoryCard
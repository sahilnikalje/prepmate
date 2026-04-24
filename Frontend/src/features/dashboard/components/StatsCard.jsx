import React from 'react'

function StatsCard({stat}) {
  return (
    <div className={`glass-panel p-6 rounded-lg ${stat.highlight ? "border-l-4 border-[#6f00be]" : ""}`}>

        {/*//* Top row — icon + badge */}
         <div className='flex items-center justify-between mb-4'>
            <div className={`p-2 ${stat.iconBg} rounded-lg`}>
                <span className={`material-symbols-outlined ${stat.iconColor}`}>
                    {stat.icon}
                </span>
            </div>
            <span className={`text-xs font-bold ${stat.badgeColor}`}>
                {stat.badge}
            </span>
         </div>

         {/*//* Label */}
         <p className='text-on-surface-variant text-sm font-medium'>
            {stat.label}
         </p>

         <h3 className='text-3xl font-extrabold font-headline mt-1'>
            {stat.value}
            {stat.suffix && (
                <span className='text-lg text-on-surface-variant'>
                    {stat.suffix}
                </span>
            )}
         </h3>
    </div>
  )
}

export default StatsCard
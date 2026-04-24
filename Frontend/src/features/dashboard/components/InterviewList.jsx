//todo STEP-1: InterviewList receives the interviews array as a prop
//todo Each item is rendered using the dummy data structure

import React from 'react'

function InterviewList({interviews}) {
  return (
    <section className='glass-panel rounded-lg p-8'>

        {/*//* Header */}
        <div className='flex items-center justify-between mb-8'>
            <h3 className='text-2xl font-bold font-headline'>
                Recent Interviews
            </h3>
            <button className='text-primary font-semibold text-sm hover:underline'>
                View All
            </button>
        </div>

        {/*//* Loop over interviews and render each item */}
         <div className='space-y-4'>
            {interviews.map((item)=>(
                <div
                  key={item.id}
                  className='flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-container-low/50 hover:bg-surface-container-high transition-all rounded-xl gap-4 group'
                >
                 {/*//* Left — icon + title + date */}
                   <div className='flex items-center gap-4'>
                      <div className={`w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center ${item.iconColor} border border-white/5 ${item.iconBorder}`}>
                        <span className='material-symbols-outlined'>{item.icon}</span>
                      </div>
                      <div>
                        <h4 className='font-bold text-on-surface'>{item.title}</h4>
                        <p className='text-sm text-on-surface-variant'>
                            {item.date} • {item.company}
                        </p>
                      </div>
                   </div>

                   {/*//* Right — score + chevron */}
                   <div className='flex items-center justify-between sm:justify-end gap-8'>
                      <div className='text-right'>
                         <p className='text-xs text-on-surface-variant uppercase tracking-widest font-bold'>AI Score</p>
                         <p className={`text-lg font-bold ${item.scoreColor}`}>{item.score}</p>
                      </div>
                      <button>
                         <span className='material-symbols-outlined'>chevron_right</span>
                      </button>
                   </div>
                </div>
            ))}
         </div>
    </section>
  )
}

export default InterviewList
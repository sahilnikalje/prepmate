import React from 'react'
import DashboardLayout from '../../dashboard/layout/DashboardLayout'
import StrengthCard from '../components/StrengthCard'
import { strengths, aiInsight, growthAreas, miniMetrics } from './../data/analyticsDummyData';
import WeaknessCard from '../components/WeaknessCard';
import InsightPanel from '../components/InsightPanel';
import PerformanceChart from '../components/PerformanceChart';

function AnalyticsPage() {
  return (
     <DashboardLayout>
         
      {/*//* Atmospheric glows */}
        <div className='fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none z-0'/>
        <div className='fixed bottom-0 left-64 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none z-0'/>

        <div className='relative z-10 space-y-10'>
           
       {/*//* STEP-3: Hero Header */}
         <header className='flex items-start justify-between'>
            <div>
               <p className='text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2'>
                 Personal AI coach
               </p>
               <h1 className='font-headline text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight'>
                 Cognitive Analytics
               </h1>
               <p className='text-on-surface-variant mt-2'>
                 Your AI coach has been analyzing your interview patterns
               </p>
            </div>
            <div className='flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-surface-container-highest rounded-full text-sm text-on-surface-variant font-semibold'>
              <span className='material-symbols-outlined text-sm'>
                calendar_today
              </span>
              Last 30 Days
            </div>
         </header>

         {/*//* STEP-4: Strengths + Growth Areas — asymmetric grid */}
           <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
              
           {/*//* LEFT — Dominant Strengths ~65% */}
             <section className='lg:col-span-8 space-y-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='material-symbols-outlined text-primary text-sm'
                    style={{fontVariationSettings:"'FILL'1"}}
                  >
                    military_tech
                  </span>
                  <p className='text-xs font-bold text-on-surface-variant uppercase tracking-widest'>
                    Dominant Strengths
                  </p>
                </div>
               {/*//* Large dominant card */}
                <StrengthCard strength={strengths[0]}/>

               {/*//* Two smaller cards — not equal height intentionally */}
                 <div className='grid grid-cols-2 gap-4'>
                   <StrengthCard strength={strengths[1]}/>
                   <StrengthCard strength={strengths[2]}/>
                 </div>
             </section>
            
            {/*//* RIGHT — Growth Areas ~35% */}
              <aside className='lg:col-span-4 space-y-3'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='material-symbols-outlined text-secondary text-sm'
                    style={{fontVariationSettings: "'FILL' 1"}}>
                      trending_up
                  </span>
                  <p className='text-xs font-bold text-on-surface-variant uppercase tracking-widest'>
                    Growth Areas
                  </p>
                </div>

                {growthAreas.map((area)=>(
                  <WeaknessCard key={area.id} area={area}/>
                ))}

               {/*//* AI Insight Panel — inside right column, overlapping visually */}
                <div className='mt-2'>
                  <InsightPanel insight={aiInsight}/>
                </div>
              </aside>
           </div>

         {/*//* STEP-5: Performance Chart — full width */}
           <PerformanceChart/>

         {/*//* STEP-6: Mini Metrics — 3 cards at bottom */}
           <div className='grid grid-cols-3 gap-4 pb-4'>
             {miniMetrics.map((metric, i)=>(
               <div
                 key={i}
                 className='glass-panel rounded-2xl p-6 flex items-center gap-4'
               >
                <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0'>
                  <span className='material-symbols-outlined text-primary'
                    style={{fontVariationSettings: "'FILL' 1"}}>
                      {metric.icon}
                  </span>
                </div>
                <div>
                  <p className='font-headline font-extrabold text-2xl text-on-surface'>
                    {metric.value}
                  </p>
                  <p className='text-xs text-on-surface-variant uppercase tracking-widest font-semibold mt-0.5'>
                    {metric.label}
                  </p>
                </div>
               </div>
             ))}
           </div>
        </div>
     </DashboardLayout>
  )
}

export default AnalyticsPage
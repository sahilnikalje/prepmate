import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../dashboard/layout/DashboardLayout'
import StrengthCard from '../components/StrengthCard'
import WeaknessCard from '../components/WeaknessCard';
import InsightPanel from '../components/InsightPanel';
import PerformanceChart from '../components/PerformanceChart';
import analyticsService from '../services/analyticsService';

//todo STEP-1: Static icon/color config for strengths
//* We keep visual config on frontend, merge with real scores from backend
  const strengthConfig = [
  { icon: "architecture", barColor: "from-primary to-secondary",    tagColor: "text-[#48e5d0]" },
  { icon: "code",         barColor: "from-secondary to-primary",    tagColor: "text-secondary"  },
  { icon: "description",  barColor: "from-[#48e5d0] to-primary",   tagColor: "text-[#48e5d0]"  },
 ] 

//todo STEP-2: Static icon/color config for growth areas
 const growthConfig = [
   { icon: "forum",      color: "text-error",     barColor: "from-error to-error/50"         },
   { icon: "handshake",  color: "text-secondary", barColor: "from-secondary to-secondary/50" },
   { icon: "timer",      color: "text-primary",   barColor: "from-primary to-primary/50"     },
 ] 


function AnalyticsPage() {
//todo STEP-3: State for real data, loading and error
  const[data, setData]=useState(null)
  const[loading, setLoading]=useState(true)
  const[error, setError]=useState('')

//todo STEP-4: Fetch real analytics data on mount
   useEffect(()=>{
     const fetchData=async()=>{
      try{
        const result=await analyticsService.getAnalyticsData()
        setData(result)
      }
      catch(err){
        setError('Failed to load analytics data')
      }
      finally{
        setLoading(false)
      }
     }
     fetchData()
   },[])

//todo STEP-5: Merge backend strengths with frontend visual config
     const mergedStrengths=(data?.strengths || []).map((s, i)=>({
       ...s,
       id:i+1,
       size:i===0 ? 'large' : 'small',
       tag:s.tag,
       ...(strengthConfig[i] || strengthConfig[0])
     }))

//todo STEP-6: Merge backend growth areas with frontend visual config
     const mergedGrowthAreas=(data?.growthAreas || []).map((g, i)=>({
       ...g,
       id:i+1,
       ...(growthConfig[i] || growthConfig[0])
     }))
    
//todo STEP-7: Mini metrics from real data
  const miniMetrics = data ? [
    { label: "Total Sessions",     value: String(data.miniMetrics.totalSessions),    icon: "schedule"    },
    { label: "Questions Answered", value: String(data.miniMetrics.questionsAnswered), icon: "quiz"        },
    { label: "Improvement",        value: data.miniMetrics.improvement,               icon: "trending_up" },
  ] : []

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
                 Personal AI Coach
               </p>
               <h1 className='font-headline text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight'>
                 Cognitive Analytics
               </h1>
               <p className='text-on-surface-variant mt-2'>
                 Your AI coach has been analyzing your interview patterns.
               </p>
            </div>
            <div className='flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-surface-container-highest rounded-full text-sm text-on-surface-variant font-semibold'>
              <span className='material-symbols-outlined text-sm'>
                calendar_today
              </span>
              Last 30 Days
            </div>
         </header>

        {loading && (
          <div className="flex items-center justify-center py-32">
            <svg className="w-10 h-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}

        {error && (
           <div className='text-center text-error py-20'>{error}</div>
        )}

        {!loading && !error && data?.totalInterviews === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant">insights</span>
            <h2 className="font-headline text-2xl font-bold text-on-surface">No Data Yet</h2>
            <p className="text-on-surface-variant max-w-sm">
              Complete at least one interview to see your analytics. Your AI coach will analyze your performance patterns.
            </p>
          </div>
        )}

        {!loading && !error && data?.totalInterviews> 0 && (
          <>
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

                {mergedStrengths.length > 0 ? (
                 <>
               {/*//* Large dominant card */}
                <StrengthCard strength={mergedStrengths[0]}/>
                  {mergedStrengths.length>1 && (
                 <div className='grid grid-cols-2 gap-4'>
                   {mergedStrengths.slice(1).map((s)=>(
                     <StrengthCard key={s.id} strength={s}/>
                   ))}
                 </div>
                )}
              </>
            ):(
              <div className='glass-panel rounded-3xl p-8 text-center text-on-surface-variant'>
                Complete more interviews to identify your strengths.
              </div>
            )}
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

                {mergedGrowthAreas.length>0 ? (
                  mergedGrowthAreas.map((area)=>(
                    <WeaknessCard key={area.id} area={area}/>
                  ))
                ):(
                  <div className='glass-panel rounded-2xl p-5 text-center text-on-surface-variant text-sm'>
                    No weak areas found yet. Keep practicing!
                  </div>
                )}

              {/*//* AI Insight Panel */}
                {data.aiInsight && (
                  <div className='mt-2'>
                     <InsightPanel insight={data.aiInsight}/>
                  </div>
                )}
              </aside>
           </div>

         {/*//* STEP-5: Performance Chart — full width */}
           <PerformanceChart data={data.performanceData}/>

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
        </>
      )}
    </div>
     </DashboardLayout>
  )
}

export default AnalyticsPage
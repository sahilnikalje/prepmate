import React, { useEffect, useState } from 'react'
import { dummyInterviews, dummyStats, dummyUser } from '../data/dummyData';
import StatsCard from '../components/StatsCard';
import InterviewList from '../components/InterviewList';
import DashboardLayout from '../components/DashboardLayout';
import dashboardService from '../services/dashboardService';

//todo STEP-1: Define the stats card config
//todo We merge this with real API data to keep icons/colors intact

const statsConfig = [
  {
    key:        "totalInterviews",
    icon:       "record_voice_over",
    iconColor:  "text-primary",
    iconBg:     "bg-primary/10",
    badgeColor: "text-tertiary-dim",
    badge:      "+12% this week",
    label:      "Total Interviews",
    suffix:     "",
    highlight:  false,
  },
  {
    key:        "averageScore",
    icon:       "star",
    iconColor:  "text-secondary",
    iconBg:     "bg-secondary/10",
    badgeColor: "text-secondary",
    badge:      "Top 5% Users",
    label:      "Average Score",
    suffix:     "/100",
    highlight:  false,
  },
  {
    key:        "bestScore",
    icon:       "military_tech",
    iconColor:  "text-[#48e5d0]",
    iconBg:     "bg-[#48e5d0]/10",
    badgeColor: "text-on-surface-variant",
    badge:      "Best in Product Management",
    label:      "Best Score",
    suffix:     "/100",
    highlight:  true,
  },
]


function DashboardPage() {
 //todo STEP-2: State for real data, loading, and error
    const[stats, setStats]=useState(null)
    const[recentInterviews, setRecentInterviews]=useState([])
    const[loading, setLoading]=useState(true)
    const[error, setError]=useState('')

 //todo STEP-3: Fetch dashboard data when page loads
    useEffect(()=>{
        const fetchData=async()=>{
            try{
                const data=await dashboardService.getDashboardData()
                setStats(data.stats)
                setRecentInterviews(data.recentInterviews)
            }
            catch(err){
                setError("Failed to load dashboard data")
            }
            finally{
                setLoading(false)
            }
        }
      fetchData()
    },[])
 //todo STEP-4: Merge statsConfig with real values from API
    const mergedStats=statsConfig.map((config)=>({
        ...config,
        value:stats?String(stats[config.key]) : '-'
    }))
 //todo STEP-5: Map real interview data to the shape InterviewList expects
   const iconMap = [
      { icon: "work",       iconColor: "text-primary",     scoreColor: "text-primary",     hoverBg: "hover:bg-primary/20",     hoverText: "hover:text-primary"     },
      { icon: "terminal",   iconColor: "text-secondary",   scoreColor: "text-secondary",   hoverBg: "hover:bg-secondary/20",   hoverText: "hover:text-secondary"   },
      { icon: "leaderboard",iconColor: "text-[#48e5d0]",   scoreColor: "text-[#48e5d0]",   hoverBg: "hover:bg-[#48e5d0]/20",  hoverText: "hover:text-[#48e5d0]"   },
    ]

    const mappedInterviews=recentInterviews.map((iv, i)=>({
        id:iv.id,
        title:iv.title,
        company:iv.company,
        score:`${iv.score}%`,
        date: new Date(iv.date).toLocaleDateString("en-IN", {day:'numeric', month:'short', year:'numeric'}),
        ...iconMap[i % iconMap.length],
    }))
  return (
    <DashboardLayout>
    {/*//* Welcome section */}
    <section className='mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8'>
        <div className='space-y-2'>
            <h2 className='text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface'>
                Welcome back, {dummyUser.name}
            </h2>
            <p className='text-on-surface-variant text-lg'>
                Ready to elevate your interview performance today?
            </p>
        </div>

        {/*//* Start Interview button */}
        <button
          className='px-8 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-xl shadow-[0_0_20px_rgba(163,166,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 self-start md:self-auto'
        >
            <span className='material-symbols-outlined'
                  style={{fontVariationSettings:"'FILL' 1"}}
            >
                bolt
            </span>
            Start Interview
        </button>
    </section>
 {/*//todo STEP-6: Show loading state */}
     {loading && (
        <div className='text-center text-on-surface-variant py-20'>
            Loading dashboard...
        </div>
     )}

 {/*//todo STEP-7: Show error state */}
    {error && (
        <div className='text-center text-error py-20'>{error}</div>
    )}

 {/*//todo STEP-8: Show real data once loaded */}
     {!loading && !error && (
        <>
          <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
             {mergedStats.map((stat, i)=>(
                <StatsCard key={i} stat={stat}/>
             ))}
          </section>
         
         <InterviewList interviews={mappedInterviews}/>
        </>
     )}
    {/* //Stats grid — loop over dummyStats and render a StatsCard for each */}
    {/* <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        {dummyStats.map((stat)=>(
            <StatsCard key={stat.id} stat={stat}/>
        ))}
    </section> */}

    {/* Recent interviews list */}
    {/* <InterviewList interviews={dummyInterviews}/> */}

    </DashboardLayout>
  )
}

export default DashboardPage
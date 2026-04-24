import React from 'react'
import { dummyInterviews, dummyStats, dummyUser } from '../data/dummyData';
import StatsCard from '../components/StatsCard';
import InterviewList from '../components/InterviewList';
import DashboardLayout from '../components/DashboardLayout';

function DashboardPage() {
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

    {/*//* Stats grid — loop over dummyStats and render a StatsCard for each */}
    <section className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        {dummyStats.map((stat)=>(
            <StatsCard key={stat.id} stat={stat}/>
        ))}
    </section>

    {/*//* Recent interviews list */}
    <InterviewList interviews={dummyInterviews}/>

    </DashboardLayout>
  )
}

export default DashboardPage
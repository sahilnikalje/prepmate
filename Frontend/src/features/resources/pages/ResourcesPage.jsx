import React, { useState } from 'react'
import DashboardLayout from '../../dashboard/layout/DashboardLayout'
import { aiMentorInsight, categories, practiceSets, recommendedResources, continueLearning } from '../data/resourcesDummyData'
import RecommendedCard from './../components/RecommendedCard';
import CategoryCard from './../components/CategoryCard';
import PracticeSetCard from './../components/PracticeSetCard';
import AIMentorPanel from './../components/AIMentorPanel';

function ResourcesPage() {
   const[search, setSearch]=useState('')
   const[roleFilter, setRoleFilter]=useState('')
   const[diffFilter, setDiffFilter]=useState('')

   const selectClass='bg-surface-container-highest text-on-surface text-sm px-4 py-2.5 rounded-full appearance-none outline-none cursor-pointer pr-8'
  return (
    <DashboardLayout>
     {/*//* Atmospheric glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-[#48e5d0]/5 blur-[120px] rounded-full pointer-events-none z-0" />
       
      <div className='relative z-10 space-y-12 pb-24'>

     {/*//* STEP-3: Hero Header */}
       <header className='flex items-start justify-between gap-6'>
         <div>
            <p className='text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2'>
                AI Learning Hub
            </p>
            <h1 className='font-headline text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight'>
                Interview Resources
            </h1>
            <p className='text-on-surface-variant mt-2 max-w-lg'>
                Curated interview preparation resources personalized for your grpwth.
            </p>
         </div>

     {/*//* AI Active badge */}
          <div className='flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#48e5d0]/10 rounded-full border border-[#48e5d0]/20'>
            <div className='w-2 h-2 rounded-full bg-[#48e5d0] animate-pulse'/>
            <span className='text-xs font-bold text-[#48e5d0] uppercase tracking-widest'>
                AI Recommendations Active
            </span>
          </div>
       </header>
    
     {/*//* STEP-4: Smart Search + Filters */}
        <div className='flex flex-col sm:flex-row gap-3'>

     {/*//* Search */}
         <div className='relative flex-1'>
            <span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm'>
                search
            </span>
            <input
               type='text'
               value={search}
               onChange={(e)=>setSearch(e.target.value)}
               placeholder='Search what do you want to learn about...'
               className='w-full bg-surface-container-highest text-on-surface text-sm pl-11 pr-5 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/60'
            />
         </div>
       
     {/*//* Role dropdown */}
          <div className='relative'>
             <select
               value={roleFilter}
               onChange={(e)=>setRoleFilter(e.target.value)}
               className={selectClass}
             >
               <option value="">All Roles</option>
               <option value="frontend">Frontend</option>
               <option value="backend">Backend</option>
               <option value="fullstack">Full Stack</option>
               <option value="hr">HR</option>
             </select>
             <span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none'>
              expand_more
             </span>
          </div>
     
     {/*//* Difficulty dropdown */}
         <div className='relative'>
           <select
              value={diffFilter}
              onChange={(e)=>setDiffFilter(e.target.value)}
              className={selectClass}
           >
             <option value="">Difficulty</option>
             <option value="beginner">Beginner</option>
             <option value="intermediate">intermediate</option>
             <option value="advanced">Advanced</option>              
           </select>
           <span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none'>
             expand_more
           </span>
         </div>
        </div>
     
    {/*//* STEP-5: AI Recommended Section */}
       <section className='space-y-5'>
          <div className='flex items-center gap-2'>
             <span className='material-symbols-outlined text-primary text-sm'
             style={{fontVariationSettings:"'FILL'1"}}>
              auto_awesome
             </span>
             <h2 className='font-headline font-bold text-2xl text-on-surface'>Recommended for You</h2>
          </div>

          <div>
            {recommendedResources.map((resource)=>(
              <RecommendedCard key={resource.id} resource={resource}/>
            ))}
          </div>
       </section>

   {/*//* STEP-6: Explore Categories */}
      <section className='space-y-5'>
         <h2 className='font-headline font-bold text-2xl text-on-surface'>Explore Categories</h2>
         <div className='grid grid-cols-3 sm:grid-cols-6 gap-4'>
           {categories.map((cat)=>(
             <CategoryCard key={cat.id} category={cat}/>
           ))}
         </div>
      </section>
  
   {/*//* STEP-7: Practice Sets + Continue Learning — asymmetric grid */}
       <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          
          {/* Featured Practice Sets — left 8 cols */}
            <section className='lg:col-span-8 space-y-5'>
               <h2 className='font-headline font-bold text-2xl text-on-surface'>Featured Practice Sets</h2>
               <div className='space-y-3'>
                 {practiceSets.map((set)=>(
                   <PracticeSetCard key={set.id} set={set}/>
                 ))}
               </div>
            </section>

       {/*//* Continue Learning — right 4 cols */}
          <aside className='lg:col-span-4 space-y-5'>
             <h2 className='font-headline font-bold text-2xl text-on-surface'>Continue Learning</h2>
             <div className='space-y-4'>
                {continueLearning.map((item)=>(
                   <continueLearning key={item.id} item={item}/>
                ))}
             </div>
          </aside>
       </div>
      </div>
  
  {/*//* STEP-8: Floating AI Mentor Panel */}
     <AIMentorPanel insight={aiMentorInsight}/>
    </DashboardLayout>
  )
}

export default ResourcesPage
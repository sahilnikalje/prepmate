import React from 'react'
import { categories, industries, roles } from '../data/practiceOptions'

const selectClass = "w-full bg-surface-container-highest text-on-surface px-5 py-4 rounded-xl appearance-none focus:ring-2 focus:ring-primary transition-all outline-none cursor-pointer"

function RoleFilters({role, category, industry, onChange}) {
  return (
    <div className='space-y-6'>

     {/*//* Three dropdowns in a grid */}
       <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
         {/*//* Role */}
          <div className='space-y-2'>
             <label className='text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1'>
             Select Role
           </label>
           <div className='relative'>
             <select
              value={role}
              onChange={(e)=>onChange('role', e.target.value)}
              className={selectClass}
             >
                <option value=''>-- Select --</option>
                {roles.map((r)=>(
                    <option key={r} value={r}>{r}</option>
                ))}
             </select>
             <span className='material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline'>
                expand_more
             </span>
           </div>
          </div>
       

     {/*//* Category — options depend on selected role */}
       <div className='space-y-2'>
          <label className='text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1'>
            Category
          </label>
          <div className='relative'>
             <select
              value={category}
              onChange={(e)=>onChange('category', e.target.value)}
              disabled={!role}
              className={`${selectClass} disabled:opacity-40 disabled:cursor-not-allowed`}
             >
                <option value=''>-- Select --</option>
                {(categories[role] || []).map((c)=>(
                    <option key={c} value={c}>{c}</option>
                ))}
             </select>
             <span className='material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline'>
               expand_more
             </span>
          </div>
       </div>

     {/*//* Industry */}
       <div className='space-y-2'>
         <label className='text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1'>
            Industry
         </label>
         <div className='relative'>
            <select
              value={industry}
              onChange={(e)=>onChange('industry', e.target.value)}
              className={selectClass}
            >
                <option value=''>-- Select --</option>
                  {industries.map((ind)=>(
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
            </select>
            <span className='material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline"'>
                expand_more
            </span>
         </div>
       </div> 
     </div>
   {/*//* Selection chips — only show when at least role is selected */}
    {role && (
       <div className='flex flex-wrap gap-2'>
         {[role, category, industry].filter(Boolean).map((val)=>(
           <span
            key={val}
            className='px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20'
           >
             {val}
           </span>
         ))}
       </div>
    )}
 </div>
  )
}

export default RoleFilters
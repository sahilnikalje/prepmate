import React from 'react'

function JobDescriptionBox({jobDescription, isGenerating, onGenerate, onChange}) {
  return (
    <div className='space-y-3'>

     {/*//* Header row */}
        <div className='flex items-center justify-between'>
           <label className='text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1'>
              Job Description
           </label>

     {/*//* Generate button */}
       <button
         type='button'
         onClick={onGenerate}
         disabled={isGenerating}
         className='flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors px-4 py-2 rounded-full glass-panel disabled:opacity-50 disabled:cursor-not-allowed'
       >
        {isGenerating ? (
          <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            Generating
          </>
        ):(
          <>
            <span className='material-symbols-outlined text-sm'>auto_awesome</span>
            Generate Job Description
          </>
        )}
       </button>
      </div>
 {/*//* Textarea — shimmer overlay while generating */}
      <div className='relative'>
         <textarea
           value={jobDescription}
           onChange={(e)=>onChange(e.target.value)}
           placeholder="Generated or pasted job description will appear here..."
           className='w-full h-72 bg-surface-container-highest text-on-surface px-6 py-5 rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none placeholder:text-outline/50 resize-none'
         />
  {/*//* Shimmer overlay while generating */}
       {isGenerating && (
         <div className='absolute inset-0 rounded-2xl overflow-hidden'>
           <div className='h-full w-full bg-surface-container-highest animate-pulse opacity-80'/>
         </div>
       )}
      </div>
     <p className='text-xs text-on-surface-variant ml-1'>
       You can edit the generated description if needed.
     </p>
    </div>
  )
}

export default JobDescriptionBox
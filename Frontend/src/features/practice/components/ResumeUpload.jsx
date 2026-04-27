import React, { useRef } from 'react'

function ResumeUpload({resumeFile, onUpload, onRemove}) {
   const inputRef=useRef(null)

 //* Handle drag and drop
   const handleDrop=(e)=>{
     e.preventDefault()
     const file=e.dataTransfer.files[0]
     if(file && file.type==='aplication/pdf') onUpload(file)
   }
  const handleDragOver=(e)=>e.preventDefault()

   const handleFileChange=(e)=>{
     const file=e.target.files[0]
     if(file) onUpload(file)
   }

  return (
    <div className='space-y-4'>
       <div>
         <h3 className="text-lg font-bold font-headline text-on-surface">Experience Insights</h3>
         <p className="text-sm text-on-surface-variant mt-1">
           Our AI analyzes your resume to create deep-dive behavioral questions tailored to your history.
         </p>
       </div>
    {/*//* Upload zone or uploaded state */}
       {!resumeFile ? (
         <div
           onClick={()=>inputRef.current.click()}
           onDrop={handleDrop}
           onDragOver={handleDragOver}
           className='group relative flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/50 hover:border-primary/60 transition-all cursor-pointer rounded-3xl py-12 px-6 text-center bg-surface/30 hover:bg-primary/5'
         >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
          </div>
          <p className='text-on-surface font-bold mb-1'>Upload your resume (PDF)</p>
          <p className='text-on-surface-variant text-sm'>Drag & drop or click to upload</p>
          <input
            ref={inputRef}
            type='file'
            accept='.pdf'
            className='hidden'
            onChange={handleFileChange}
          />
         </div>
       ):(
        //* File uploaded state — show name + actions
        <div className='rounded-3xl bg-surface-container-high border border-primary/20 p-6 space-y-4'>
           <div className='flex items-center gap-4'>
             <div className='w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0'>
               <span className='material-symbols-outlined text-primary'>description</span>
             </div>
             <div className='flex-1 min-w-0'>
               <p className='font-bold text-on-surface truncate'>{resumeFile.name}</p>
               <p className='text-xs text-on-surface-variant mt-0.5'>{(resumeFile.size / 1024).toFixed(1)} KB • PDF</p>
             </div>
        {/*//* Remove button */}
          <button
            onClick={onRemove}
            className='p-2 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-all'
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

     {/*//* Replace file */}
        <button
          onClick={()=>inputRef.current.click()}
          className='w-full py-2.5 rounded-xl border border-outline-variant/30 text-sm font-semibold text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all'
        >
           Replace File
        </button>
          <input
            ref={inputRef}
            type='file'
            accept='.pdf'
            className='hidden'
            onChange={handleFileChange}
          />
      </div>
       )}

  {/*//* AI Matching accent card  */}
    <div className='relative overflow-hidden rounded-2xl h-24 flex items-center px-5 bg-surface-container-high'>
       <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-full'/>
        <div className='flex gap-4 items-center ml-2'>
           <div className='w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0'>
             <span
               className='material-symbols-outlined text-secondary'
               style={{fontVariationSettings:"'FILL' 1"}}
             >
              analytics
             </span>
           </div>
           <div>
              <p className='text-sm font-bols text-on-surface'>AI Matching</p>
              <p className='text-xs text-on-surface-variant'>Sync your skills with the role requirements</p>
           </div>
        </div>
        <div className='absolute -right-6 -bottom-6 w-20 h-20 bg-primary/10 blur-[30px] rounded-full'/>
    </div>
    </div>
  )
}

export default ResumeUpload
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import RoleFilters from '../components/RoleFilters';
import JobDescriptionBox from '../components/JobDescriptionBox';
import ResumeUpload from '../components/ResumeUpload';
import PracticeTips from '../components/PracticeTips';
import practiceService from '../services/practiceService';
import DashboardLayout from '../../dashboard/layout/DashboardLayout';
function PracticePage() {
    const navigate=useNavigate()

    const[role, setRole]=useState('')
    const[category, setCategory]=useState('')
    const[industry, setIndustry]=useState('')
    const[jobDescription, setJobDescription]=useState('')
    const[resumeFile, setResumeFile]=useState(null)

    const[isGenerating, setIsGenerating]=useState(false)
    const[isStarting, setIsStarting]=useState(false)
    const[errors, setErrors]=useState({})

//todo  Handle dropdown changes
     const handleFilterChange=(field, value)=>{
        if(field==='role'){
            setRole(value)
            setCategory('') //todo reset category when role changes
        }
        else if(field==='category'){
            setCategory(value)
        }
        else{
            setIndustry(value)
        }
        setErrors((prev)=>({...prev, [field]:''}))
     }

//todo Generate JD
     const handleGenerateJD=async()=>{
        if(!role){
            setErrors((prev)=>({...prev, role:'Please select a role first'}))
            return
        }
        setIsGenerating(true)
        try{
            const data=await practiceService.generateJobDescription({role,category, industry})
            setJobDescription(data.jobDescription)
        }
        catch(err){
            console.log('JD generation failed: ', err)
        }
        finally{
            setIsGenerating(false)
        }
     }

 //todo  Resume handlers  
      const handleResumeUpload=(file)=>{
        setResumeFile(file)
        setErrors((prev)=>({...prev, resume:''}))
      }
      const handleResumeRemove=()=>setResumeFile(null)

 //todo  Validate before starting
      const validate=()=>{
         const newErrors={}
         if(!role) newErrors.role='Please select a role'
         if(!resumeFile) newErrors.resume='Please upload your resume'
         setErrors(newErrors)
         return Object.keys(newErrors).length===0
      }

 //todo Start interview
      const handleStartInterview=async()=>{
        if(!validate()) return
         setIsStarting(true)
         try{
            const data=await practiceService.startInterview({
                role, category, industry, jobDescription, resumeFile
            })
    //todo Navigate to interview room with the returned ID
            navigate(`/interview/${data.interviewId}`)
         }
         catch(err){
            console.log('Start interview failed: ', err)
         }
         finally{
            setIsStarting(false)
         }
      }

//todo  Disable Start button until role + resume are ready
     const isStartDisabled=!role || !resumeFile || isStarting
     
  return (
     <DashboardLayout>
      {/*//* Background decorative blobs */}
        <div className='fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0'/>
            <div className='fixed bottom-[-20%] left-[-5%] w-[700px] h-[700px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none z-0'/>
               <div className='relative z-10'>
                 {/*//* Page header */}
                  <header className='mb-10'>
                     <h1 className='text-4xl lg:text-5xl font-extrabold font-headline text-on-surface tracking-tight mb-2'>
                        Start Your Mock Interview
                     </h1>
                     <p>
                        Customize your interview by selecting role, filters, and job description
                     </p>
                  </header>
                  
                  {/*//* Two column grid */}
                   <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
                      {/*//* LEFT COLUMN — all form inputs */}
                       <section className='lg:col-span-8 space-y-8'>
                         {/*//* Role filters */}
                          <RoleFilters
                            role={role}
                            category={category}
                            industry={industry}
                            onChange={handleFilterChange}
                          />

                          {/*//* Role error */}
                           {errors.role && (
                             <p className='text-sm text-error -mt-4 ml-1'>{errors.role}</p>
                           )}

                           {/*//* Job description */}
                            <JobDescriptionBox
                              jobDescription={jobDescription}
                              isGenerating={isGenerating}
                              onGenerate={handleGenerateJD}
                              onChange={setJobDescription}
                            />

                            {/* Start Interview CTA */}
                             <div className='pt-2'>
                                <button
                                  onClick={handleStartInterview}
                                  disabled={isStartDisabled}
                                  className='px-12 py-5 bg-gradient-to-r from-primary to-secondary
                                            text-on-primary-fixed font-bold text-lg rounded-full
                                             shadow-[0_0_40px_rgba(163,166,255,0.25)] hover:scale-[1.02] active:scale-95 transition-all
                                              duration-300 flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100'
                                >
                                    {isStarting ? (
                                        <>
                                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                          </svg>    
                                        </>
                                    ):(
                                        <>
                                         Start Interview
                                         <span className='material-symbols-outlined'>arrow_forward</span>
                                        </>
                                    )}
                                </button>

                                {/*//* Resume error shown near button */}
                                  {errors.resume && (
                                    <p className='text-sm text-error mt-3 ml-1'>{errors.resume}</p>
                                  )}
                             </div>
                       </section>

                       {/*//* RIGHT COLUMN — sticky resume upload */}
                         <aside className='lg:col-span-4 lg:sticky lg:top-6'>
                            <div className='glass-panel p-7 rounded-3xl space-y-6'>
                                <ResumeUpload
                                  resumeFile={resumeFile}
                                  onUpload={handleResumeUpload}
                                  onRemove={handleResumeRemove}
                                />
                            </div>
                            <PracticeTips/>
                         </aside>
                   </div>
               </div>
     </DashboardLayout>
  )
}

export default PracticePage
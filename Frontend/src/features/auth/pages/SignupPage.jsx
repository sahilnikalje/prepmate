import React from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../layout/AuthLayout'
import SignupForm from '../components/SignupForm'

function SignupPage() {
  const navigate=useNavigate()

  return (
    <main className="flex flex-col md:flex-row min-h-screen w-full bg-background">
      {/*//* left panel */}
      <AuthLayout/>

      {/*//* right panel */}
      <section className='flex flex-col w-full md:w-1/2 p-6 md:p-10 items-center justify-center bg-surface overflow-y-auto'>
       
        {/*//* Mobile logo — hidden on md and above */}
        <div className='md:hidden flex items-center gap-2 mb-12 self-start'>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span
             className='material-symbols-outlined text-white text-base'
             style={{fontVariationSettings: "'FILL 1'"}}
            >
              psychology
            </span>
          </div>
          <span className="text-xl font-bold font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
             PrepMate AI
          </span>
        </div>

        <div className='w-full max-w-md'>
           <header className='mb-6'>
             <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-2">
               Create your account
             </h2>
             <p className='text-on-surface-variant'>
               Join thousands of candidates winning at interviews
             </p>
           </header>

           <SignupForm/>

           <footer className='mt-6 text-center'>
             <p className='text-on-surface-variant'>
               Already have an account?{' '}
               <button
                onClick={()=>navigate('/login')}
                className='text-primary font-bold hover:underline ml-1'
               >
                 Login
               </button>
             </p>
           </footer>
        </div>
      </section>
    </main>
  )
}

export default SignupPage
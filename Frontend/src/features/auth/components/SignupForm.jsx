import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function SignupForm() {
  const navigate=useNavigate()

  const[name, setName]=useState('')
  const[email, setEmail]=useState('')
  const[password, setPassword]=useState('')
  const[confirmPassword, setConfirmPassword]=useState('')
  const[showPassword, setShowPassword]=useState(false)
  const[showConfirmPassword, setShowConfirmPassword]=useState(false)
  const[loading, setLoading]=useState(false)
  const[error, setError]=useState('')


  const handleSubmit=async(e)=>{
    e.preventDefault()
    setError('')

    if(password!==confirmPassword){
      alert('Password do not match')
      return
    }
    setLoading(true)

    try{
      await authService.register(name, email, password)
      navigate('/login')
    }
    catch(err){
      setError(err.response?.data?.message || 'Something went wrong')
    }
    finally{
      setLoading(false)
    }
     //! Dummy — will be replaced with real API call in Integration step
    // console.log('SIGNUP DUMMY', {name, email, password})
    // navigate('/login')
  }

  const inputClass='w-full h-14 pl-12 pr-4 bg-surface-container-highest border-none rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all duration-300 outline-none'
  return (
    <form onSubmit={handleSubmit} className='space-y-3'>
      {error && (
        <div className='w-full p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm text-center'>
          {error}
        </div>
      )}
      {/*//* full name */}
       <div className='space-y-2'>
           <label className='text-sm font-semibold text-on-surface-variant px-1'>
              Full Name
           </label>
           <div className='relative group'>
              <span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors'>
                 Person
              </span>
              <input
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className={inputClass}
                required
              />
           </div>
       </div>

       {/*//* email */}
       <div className='space-y-2'>
          <label className='text-sm font-semibold text-on-surface-variant px-1'>Email</label>
          <div className='relative group'>
             <span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors'>
               Email
             </span>
             <input
               type='email'
               placeholder='Enter email'
               value={email}
               onChange={(e)=>setEmail(e.target.value)}
               className={inputClass}
               required
             />
          </div>
       </div>

       {/*//* password */}
       <div className='space-y-2'>
          <label className="text-sm font-semibold text-on-surface-variant px-1">Password</label>
          <div className='relative group'>
             <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
               lock
             </span>
             <input
               type={showPassword?'text':'password'}
               placeholder='••••••••'
               value={password}
               onChange={(e)=>setPassword(e.target.value)}
               className={`${inputClass} pr-12`}
               required
             />
             <button
              type='button'
              onClick={()=>setShowPassword(!showPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors'
             >
              <span className='material-symbols-outlined'>
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
             </button>
          </div>
       </div>

       {/*//* confirm password */}
       <div className='space-y-2'>
        <label className="text-sm font-semibold text-on-surface-variant px-1">Confirm Password</label>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
            lock
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${inputClass} pr-12`}
            required
          />

          <button
           type='button'
           onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
           className='absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors'
          >
             <span className='material-symbols-outlined'>
               {showConfirmPassword ? 'visibility' : 'visibility_off'}
             </span>
          </button>
        </div>
       </div>

       {/*//* submit */}
       <button
        type='submit'
        disabled={loading}
        className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 mt-4"
       >
        {loading ? "Creating account..." : "Signup"}
       </button>

       {/*//* or divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/30" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-surface text-on-surface-variant font-medium">OR</span>
        </div>
      </div>

      {/*//! google- only for now */}
      <button
        type="button"
        className="w-full h-14 flex items-center justify-center gap-3 bg-surface-container-high hover:bg-surface-variant border border-outline-variant/20 rounded-xl text-on-surface font-semibold transition-all duration-300"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
        </svg>
        Continue with Google
      </button>
    </form>
  )
}

export default SignupForm
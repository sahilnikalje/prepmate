import React from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../layout/AuthLayout'
import LoginForm from './../components/LoginForm';

function LoginPage() {
  const navigate=useNavigate()

  return (
    <main className="flex min-h-screen overflow-hidden bg-background">

      {/*//* left panel */}
      <AuthLayout/>

      {/*//* right panel */}w-full md:w-1/2 bg
      <section className="w-full md:w-1/2 bg-surface-container-low flex items-center justify-center p-6 md:p-10 overflow-y-auto">
        <div className='w-full max-w-md'>
           {/*//* Mobile logo */}
          <div className="md:hidden mb-12 text-center">
            <span className="font-headline text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PrepMate AI
            </span>
          </div>

          <div className="mb-6">
            <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-2">
              Welcome Back
            </h2>
            <p className="text-on-surface-variant font-medium">
              Enter your details to access your dashboard.
            </p>
          </div>      

          <LoginForm/>

          <div className="mt-6 text-center">
            <p className="text-on-surface-variant font-medium">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-primary font-bold hover:underline underline-offset-4 ml-1"
              >
                Sign up
              </button>
            </p>
          </div>    
        </div>
      </section>
    </main>
  )
}

export default LoginPage
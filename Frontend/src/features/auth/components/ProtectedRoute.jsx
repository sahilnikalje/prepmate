import React, { useEffect, useState } from 'react'
import authService from '../services/authService'
import {Navigate} from 'react-router-dom'

function ProtectedRoute({children}) {
    const[isChecking, setisChecking]=useState(true)
    const[isAuth, setIsAuth]=useState(false)

    useEffect(()=>{
        const checkAuth=async()=>{
            try{
                await authService.getMe()
                setIsAuth(true)
            }
            catch(err){
                setIsAuth(false)
            }
            finally{
                setisChecking(false)
            }
        }
        checkAuth()
    },[])

    if(isChecking){
        return(
           <div className="bg-background min-h-screen flex items-center justify-center">
              <svg className="w-10 h-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
             </svg>
          </div>
        )
    }
  return isAuth ? children : <Navigate to='/login'/>
}

export default ProtectedRoute
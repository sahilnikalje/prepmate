import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';


const navItems = [
  { label: "Dashboard", icon: "dashboard",  path: "/dashboard",  filled: true },
  { label: "Practice",  icon: "psychology", path: "/practice",   filled: false },
  { label: "Analytics", icon: "insights",   path: "/analytics",  filled: false },
  { label: "Resources", icon: "menu_book",  path: "/resources",  filled: false },
]
function Sidebar() {
    const navigate=-useNavigate()

    const handleLogout=()=>{
        navigate('/login')
    }
  return (
    <aside className='hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-50 bg-surface-container-low border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.3)] py-8 px-4 font-headline tracking-tight'>

        {/*//* logo */}
        <div className='mb-12 px-4'>
            <h1 className='text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                PrepMate AI
            </h1>
            <p className='text-[10px] uppercase tracking-widest text-on-surface-variant mt-1'>
                AI Interview Prep
            </p>
        </div>

        {/*//* NavLink gives us isActive so we can style the active item  */}
        <nav className='flex-1 space-y-2'>
            {navItems.map((item)=>(
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({isActive})=>`flex items-center gap-3 px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                    isActive
                    ? "text-primary bg-white/5"
                    :"ext-on-surface-variant hover:text-white hover:bg-white/10"
                  }`
                 }
                >
                    {({isActive})=>(
                        <>
                        <span className='material-symbols-outlined'
                              style={{fontVariationSettings: isActive && item.filled ? "'FILL' 1" : "'FILL' 0"}}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>

        {/*//* Logout button at the bottom */}
         <div className='mt-auto pt-8 border-t border-white/5'>
           <button
             onClick={handleLogout}
             className='w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full'
           >
            <span className='material-symbols-outlined'>logout</span>
            <span>Logout</span>
           </button>
         </div>
    </aside>
  )
}

export default Sidebar
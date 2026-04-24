import React, { Children } from 'react'
import {useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function DashboardLayout({children}) {
    const navigate=useNavigate
  return (
    <div className='bg-background text-on-surface min-h-screen flex overflow-hidden'>
        {/* Sidebar — fixed on left */}
        <Sidebar/>

        {/*//* Main area — offset by sidebar width on md+ */}
         <main className='flex-1 ml-0 md:ml-64 h-screen overflow-y-auto scroll-smooth'>
            {/*//* Sticky top navbar */}
            <Navbar/>

            {/*//* Sticky top navbar */}
            <div className='max-w-6xl mx-auto px-6 py-12 md:px-12'>
                {children}
            </div>

            {/*//* Mobile bottom padding so content isn't hidden behind mobile nav */}
            <footer/>
         </main>

         {/*//* Mobile bottom nav bar */}
         <nav className='md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#060e20]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-50'>
           {
            [
             { icon: "dashboard",  label: "Dashboard", path: "/dashboard"  },
             { icon: "psychology", label: "Practice",  path: "/practice"   },
             { icon: "insights",   label: "Analytics", path: "/analytics"  },
             { icon: "menu_book",  label: "Resources", path: "/resources"  },
           ].map((item)=>(
             <button
              key={item.label}
              onClick={()=>navigate(item.path)}
              className='flex flex-col items-center gap-1 text-on-surface-variant'
             >
                <span className='material-symbols-outlined text-2xl'>{item.icon}</span>
                <span className='text-[10px] font-medium'>{item.label}</span>
             </button>
           ))
          }
         </nav>
    </div>
  )
}

export default DashboardLayout
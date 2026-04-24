import React from 'react'

function Navbar() {
  return (
    <header className='w-full h-16 sticky top-0 z-40 bg-[#060e20]/80 backdrop-blur-xl flex justify-between items-center px-8 border-b border-white/5'>

        {/*//* search bar */}
          <div className='flex items-center flex-1 max-w-md'>
             <div className='relative w-full'>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                    search
                </span>
                <input
                  type='text'
                  placeholder='Search Resources...'
                  className="w-full bg-surface-container-highest border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none text-on-surface placeholder:text-outline"
                />
             </div>
          </div>

        {/*//* Right side icons */}
         <div className='flex items-center gap-4'>
            <button className='hover:bg-white/5 rounded-full p-2 transition-all'>
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
            <button className='hover:bg-white/5 rounded-full p-2 transition-all'>
               <span className='material-symbols-outlined text-on-surface-variant'>settings</span>
            </button>

            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border border-primary/20'>
              <span className='text-xs font-bold text-on-primary-fixed'>S</span>
            </div>
         </div>
    </header>
  )
}

export default Navbar
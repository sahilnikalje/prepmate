import React from 'react'

//todo STEP-1: Define feature cards as an array
//todo So we can loop instead of writing the same card 3 times

const features=[
     {
       icon:  "analytics",
       color: "text-primary",
       bg:    "bg-primary/10",
       title: "AI Feedback Loop",
       desc:  "Real-time tone & sentiment analysis",
     },
     {
      icon:  "video_chat",
      color: "text-secondary",
      bg:    "bg-secondary/10",
      title: "Interview Practice",
      desc:  "Unlimited mock sessions with AI",
     },
    {
      bg:    "bg-[#48e5d0]/10",
      icon:  "trending_up",
      color: "text-[#48e5d0]",
      title: "Growth Tracking",
      desc:  "Measure your progress over time",
   },
]

//todo STEP-2: Build the left branding panel
//todo This is shared between LoginPage and SignupPage
//todo STEP-3: Add decorative blobs and dotted grid as background layers
//todo STEP-4: Loop over features array to render cards

function AuthLayout() {
  return (
     <section className='relative hidden md:flex flex-col w-1/2 p-12 lg:p-16 overflow-hidden bg-surface-container-low-low'>
        {/*//! Background decorations */}
      <div className="absolute inset-0 dotted-grid opacity-20 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary/15 blur-[100px] rounded-full pointer-events-none" />

      <div className='relative z-10 flex flex-col h-full'>

        {/*//! logo */}
        <div className='flex items-center gap-2 mb-12'>
           <div className='w-10 h-10 bg-radient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20'>
             <span className='material-symbols-outlined text-white text-xl'
                   style={{fontVariationSettings:"'FILL'1"}}
             >
               Psychology
             </span>
           </div>
             <span className="text-2xl font-bold font-headline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PrepMate AI
             </span>
        </div>

        {/*//! Headline */}
        <div className='max-w-xl mb-12'>
          <h1 className="text-5xl lg:text-6xl font-extrabold font-headline tracking-tight mb-6 leading-[1.1] text-on-surface">
            Elevate your <span className="text-primary">interview</span> performance
          </h1>
          <p className="text-on-surface-variant text-lg font-medium">
            Start your AI-powered interview journey.
          </p>
        </div>

        {/*//! Feature Cards */}
        <div className="space-y-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 ${f.bg} rounded-xl ${f.color}`}>
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface font-headline">{f.title}</h3>
                  <p className="text-on-surface-variant text-sm">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
     </section>
  )
}

export default AuthLayout
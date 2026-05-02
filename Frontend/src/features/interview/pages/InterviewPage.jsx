import React, { useEffect, useState } from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import useSpeech from './../hooks/useSpeech';
import dummyQuestions from '../data/dummyQuestions';
import InterviewHeader from './../components/InterviewHeader';
import CameraView from './../components/CameraView';
import ControlBar from './../components/ControlBar';


function InterviewPage() {
  const{id}=useParams() //!interviewId from url
  const navigate=useNavigate()

  const[currentIndex, setCurrentIndex]=useState(0)
  const[isMuted, setIsMuted]=useState(false)
  const[answers, setAnswers]=useState([]) //! store all answers

 //todo get speech controls from hook
  const{
     transcript,
     isListening,
     isSpeaking,
     speak,
     startListening,
     stopListening,
     setTrenscript
  }=useSpeech() 

  const currentQuestion=dummyQuestions[currentIndex]
  const totalQuestions=dummyQuestions.length

 //todo When question changes → speak it → then auto-start listening
 useEffect(()=>{
   if(currentQuestion){
    speak(currentQuestion, ()=>{
      //todo Auto start listening after AI finishes speaking
      startListening()
    })
   }
 }, [currentIndex])

 //todo Toggle mic listen/stop
   const handleToggleListen=()=>{
    if(isListening){
      stopListening()
    }
    else{
      startListening()
    }
   }

   //todo Move to next question
  //todo Saves current transcript as the answer
  //todo Phase 2: send transcript to Groq for evaluation before moving on

  const handleNextQuestion=()=>{
    //todo save answer
    setAnswers((prev)=>[...prev, {question:currentQuestion, answer:transcript}])
    setTrenscript('')

    if(currentIndex<totalQuestions-1){
      setCurrentIndex((prev)=>prev+1)
    }
    else{
      //todo Interview done — navigate to results
      //todo Phase 3: save to backend before navigating
      navigate('/dashboard')
    }
  }

 //todo end interview early
   const handleEndInterview=()=>{
    window.speechSynthesis.cancel()
    navigate('/dashboard')
   }

//todo Mute toggles audio output, not recognition
  const handleToggleMute=()=>{
    setIsMuted((prev)=>!prev)
      window.speechSynthesis.volume=isMuted?1:0
  }

  return (
 //todo Full screen layout — no scroll
    <div className='bg-background text-on-surface min-h-screen max-h-screen flex flex-col overflow-hidden'>

     {/*//* Atmospheric glows */}
       <div className='fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none'/>
       <div className='fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none'/>

      {/*//* Header */}
        <InterviewHeader
          role={currentQuestion ? 'Interview' : 'PrepMate AI'}
          currentIndex={currentIndex}
          total={totalQuestions}
        />

      {/*//* Warning banner */}
        <div className='flex justify-center px-8 mb-2 flex-shrink-0'>
           <div className='bg-error-container/20 backdrop-blur-xl px-6 py-2 rounded-xl border border-error/20 flex items-center gap-3'>
             <span
               className='material-symbols-outlined text-error text-sm'
               style={{fontVariationSettings:"'FILL'1"}}
             >
              warning
             </span>
             <span className='font-headline font-bold text-[10px] tracking-widest text-error uppercase'>
               Please stay on this screen to maintain session integrity.
             </span>
           </div>
        </div>

     {/*//* Camera + subtitles */}
       <main className='flex-1 flex flex-col items-center justify-center px-8 relative min-h-0'>
          <CameraView
            question={currentQuestion}
            transcript={transcript}
            isListening={isListening}
            isSpeaking={isSpeaking}
          />
      {/*//* Next Question button — shows after user stops speaking */}
        {isListening && !isSpeaking && transcript && (
          <button
            onClick={handleNextQuestion}
            className='mt-4 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-full text-sm shadow-[0_0_20px_rgba(163,166,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 flex-shrink-0'
          >
            {currentIndex < totalQuestions-1 ? 'Next Question':'Finish Interview'}
            <span className='material-symbols-outlined text-sm'>
              arrow_forward
            </span>
          </button>
        )}
       </main>
      
      {/*//* Controls */}
        <ControlBar 
          isListening={isListening}
          isSpeaking={isSpeaking}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onToggleListen={handleToggleListen}
          onEndInterview={handleEndInterview}
        />
    </div>
  )
}

export default InterviewPage
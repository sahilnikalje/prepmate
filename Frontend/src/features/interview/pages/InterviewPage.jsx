import React, { useEffect, useState } from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import useSpeech from './../hooks/useSpeech';
import dummyQuestions from '../data/dummyQuestions';
import InterviewHeader from './../components/InterviewHeader';
import CameraView from './../components/CameraView';
import ControlBar from './../components/ControlBar';
import interviewService from '../services/interviewService'

//todo STEP-1: Max cross questions per main question
const MAX_CROSS=2

function InterviewPage() {
  const{id}=useParams() //!interviewId from url
  const navigate=useNavigate()

 //todo STEP-2: Questions from Groq (replaces dummyQuestions)
  const[questions, setQuestions]=useState([])
  const[currentIndex, setCurrentIndex]=useState(0)
  const[isMuted, setIsMuted]=useState(false)
  const[isLoading, setIsLoading]=useState(true)
  const[isEvaluating, setIsEvaluating]=useState(false)
  const[crossCount, setCrossCount]=useState(0)
  const[conversation, setConversation]=useState([])
  const[scores, setScores]=useState([])
  const[currentQ, setCurrentQ]=useState('') 
  const[countdown, setCountdown]=useState(10)
  const[showCountdown, setShowCountdown]=useState(true)

  // const[answers, setAnswers]=useState([]) //! store all answers

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

  //todo STEP-3: Load Groq questions when interview room mounts
    useEffect(()=>{
      const loadQuestions=async()=>{
        try{
          const data=await interviewService.getQuestions(id)
          setQuestions(data.questions)
          setCurrentQ(data.questions[0])
        }
        catch(err){
          console.error('Failed to load questions: ', err)
        }
        finally{
          setIsLoading(false)
        }
      }
      loadQuestions()
    },[id])

  //todo STEP-4: Speak question whenever currentQ changes
    useEffect(()=>{
      if(currentQ && !isLoading && !showCountdown){
        speak(currentQ, ()=>startListening())
      }
    },[currentQ, isLoading, showCountdown])

  //todo STEP-5: Toggle listen/stop
    const handleToggleListen=()=>{
      isListening ? stopListening():startListening()
    }

 //todo STEP: Countdown timer — runs when page loads
//todo After 10 sec → hides modal → speaks first question
useEffect(() => {
  if (!showCountdown) return
  if (countdown === 0) {
    setShowCountdown(false)
    return
  }
  const timer = setTimeout(() => {
    setCountdown((prev) => prev - 1)
  }, 1000)
  return () => clearTimeout(timer)
}, [countdown, showCountdown])

  //todo STEP-6: Submit answer — evaluate with Groq
  //todo If weak → ask cross question (max 2x)
  //todo If good or max cross reached → move to next question
  const handleSubmitAnswer= async()=>{
    if(!transcript.trim()) return
    stopListening()
    setIsEvaluating(true)

    try{
      const result=await interviewService.evaluateAnswer({
        question:currentQ,
        answer:transcript,
        role:'Interview Candidate'
      })

     //todo Save this Q&A to conversation
      const entry={
        question:currentQ,
        answer:transcript,
        score:result.score
      }
      setConversation((prev)=>[...prev, entry])
      setScores((prev)=>[...prev, result.score])
      setTrenscript('')

     //todo STEP-7: Cross question logic
      if(result.quality==='weak' && crossCount<MAX_CROSS && result.crossQuestion){
        setCrossCount((prev)=>prev+1)
        setCurrentQ(result.crossQuestion)
      }
      else{
        //todo Move to next main question
        setCrossCount(0)
        const nextIndex=currentIndex+1

         if(nextIndex<questions.length){
           setCurrentIndex(nextIndex)
           setCurrentQ(questions[nextIndex])
         }
         else{
          //todo STEP-8: All done — calculate final score and save
          await handleFinish([...conversation, entry], [...scores, result.score])
         }
      }
    }
    catch(err){
      console.error('Evaluation failed: ', err)
    }
    finally{
      setIsEvaluating(false)
    }
  }

  //todo STEP-9: Calculate average score + save to backend + redirect
   const handleFinish=async(fullConversation, allScores)=>{
     const finalScore=allScores.length>0 ? Math.round(allScores.reduce((a,b)=>a+b, 0)/allScores.length) : 0

     try{
       await interviewService.saveResults({
         interviewId:id,
         conversation:fullConversation,
         finalScore,
       })
     }
     catch(err){
      console.error("Save results failed: ",err)
     }
     finally{
      navigate('/dashboard')
     }
   }
  
  //todo STEP-10: End interview early
    const handleEndInterview=async()=>{
       window.speechSynthesis.cancel()
       await handleFinish(conversation, scores)
    }
    
    const handleToggleMute=()=>{
       setIsMuted((prev)=>{
         window.speechSynthesis.volume=prev ? 1 : 0
         return !prev
       })
    }

  //todo Loading state while Groq generates questions
    if(isLoading){
      return(
        <div className='bg-background min-h-screen flex flex-col items-center justify-center gap-4'>
          <svg className="w-10 h-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
         </svg>
         <p className='font-headline text-on-surface-variant text-lg'>
           Preparing your personalized interview...
         </p>
        </div>
      )
    }
//   // const currentQuestion=dummyQuestions[currentIndex]
//   // const totalQuestions=dummyQuestions.length

//  // When question changes → speak it → then auto-start listening
//  useEffect(()=>{
//    if(currentQuestion){
//     speak(currentQuestion, ()=>{
//       // Auto start listening after AI finishes speaking
//       startListening()
//     })
//    }
//  }, [currentIndex])

//  // Toggle mic listen/stop
//    const handleToggleListen=()=>{
//     if(isListening){
//       stopListening()
//     }
//     else{
//       startListening()
//     }
//    }

//    // Move to next question
//   // Saves current transcript as the answer
//   // Phase 2: send transcript to Groq for evaluation before moving on

//   const handleNextQuestion=()=>{
//     // save answer
//     setAnswers((prev)=>[...prev, {question:currentQuestion, answer:transcript}])
//     setTrenscript('')

//     if(currentIndex<totalQuestions-1){
//       setCurrentIndex((prev)=>prev+1)
//     }
//     else{
//       // Interview done — navigate to results
//       // Phase 3: save to backend before navigating
//       navigate('/dashboard')
//     }
//   }

//  // end interview early
//    const handleEndInterview=()=>{
//     window.speechSynthesis.cancel()
//     navigate('/dashboard')
//    }

// // Mute toggles audio output, not recognition
//   const handleToggleMute=()=>{
//     setIsMuted((prev)=>!prev)
//       window.speechSynthesis.volume=isMuted?1:0
//   }

  return (
 //todo Full screen layout — no scroll
    <div className='bg-background text-on-surface min-h-screen max-h-screen flex flex-col overflow-hidden'>

{/* Countdown Modal */}
{showCountdown && (
  <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center gap-8">

    {/* Glow */}
    <div className="absolute w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

    {/* Content */}
    <div className="relative flex flex-col items-center gap-6 text-center">

      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mic-glow">
        <span
          className="material-symbols-outlined text-white text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          psychology
        </span>
      </div>

      {/* Title */}
      <div>
        <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-2">
          Get Ready!
        </h2>
        <p className="text-on-surface-variant text-sm">
          Your AI interview is about to begin. Make sure you're in a quiet place.
        </p>
      </div>

      {/* Countdown circle */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* SVG circle progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(163,166,255,0.1)"
            strokeWidth="6"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - countdown / 10)}`}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#a3a6ff" />
              <stop offset="100%" stopColor="#c180ff" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-headline text-4xl font-extrabold text-primary">
          {countdown}
        </span>
      </div>

      <p className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">
        Starting interview...
      </p>

      {/* Skip button */}
      <button
        onClick={() => { setCountdown(0); setShowCountdown(false) }}
        className="px-6 py-2.5 rounded-full border border-outline-variant/30 text-sm font-semibold text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all"
      >
        Skip
      </button>

    </div>
  </div>
)}
     {/*//* Atmospheric glows */}
       <div className='fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none'/>
       <div className='fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none'/>

      {/*//* Header */}
        <InterviewHeader
          role={'Interview'}
          currentIndex={currentIndex}
          total={questions.length}
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
            question={currentQ}
            transcript={transcript}
            isListening={isListening}
            isSpeaking={isSpeaking}
          />
      {/*//* Next Question button — shows after user stops speaking */}
        {!isListening && !isSpeaking && !isEvaluating && transcript && (
          <button
            onClick={handleSubmitAnswer}
            className='mt-4 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-full text-sm shadow-[0_0_20px_rgba(163,166,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 flex-shrink-0'
          >
            Submit Answer
            <span className='material-symbols-outlined text-sm'>send</span>            
          </button>
        )}

       {/*//todo Evaluating state */}
        {isEvaluating && (
           <div className='mt-4 flex items-center gap-3 text-secondary flex-shrink-0'>
             <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className='font-headline text-sm font-bold tracking-widest'>
               AI is evaluating your answer...
            </span>
           </div>
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
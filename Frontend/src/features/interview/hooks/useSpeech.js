import React, { useEffect, useRef, useState } from 'react'

function useSpeech() {
    const[transcript, setTranscript]=useState('')
    const[isListening, setIsListening]=useState(false)
    const[isSpeaking, setIsSpeaking]=useState(false)

    const recognitionRef=useRef(null)

 //todo Setup SpeechRecognition once on mount
 //todo SpeechRecognition is built into Chrome/Edge browsers

  useEffect(()=>{
    const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition

    if(!SpeechRecognition){
        console.log('SpeechRecognition is not supported in this browser')
        return
    }

    const recognition=new SpeechRecognition()
    recognition.continuous=true //todo keep listening until we stop it
    recognition.interimResults=true //todo show words as they're being spoken
    recognition.lang='en-US'

    recognition.onresult=(event)=>{
        let fullTranscript=''
        for(let i=0; i<event.results.length; i++){
            fullTranscript+=event.results[i][0].transcript
        }
        setTranscript(fullTranscript)
    }

    recognition.onend=()=>setIsListening(false)
    recognition.onerror=(e)=>{
        console.error('SpeechRecognition error: ', e.error)
        setIsListening(false)
    }
    recognitionRef.current=recognition
  },[])

//todo speak() — browser reads the question aloud
//todo After speaking finishes → auto start listening for answer

  const speak=(text, onDone)=>{
    window.speechSynthesis.cancel() //todo cancel any ongoing speech
    const utterance=new SpeechSynthesisUtterance(text)
    utterance.rate=0.95
    utterance.pitch=1
    utterance.volume=1

    utterance.onstart=()=>setIsSpeaking(true)
    utterance.onend=()=>{
        setIsSpeaking(false)
        if(onDone) onDone() //todo callback — used to auto-start listening
    }
    window.speechSynthesis.speak(utterance)
  }

  //todo Start mic
  const startListening=()=>{
    if(!recognitionRef.current || isListening) return
    setTranscript('') //todo clear previous answer
    recognitionRef.current.start()
    setIsListening(true)
  }

  //todo stop mic
  const stopListening=()=>{
    if(!recognitionRef.current || !isListening) return
    recognitionRef.current.stop()
    setIsListening(false)
  }

  //todo cleanup on unmount
  useEffect(()=>{
    return()=>{
        window.speechSynthesis.cancel()
        if(recognitionRef.current) recognitionRef.current.abort()
    }
  },[])
  return (
    {transcript, isListening, isSpeaking, speak, startListening, stopListening, setTranscript}
  )
}

export default useSpeech
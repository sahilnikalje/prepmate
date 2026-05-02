import axios from 'axios'

const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true
})

//todo STEP-1: Fetch Groq generated questions for this interview session
const getQuestions=async(interviewId)=>{
    const response=await api.get(`/api/groq/questions/${interviewId}`)
    return response.data
}

//todo STEP-2: Evaluate user's answer via Groq
const evaluateAnswer=async({question, answer, role})=>{
    const response=await api.post('/api/groq/evaluate', {question, answer, role})
    return response.data
}

//todo STEP-2: Evaluate user's answer via Groq
const saveResults=async({interviewId, conversation, finalScore})=>{
    const response=await api.post(`/api/groq/results/${interviewId}`, {
        conversation,
        finalScore
    })
    return response.data
}

export default {getQuestions, evaluateAnswer, saveResults}
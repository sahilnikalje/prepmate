import axios from 'axios'

const api=axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials:true
})

//todo Stub for starting an interview session
const startInterview=async({role, category, industry, jobDescription, resumeFile})=>{
     //! --- DUMMY (remove when backend ready) ---
     return {interviewId:'dummy-123'}
}

//todo Stub for generating JD via Groq AI
const generateJobDescription =async({role, category, industry})=>{
    //! dummy
    return{
        jobDescription:
          `We are looking for a ${role} specializing in ${category}
           within the ${industry} industry. You will be responsible for designing, 
           building, and maintaining high-quality solutions. Strong communication 
           and problem-solving skills are required.`
    }
}

export default {startInterview, generateJobDescription}
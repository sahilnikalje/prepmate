import axios from 'axios'

const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true
})

const getDashboardData=async()=>{
    const response=await api.get('/api/dashboard')
    return response.data
}

export default {getDashboardData}

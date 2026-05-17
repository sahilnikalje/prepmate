import axios from 'axios';

const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true,
})

const getAnalyticsData=async()=>{
    const response=await api.get('/api/analytics')
    return response.data
}

export default {getAnalyticsData}
import axios from 'axios'

const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true
})

const register=async(name, email, password)=>{
    const response=await api.post('/api/auth/register', {name, email, password})
    return response.data
}

const login=async(email, password)=>{
    const response=await api.post('/api/auth/login', {email, password})
    return response.data
}

const logout=async()=>{
    const response=await api.post('/api/auth/logout')
    return response.data
}

const getMe=async()=>{
    const response=await api.get('/api/auth/me')
    return response.data
}

export default {register, login, logout, getMe}
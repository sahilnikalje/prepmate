import axios from 'axios'

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL,
  withCredentials: true,
})

const getSettings         = async ()       => (await api.get('/api/settings')).data
const updateSettings      = async (data)   => (await api.put('/api/settings', data)).data
const changePassword      = async (data)   => (await api.put('/api/settings/change-password', data)).data
const deleteAccount       = async ()       => (await api.delete('/api/settings/delete-account')).data

export default { getSettings, updateSettings, changePassword, deleteAccount }
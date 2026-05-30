import axios from 'axios'

const api=axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials:true,
})

//todo STEP-1: Get all resources with optional filters
const getResources = async ({ search = '', category = '', role = '', difficulty = '' } = {}) => {
  const params = {}
  if (search)     params.search     = search
  if (category)   params.category   = category
  if (role)       params.role       = role
  if (difficulty) params.difficulty = difficulty

  const response = await api.get('/api/resources', { params })
  return response.data
}

//todo STEP-2: Get single resource by ID
const getResourceById = async (id) => {
  const response = await api.get(`/api/resources/${id}`)
  return response.data
}

//todo STEP-3: Get featured resources
const getFeatured = async () => {
  const response = await api.get('/api/resources/featured')
  return response.data
}

//todo STEP-4: Get category counts
const getCategories = async () => {
  const response = await api.get('/api/resources/categories')
  return response.data
}

export default {getResources, getResourceById, getFeatured, getCategories}
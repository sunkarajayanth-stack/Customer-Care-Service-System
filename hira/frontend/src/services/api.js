import axios from 'axios'

export const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API,
  timeout: 10000,
})

export const submitIncident = (payload) => api.post('/incident', payload)
export const getBuildingMap = () => api.get('/map')

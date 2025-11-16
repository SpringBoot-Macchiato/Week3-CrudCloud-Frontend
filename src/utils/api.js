const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la respuesta del servidor' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('API GET Error:', error)
      throw error
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('API POST Error:', error)
      throw error
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('API PUT Error:', error)
      throw error
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('API DELETE Error:', error)
      throw error
    }
  },
}

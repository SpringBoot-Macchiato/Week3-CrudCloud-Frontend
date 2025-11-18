const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const handleResponse = async (response) => {
  // Si la respuesta es exitosa
  if (response.ok) {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    return response.text()
  }

  // Si hay un error, intentar obtener el mensaje del servidor
  let errorMessage = `Error ${response.status}`
  
  try {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json()
      errorMessage = errorData.error || errorData.message || errorMessage
    } else {
      const errorText = await response.text()
      errorMessage = errorText || errorMessage
    }
  } catch (parseError) {
    console.error('Error parsing error response:', parseError)
  }

  // Lanzar error con el mensaje apropiado
  throw new Error(errorMessage)
}

export const api = {
  async get(endpoint) {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        headers,
      })
      
      return await handleResponse(response)
    } catch (error) {
      console.error('API GET Error:', error)
      throw error
    }
  },

  async post(endpoint, data) {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
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
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers,
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
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      })
      
      return await handleResponse(response)
    } catch (error) {
      console.error('API DELETE Error:', error)
      throw error
    }
  },

  async patch(endpoint, data) {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      })
      
      return await handleResponse(response)
    } catch (error) {
      console.error('API PATCH Error:', error)
      throw error
    }
  },
}
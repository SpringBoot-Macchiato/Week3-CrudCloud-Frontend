import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const mockUser = {
      email,
      name: email.split('@')[0],
      plan: 'FREE'
    }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  const googleLogin = async (credentialToken) => {
    try {
      const response = await api.post('/auth/google/login', {
        credential: credentialToken
      })

      const { token, email, role } = response

      // Store JWT token
      localStorage.setItem('token', token)

      // Create user object
      const googleUser = {
        email,
        name: email.split('@')[0],
        role,
        plan: 'FREE' // Default plan for new users
      }

      setUser(googleUser)
      localStorage.setItem('user', JSON.stringify(googleUser))

      return { success: true }
    } catch (error) {
      console.error('Error en Google login:', error)
      return {
        success: false,
        error: error.message || 'Error al autenticar con Google'
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const value = {
    user,
    login,
    googleLogin,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

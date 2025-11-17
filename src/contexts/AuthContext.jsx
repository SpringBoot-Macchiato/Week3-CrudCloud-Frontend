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
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Llamar al backend para login
      const response = await api.post('/auth/login', { email, password })

      // Backend devuelve: { token, email, role }
      const { token, email: userEmail, role } = response

      // Guardar token
      localStorage.setItem('token', token)

      // Crear objeto user (sin plan por ahora, se carga después)
      const userData = {
        email: userEmail,
        name: userEmail.split('@')[0], // Extraer nombre del email
        role: role,
        plan: 'FREE' // Default, se actualizará al cargar el plan real
      }

      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.message || 'Error al iniciar sesión'
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
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

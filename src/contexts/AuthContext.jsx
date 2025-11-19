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
    const token = localStorage.getItem('token')
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })

      const { token, userId, email: userEmail, fullName, role } = response

      // Store JWT token
      localStorage.setItem('token', token)

      // Create user object
      const userObj = {
        id: userId,
        userId: userId, // Agregar userId para compatibilidad con MiPlan.jsx
        email: userEmail,
        name: fullName || userEmail.split('@')[0],
        role,
        plan: 'FREE' // Se actualizará después de obtener el plan activo
      }

      setUser(userObj)
      localStorage.setItem('user', JSON.stringify(userObj))

      // Obtener plan activo del usuario
      try {
        const activePlans = await api.get(`/users-plans/user/${userId}/active`)
        if (activePlans && activePlans.length > 0) {
          userObj.plan = activePlans[0].planName || 'FREE'
          setUser(userObj)
          localStorage.setItem('user', JSON.stringify(userObj))
        }
      } catch (planError) {
        console.log('No se pudo cargar el plan activo:', planError)
      }

      return { success: true }
    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        error: error.message === 'Password is incorrect' || error.message === 'User not found'
          ? 'Credenciales inválidas'
          : 'Error al iniciar sesión. Intenta de nuevo.'
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/users/register', {
        email,
        password,
        fullName: name,
        role: 'USER'
      })

      // Después del registro exitoso, hacer login automático
      const loginResult = await login(email, password)

      if (loginResult.success) {
        return { success: true }
      } else {
        return loginResult
      }
    } catch (error) {
      console.error('Error en registro:', error)

      // Manejar errores específicos
      if (error.message.includes('already registered')) {
        return {
          success: false,
          error: 'Este correo ya está registrado'
        }
      }

      return {
        success: false,
        error: 'Error al crear la cuenta. Verifica tus datos e intenta de nuevo.'
      }
    }
  }

  const googleLogin = async (credentialToken) => {
    try {
      const response = await api.post('/auth/google/login', {
        credential: credentialToken
      })

      const { token, userId, email, fullName, role } = response

      // Store JWT token
      localStorage.setItem('token', token)

      // Create user object
      const userObj = {
        id: userId,
        userId: userId, // Agregar userId para compatibilidad con MiPlan.jsx
        email,
        name: fullName || email.split('@')[0],
        role,
        plan: 'FREE'
      }

      setUser(userObj)
      localStorage.setItem('user', JSON.stringify(userObj))

      // Obtener plan activo del usuario
      try {
        const activePlans = await api.get(`/users-plans/user/${userId}/active`)
        if (activePlans && activePlans.length > 0) {
          userObj.plan = activePlans[0].planName || 'FREE'
          setUser(userObj)
          localStorage.setItem('user', JSON.stringify(userObj))
        }
      } catch (planError) {
        console.log('No se pudo cargar el plan activo:', planError)
      }

      return { success: true }
    } catch (error) {
      console.error('Error en Google login:', error)
      return {
        success: false,
        error: 'Error al autenticar con Google. Intenta de nuevo.'
      }
    }
  }

  const githubLogin = async (code) => {
    try {
      const response = await api.post('/auth/github/login', { code })

      const { token, userId, email, fullName, role } = response

      // Store JWT token
      localStorage.setItem('token', token)

      // Create user object
      const userObj = {
        id: userId,
        userId: userId, // Agregar userId para compatibilidad con MiPlan.jsx
        email,
        name: fullName || email.split('@')[0],
        role,
        plan: 'FREE'
      }

      setUser(userObj)
      localStorage.setItem('user', JSON.stringify(userObj))

      // Obtener plan activo del usuario
      try {
        const activePlans = await api.get(`/users-plans/user/${userId}/active`)
        if (activePlans && activePlans.length > 0) {
          userObj.plan = activePlans[0].planName || 'FREE'
          setUser(userObj)
          localStorage.setItem('user', JSON.stringify(userObj))
        }
      } catch (planError) {
        console.log('No se pudo cargar el plan activo:', planError)
      }

      return { success: true }
    } catch (error) {
      console.error('Error en GitHub login:', error)
      return {
        success: false,
        error: 'Error al autenticar con GitHub. Intenta de nuevo.'
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
    register,
    googleLogin,
    githubLogin,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

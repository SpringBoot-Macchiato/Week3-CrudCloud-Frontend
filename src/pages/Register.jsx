import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import { Database, ArrowLeft, Loader2 } from 'lucide-react'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const { register, googleLogin } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      // Llamar al método de registro
      const result = await register(formData.name, formData.email, formData.password)
      
      if (result.success) {
        navigate('/app/dashboard')
      } else {
        setError(result.error || 'Error al crear la cuenta')
      }
    } catch (err) {
      console.error('Error en registro:', err)
      setError('Error al crear la cuenta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    setGoogleLoading(true)
    setError(null)

    try {
      const result = await googleLogin(tokenResponse.access_token)

      if (result.success) {
        navigate('/app/dashboard')
      } else {
        setError(result.error || 'Error al autenticar con Google')
      }
    } catch (err) {
      console.error('Error en Google login:', err)
      setError('Error al procesar la autenticación con Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGoogleLoginError = (error) => {
    console.error('Google login error:', error)
    setError('Error al iniciar sesión con Google')
    setGoogleLoading(false)
  }

  const googleLoginHandler = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
    flow: 'implicit',
  })

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botón volver a Landing */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-text dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          <span>Volver al inicio</span>
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-6 md:p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <button
              onClick={() => navigate('/')}
              className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              title="Volver al inicio"
            >
              <Database className="text-primary" size={24} />
            </button>
          </div>

          {/* Título */}
          <h2 className="text-xl md:text-2xl font-semibold text-text dark:text-white text-center mb-6 md:mb-8">
            Crear cuenta
          </h2>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Botón de Google */}
          <button
            type="button"
            onClick={googleLoginHandler}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 md:py-3 border-2 border-border dark:border-slate-700 rounded-lg font-medium text-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm md:text-base">Procesando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm md:text-base">Continuar con Google</span>
              </>
            )}
          </button>

          {/* Separador */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                O continuar con email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-sm font-medium text-text dark:text-white mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 md:py-3 border border-border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Juan Pérez"
                required
                disabled={loading || googleLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 md:py-3 border border-border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="tu@email.com"
                required
                disabled={loading || googleLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-white mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 md:py-3 border border-border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading || googleLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-white mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 md:py-3 border border-border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-text dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading || googleLoading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-primary text-white py-2.5 md:py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-6">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:underline font-medium"
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Eye, EyeOff, RotateCw, Download, Loader2 } from 'lucide-react'
import { api } from '../utils/api'
import { showError, showConfirm, showCopyableText, showInfo } from '../utils/alerts'

const DetalleInstancia = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState('')
  const [instancia, setInstancia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rotating, setRotating] = useState(false)

  useEffect(() => {
    loadInstance()
  }, [id])

  const loadInstance = async () => {
    try {
      setLoading(true)
      const data = await api.get(`/instances/${id}`)
      setInstancia(data)
    } catch (error) {
      console.error('Error cargando instancia:', error)
      await showError('No se pudieron cargar los detalles de la instancia')
      navigate('/app/instancias')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (value, field) => {
    navigator.clipboard.writeText(value)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000)
  }

  const handleRotatePassword = async () => {
    const result = await showConfirm(
      'La contraseña actual dejará de funcionar.',
      '¿Rotar contraseña?',
      'Sí, rotar',
      'Cancelar'
    )

    if (!result.isConfirmed) {
      return
    }

    try {
      setRotating(true)
      const newPassword = await api.post(`/instances/${id}/rotate-password`)

      await showCopyableText(
        newPassword,
        'Nueva contraseña generada',
        '⚠️ Guarda esta contraseña ahora. La contraseña anterior ya no es válida.'
      )

      // Recargar la instancia
      await loadInstance()
    } catch (error) {
      console.error('Error rotando contraseña:', error)
      await showError(error.message || 'Ocurrió un error al rotar la contraseña')
    } finally {
      setRotating(false)
    }
  }

  const handleDownloadPDF = async () => {
    await showInfo('Función de descarga de PDF en desarrollo', 'Próximamente')
    // TODO: Implementar generación de PDF con las credenciales
  }

  const getEngineName = (engineId) => {
    switch (engineId) {
      case 1: return 'MySQL'
      case 2: return 'PostgreSQL'
      case 3: return 'SQL Server'
      default: return 'Unknown'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!instancia) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Instancia no encontrada</p>
        <button
          onClick={() => navigate('/app/instancias')}
          className="mt-4 text-primary hover:underline"
        >
          Volver a instancias
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Botón volver */}
      <button
        onClick={() => navigate('/app/instancias')}
        className="flex items-center gap-2 text-sm md:text-base text-slate-600 dark:text-slate-300 hover:text-text dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Volver a instancias</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text dark:text-white mb-2">{instancia.dbName}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            {getEngineName(instancia.engineId)}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              instancia.state === 'RUNNING'
                ? 'bg-success/10 text-success'
                : instancia.state === 'CREATING'
                ? 'bg-primary/10 text-primary'
                : instancia.state === 'SUSPENDED'
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}
          >
            {instancia.state}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Credenciales */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-text dark:text-white mb-4">Credenciales de acceso</h2>
          
          {instancia.passwordShown ? (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ La contraseña ya fue mostrada anteriormente y no se almacena en texto plano. 
                Si la perdiste, puedes generar una nueva usando el botón "Rotar contraseña".
              </p>
            </div>
          ) : null}

          <div className="space-y-4">
            {/* Host */}
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-medium text-text dark:text-white">Host</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={instancia.host || '-'}
                  readOnly
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border border-border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-text dark:text-white font-mono text-xs md:text-sm"
                />
                <button
                  onClick={() => handleCopy(instancia.host, 'host')}
                  className="p-2 md:p-2.5 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  <Copy size={18} className={copied === 'host' ? 'text-success' : 'text-slate-600 dark:text-slate-300'} />
                </button>
              </div>
            </div>

            {/* Puerto */}
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-medium text-text dark:text-white">Puerto</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={instancia.port || '-'}
                  readOnly
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border border-border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-text dark:text-white font-mono text-xs md:text-sm"
                />
                <button
                  onClick={() => handleCopy(instancia.port?.toString(), 'port')}
                  className="p-2 md:p-2.5 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  <Copy size={18} className={copied === 'port' ? 'text-success' : 'text-slate-600 dark:text-slate-300'} />
                </button>
              </div>
            </div>

            {/* Base de datos */}
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-medium text-text dark:text-white">Base de datos</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={instancia.dbName || '-'}
                  readOnly
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border border-border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-text dark:text-white font-mono text-xs md:text-sm"
                />
                <button
                  onClick={() => handleCopy(instancia.dbName, 'dbName')}
                  className="p-2 md:p-2.5 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  <Copy size={18} className={copied === 'dbName' ? 'text-success' : 'text-slate-600 dark:text-slate-300'} />
                </button>
              </div>
            </div>

            {/* Usuario */}
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-medium text-text dark:text-white">Usuario</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={instancia.userDb || '-'}
                  readOnly
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border border-border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-text dark:text-white font-mono text-xs md:text-sm"
                />
                <button
                  onClick={() => handleCopy(instancia.userDb, 'userDb')}
                  className="p-2 md:p-2.5 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  <Copy size={18} className={copied === 'userDb' ? 'text-success' : 'text-slate-600 dark:text-slate-300'} />
                </button>
              </div>
            </div>

            {/* Contraseña (solo si está disponible) */}
            {instancia.password && (
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-medium text-text dark:text-white">Contraseña</label>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={instancia.password}
                    readOnly
                    className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border border-border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-text dark:text-white font-mono text-xs md:text-sm"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 md:p-2.5 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                  >
                    {showPassword ? <EyeOff size={18} className="text-slate-600 dark:text-slate-300" /> : <Eye size={18} className="text-slate-600 dark:text-slate-300" />}
                  </button>
                  <button
                    onClick={() => handleCopy(instancia.password, 'password')}
                    className="p-2 md:p-2.5 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                  >
                    <Copy size={18} className={copied === 'password' ? 'text-success' : 'text-slate-600 dark:text-slate-300'} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border dark:border-slate-700 space-y-3">
            <button 
              onClick={handleRotatePassword}
              disabled={rotating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border dark:border-slate-700 rounded-lg font-medium text-sm text-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {rotating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Rotando...</span>
                </>
              ) : (
                <>
                  <RotateCw size={18} />
                  <span>Rotar contraseña</span>
                </>
              )}
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border dark:border-slate-700 rounded-lg font-medium text-sm text-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download size={18} />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

        {/* Información y advertencia */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-text dark:text-white mb-4">Información</h2>
            <div className="space-y-3">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Fecha de creación</span>
                <span className="text-sm text-text dark:text-white font-medium text-right">
                  {formatDate(instancia.createdAt)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Motor</span>
                <span className="text-sm text-text dark:text-white font-medium text-right">
                  {getEngineName(instancia.engineId)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Estado</span>
                <span className="text-sm text-text dark:text-white font-medium text-right">
                  {instancia.state}
                </span>
              </div>
              {instancia.updatedAt && (
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Última actualización</span>
                  <span className="text-sm text-text dark:text-white font-medium text-right">
                    {formatDate(instancia.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 md:p-6">
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm md:text-base">⚠️ Importante</h3>
            <p className="text-xs md:text-sm text-amber-800 dark:text-amber-300">
              La contraseña solo se muestra una vez al crear la instancia. Guárdala en un lugar seguro.
              Si la pierdes, puedes rotarla y se generará una nueva.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleInstancia
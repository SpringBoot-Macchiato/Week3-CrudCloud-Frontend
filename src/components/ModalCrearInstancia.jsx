import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'
import { showSuccess } from '../utils/alerts'
import Swal from 'sweetalert2'

const ModalCrearInstancia = ({ motor, onClose, onSuccess }) => {
  const { user } = useAuth()
  const [dbName, setDbName] = useState('')
  const [userDb, setUserDb] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [createdInstance, setCreatedInstance] = useState(null)
  
  // Determinar si el usuario tiene un plan de pago
  const isPlanPago = user?.plan !== 'FREE'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const requestData = {
        engineId: motor.id
      }

      // Solo incluir dbName y userDb si el usuario tiene plan de pago Y los ha llenado
      if (isPlanPago && dbName.trim()) {
        requestData.dbName = dbName.trim()
      }
      if (isPlanPago && userDb.trim()) {
        requestData.userDb = userDb.trim()
      }

      const response = await api.post('/instances', requestData)

      setCreatedInstance(response)

      // Mostrar modal con credenciales
      await Swal.fire({
        icon: 'success',
        title: 'Instancia creada exitosamente',
        html: `
          <div class="text-left space-y-3">
            <p class="text-amber-600 dark:text-amber-400 font-semibold text-sm mb-4">
              ⚠️ IMPORTANTE: Guarda estas credenciales ahora, la contraseña no se volverá a mostrar.
            </p>
            <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg space-y-2 text-sm">
              <div><strong>Base de datos:</strong> <code>${response.dbName}</code></div>
              <div><strong>Usuario:</strong> <code>${response.userDb}</code></div>
              <div><strong>Contraseña:</strong> <code class="text-error">${response.password}</code></div>
              <div><strong>Host:</strong> <code>${response.host}</code></div>
              <div><strong>Puerto:</strong> <code>${response.port}</code></div>
            </div>
          </div>
        `,
        confirmButtonText: 'Entendido',
        customClass: {
          confirmButton: 'bg-success hover:bg-success/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors',
          popup: 'rounded-xl',
        },
        buttonsStyling: false,
      })

      // Llamar al callback de éxito y cerrar modal
      if (onSuccess) onSuccess()
      onClose()
      
    } catch (err) {
      console.error('Error creando instancia:', err)
      setError(err.message || 'Error al crear la instancia. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text dark:text-white">Crear instancia</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X size={20} className="dark:text-slate-300" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text dark:text-white mb-2">Motor</label>
            <input
              type="text"
              value={motor?.name || ''}
              readOnly
              className="w-full px-4 py-3 border border-border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-text dark:text-white"
            />
          </div>

          {isPlanPago ? (
            <>
              <div>
                <label className="block text-sm font-medium text-text dark:text-white mb-2">
                  Nombre de la base de datos (opcional)
                </label>
                <input
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="w-full px-4 py-3 border border-border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="prod_mysql_01"
                  disabled={loading}
                  pattern="^[a-zA-Z0-9_-]{0,63}$"
                  title="Solo letras, números, guiones y guiones bajos (máx. 63 caracteres)"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Si lo dejas vacío, se generará automáticamente
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text dark:text-white mb-2">
                  Nombre de usuario (opcional)
                </label>
                <input
                  type="text"
                  value={userDb}
                  onChange={(e) => setUserDb(e.target.value)}
                  className="w-full px-4 py-3 border border-border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-text dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="user_prod"
                  disabled={loading}
                  pattern="^[a-zA-Z0-9_-]{0,32}$"
                  title="Solo letras, números, guiones y guiones bajos (máx. 32 caracteres)"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Si lo dejas vacío, se generará automáticamente
                </p>
              </div>
            </>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                En el plan Free, los nombres se generan automáticamente
              </p>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ℹ️ Las credenciales se mostrarán una sola vez después de crear la instancia. Guárdalas en un lugar seguro.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-border dark:border-slate-700 rounded-lg font-medium text-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear instancia'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalCrearInstancia
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pause, Play, Trash2, RotateCw, Plus, AlertCircle } from 'lucide-react'
import { api } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { getUserActivePlan } from '../utils/apiServices'
import { showSuccess, showError, showDeleteConfirm, showCopyableText } from '../utils/alerts'

const Instancias = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [instancias, setInstancias] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [planLimits, setPlanLimits] = useState({ maxInstances: 2, planName: 'FREE' })

  useEffect(() => {
    loadInstances()
    loadPlanLimits()
  }, [])

  const loadPlanLimits = async () => {
    try {
      if (user?.userId) {
        const activePlan = await getUserActivePlan(user.userId)
        setPlanLimits({
          maxInstances: activePlan.maxInstances || 2,
          planName: activePlan.planName || 'FREE'
        })
      } else {
        // Usar valores por defecto si no hay userId
        setPlanLimits({ maxInstances: 2, planName: user?.plan || 'FREE' })
      }
    } catch (error) {
      console.log('No se pudo cargar el plan activo, usando valores por defecto:', error)
      // Fallback a valores por defecto según el plan del usuario
      const defaultLimits = {
        'FREE': 2,
        'STANDARD': 5,
        'PREMIUM': 10
      }
      setPlanLimits({
        maxInstances: defaultLimits[user?.plan] || 2,
        planName: user?.plan || 'FREE'
      })
    }
  }

  const loadInstances = async () => {
    try {
      setLoading(true)
      const data = await api.get('/instances')
      setInstancias(data)
    } catch (error) {
      console.error('Error cargando instancias:', error)
      showError('No se pudieron cargar las instancias. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action, id) => {
    if (actionLoading) return

    // Para delete, mostrar confirmación primero
    if (action === 'delete') {
      const result = await showDeleteConfirm('¿Estás seguro de que deseas eliminar esta instancia? Esta acción no se puede deshacer.')
      if (!result.isConfirmed) {
        return
      }
    }

    setActionLoading(`${action}-${id}`)

    try {
      switch (action) {
        case 'suspend':
          await api.post(`/instances/${id}/suspend`)
          await showSuccess('La instancia ha sido suspendida correctamente')
          break
        case 'resume':
          await api.post(`/instances/${id}/resume`)
          await showSuccess('La instancia ha sido reanudada correctamente')
          break
        case 'rotate':
          const newPassword = await api.post(`/instances/${id}/rotate-password`)
          await showCopyableText(newPassword, 'Nueva contraseña generada')
          break
        case 'delete':
          await api.delete(`/instances/${id}`)
          await showSuccess('La instancia ha sido eliminada correctamente')
          break
        default:
          break
      }

      // Recargar lista de instancias
      await loadInstances()
    } catch (error) {
      console.error(`Error en acción ${action}:`, error)
      await showError(error.message || 'Ocurrió un error al realizar la operación')
    } finally {
      setActionLoading(null)
    }
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
      month: '2-digit',
      day: '2-digit'
    })
  }

  // Contar instancias en estado RUNNING
  const countRunningInstances = () => {
    return instancias.filter(inst => inst.state === 'RUNNING').length
  }

  // Verificar si se puede activar más instancias
  const canActivateMoreInstances = () => {
    return countRunningInstances() < planLimits.maxInstances
  }

  // Verificar si una instancia específica puede ser activada
  const canActivateInstance = (instanceState) => {
    if (instanceState === 'RUNNING') return true // Ya está activa
    if (instanceState !== 'SUSPENDED') return false // Solo se pueden activar las suspendidas
    return canActivateMoreInstances()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-text dark:text-white mb-2">Mis instancias</h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">Gestiona tus bases de datos en la nube</p>
        </div>
        <button
          onClick={() => navigate('/app/motores')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          <Plus size={20} />
          <span>Nueva instancia</span>
        </button>
      </div>

      {/* Plan Limit Warning */}
      {!canActivateMoreInstances() && instancias.some(inst => inst.state === 'SUSPENDED') && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm md:text-base">
                Límite de instancias activas alcanzado
              </h3>
              <p className="text-xs md:text-sm text-amber-800 dark:text-amber-300 mt-1">
                Tu plan <span className="font-medium">{planLimits.planName}</span> permite hasta {planLimits.maxInstances} instancias activas.
                Tienes {countRunningInstances()} instancias en ejecución.
                Para activar más instancias, suspende alguna de las activas o{' '}
                <button
                  onClick={() => navigate('/app/mi-plan')}
                  className="underline font-medium hover:text-amber-900 dark:hover:text-amber-100"
                >
                  mejora tu plan
                </button>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vista de tabla para desktop/tablet */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-text dark:text-white">Motor</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-text dark:text-white">Nombre</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-text dark:text-white">Estado</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-text dark:text-white">Fecha</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-text dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-700">
              {instancias.map((instancia) => (
                <tr key={instancia.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-text dark:text-white">{getEngineName(instancia.engineId)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 dark:text-slate-300">{instancia.dbName}</span>
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 dark:text-slate-300">{formatDate(instancia.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/app/instancias/${instancia.id}`)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} className="text-slate-600 dark:text-slate-300" />
                      </button>
                      {instancia.state === 'RUNNING' ? (
                        <button
                          onClick={() => handleAction('suspend', instancia.id)}
                          disabled={actionLoading !== null}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                          title="Suspender"
                        >
                          <Pause size={18} className="text-slate-600 dark:text-slate-300" />
                        </button>
                      ) : instancia.state === 'SUSPENDED' && canActivateInstance(instancia.state) ? (
                        <button
                          onClick={() => handleAction('resume', instancia.id)}
                          disabled={actionLoading !== null}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                          title="Reanudar"
                        >
                          <Play size={18} className="text-slate-600 dark:text-slate-300" />
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleAction('rotate', instancia.id)}
                        disabled={actionLoading !== null}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                        title="Rotar contraseña"
                      >
                        <RotateCw size={18} className="text-slate-600 dark:text-slate-300" />
                      </button>
                      <button
                        onClick={() => handleAction('delete', instancia.id)}
                        disabled={actionLoading !== null}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        title="Eliminar"
                      >
                        <Trash2 size={18} className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de cards para mobile */}
      <div className="md:hidden space-y-4">
        {instancias.map((instancia) => (
          <div
            key={instancia.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-text dark:text-white mb-1">{instancia.dbName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{getEngineName(instancia.engineId)}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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

            <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Creada: {formatDate(instancia.createdAt)}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border dark:border-slate-700">
              <button
                onClick={() => navigate(`/app/instancias/${instancia.id}`)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
              >
                <Eye size={18} />
                <span>Ver detalles</span>
              </button>
              {instancia.state === 'RUNNING' ? (
                <button
                  onClick={() => handleAction('suspend', instancia.id)}
                  disabled={actionLoading !== null}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  title="Suspender"
                >
                  <Pause size={18} className="text-slate-600 dark:text-slate-300" />
                </button>
              ) : instancia.state === 'SUSPENDED' && canActivateInstance(instancia.state) ? (
                <button
                  onClick={() => handleAction('resume', instancia.id)}
                  disabled={actionLoading !== null}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  title="Reanudar"
                >
                  <Play size={18} className="text-slate-600 dark:text-slate-300" />
                </button>
              ) : null}
              <button
                onClick={() => handleAction('rotate', instancia.id)}
                disabled={actionLoading !== null}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                title="Rotar contraseña"
              >
                <RotateCw size={18} className="text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={() => handleAction('delete', instancia.id)}
                disabled={actionLoading !== null}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                title="Eliminar"
              >
                <Trash2 size={18} className="text-error" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {instancias.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            No tienes instancias creadas aún
          </p>
          <button
            onClick={() => navigate('/app/motores')}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Crear primera instancia
          </button>
        </div>
      )}
    </div>
  )
}

export default Instancias
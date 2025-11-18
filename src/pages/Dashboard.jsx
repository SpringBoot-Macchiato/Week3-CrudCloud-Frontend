import { useState, useEffect } from 'react'
import { Box, Database, Activity, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'

const Dashboard = () => {
  const { user } = useAuth()
  const [instances, setInstances] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePlan, setActivePlan] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Cargar instancias del usuario
      const instancesData = await api.get('/instances')
      setInstances(instancesData)
      
      // Cargar plan activo del usuario
      try {
        const plansData = await api.get(`/users-plans/user/${user?.id || 1}/active`)
        if (plansData && plansData.length > 0) {
          setActivePlan(plansData[0])
        }
      } catch (error) {
        console.log('No se pudo cargar el plan activo:', error)
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const activeInstances = instances.filter(i => i.state === 'RUNNING').length
  const planName = activePlan?.planName || user?.plan || 'FREE'

  const stats = [
    { label: 'Instancias activas', value: activeInstances.toString(), icon: Box, color: 'primary' },
    { label: 'Motores disponibles', value: '6', icon: Database, color: 'success' },
    { label: 'Plan actual', value: planName, icon: Activity, color: 'primary' },
    { label: 'Total instancias', value: instances.length.toString(), icon: TrendingUp, color: 'success' },
  ]

  const recentInstances = instances.slice(0, 3)

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
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text dark:text-white mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          Bienvenido de vuelta, {user?.name || user?.email?.split('@')[0]}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-4 md:p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                <stat.icon className={`text-${stat.color}`} size={20} />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-text dark:text-white mb-1">{stat.value}</p>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Instances */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700">
        <div className="p-4 md:p-6 border-b border-border dark:border-slate-700">
          <h2 className="text-base md:text-lg font-semibold text-text dark:text-white">Instancias recientes</h2>
        </div>
        <div className="divide-y divide-border dark:divide-slate-700">
          {recentInstances.length > 0 ? (
            recentInstances.map((instance) => (
              <div key={instance.id} className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-text dark:text-white">{instance.dbName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {instance.engineId === 1 ? 'MySQL' : instance.engineId === 2 ? 'PostgreSQL' : instance.engineId === 3 ? 'SQL Server' : 'Unknown'}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                    instance.state === 'RUNNING'
                      ? 'bg-success/10 text-success'
                      : instance.state === 'SUSPENDED'
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      : instance.state === 'CREATING'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  }`}
                >
                  {instance.state}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 md:p-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No tienes instancias creadas aún. <br />
              <a href="/app/motores" className="text-primary hover:underline">
                Crea tu primera instancia
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
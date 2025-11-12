import { Box, Database, Activity, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  const stats = [
    { label: 'Instancias activas', value: '3', icon: Box, color: 'primary' },
    { label: 'Motores disponibles', value: '6', icon: Database, color: 'success' },
    { label: 'Plan actual', value: user?.plan || 'FREE', icon: Activity, color: 'primary' },
    { label: 'Uso mensual', value: '60%', icon: TrendingUp, color: 'success' },
  ]

  const recentInstances = [
    { name: 'prod-mysql-01', motor: 'MySQL', estado: 'RUNNING' },
    { name: 'dev-postgres-01', motor: 'PostgreSQL', estado: 'RUNNING' },
    { name: 'cache-redis-01', motor: 'Redis', estado: 'SUSPENDED' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-text dark:text-white mb-2">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Bienvenido de vuelta, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                <stat.icon className={`text-${stat.color}`} size={20} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-text dark:text-white mb-1">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700">
        <div className="p-6 border-b border-border dark:border-slate-700">
          <h2 className="text-lg font-semibold text-text dark:text-white">Instancias recientes</h2>
        </div>
        <div className="divide-y divide-border dark:divide-slate-700">
          {recentInstances.map((instance) => (
            <div key={instance.name} className="p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
              <div>
                <p className="font-medium text-text dark:text-white">{instance.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{instance.motor}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  instance.estado === 'RUNNING'
                    ? 'bg-success/10 text-success'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {instance.estado}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

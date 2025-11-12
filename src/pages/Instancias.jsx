import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pause, Play, Trash2, RotateCw, Plus } from 'lucide-react'

const Instancias = () => {
  const navigate = useNavigate()
  const [instancias, setInstancias] = useState([
    {
      id: 1,
      motor: 'MySQL',
      nombre: 'prod-mysql-01',
      estado: 'RUNNING',
      fecha: '2024-11-10',
    },
    {
      id: 2,
      motor: 'PostgreSQL',
      nombre: 'dev-postgres-01',
      estado: 'RUNNING',
      fecha: '2024-11-09',
    },
    {
      id: 3,
      motor: 'Redis',
      nombre: 'cache-redis-01',
      estado: 'SUSPENDED',
      fecha: '2024-11-08',
    },
  ])

  const handleAction = (action, id) => {
    console.log(action, id)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-text dark:text-white mb-2">Mis instancias</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestiona tus bases de datos en la nube</p>
        </div>
        <button
          onClick={() => navigate('/motores')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Nueva instancia
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 overflow-hidden">
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
                    <span className="font-medium text-text dark:text-white">{instancia.motor}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 dark:text-slate-300">{instancia.nombre}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        instancia.estado === 'RUNNING'
                          ? 'bg-success/10 text-success'
                          : instancia.estado === 'CREATING'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {instancia.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 dark:text-slate-300">{instancia.fecha}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/instancias/${instancia.id}`)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} className="text-slate-600" />
                      </button>
                      {instancia.estado === 'RUNNING' ? (
                        <button
                          onClick={() => handleAction('suspend', instancia.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Suspender"
                        >
                          <Pause size={18} className="text-slate-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction('resume', instancia.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Reanudar"
                        >
                          <Play size={18} className="text-slate-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleAction('rotate', instancia.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Rotar contraseña"
                      >
                        <RotateCw size={18} className="text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleAction('delete', instancia.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
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
    </div>
  )
}

export default Instancias

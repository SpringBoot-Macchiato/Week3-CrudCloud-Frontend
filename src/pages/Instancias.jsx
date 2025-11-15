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
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
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
                        onClick={() => navigate(`/app/instancias/${instancia.id}`)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} className="text-slate-600 dark:text-slate-300" />
                      </button>
                      {instancia.estado === 'RUNNING' ? (
                        <button
                          onClick={() => handleAction('suspend', instancia.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Suspender"
                        >
                          <Pause size={18} className="text-slate-600 dark:text-slate-300" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction('resume', instancia.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Reanudar"
                        >
                          <Play size={18} className="text-slate-600 dark:text-slate-300" />
                        </button>
                      )}
                      <button
                        onClick={() => handleAction('rotate', instancia.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Rotar contraseña"
                      >
                        <RotateCw size={18} className="text-slate-600 dark:text-slate-300" />
                      </button>
                      <button
                        onClick={() => handleAction('delete', instancia.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
                <h3 className="font-semibold text-text dark:text-white mb-1">{instancia.nombre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{instancia.motor}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  instancia.estado === 'RUNNING'
                    ? 'bg-success/10 text-success'
                    : instancia.estado === 'CREATING'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {instancia.estado}
              </span>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Creada: {instancia.fecha}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border dark:border-slate-700">
              <button
                onClick={() => navigate(`/app/instancias/${instancia.id}`)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
              >
                <Eye size={18} />
                <span>Ver detalles</span>
              </button>
              {instancia.estado === 'RUNNING' ? (
                <button
                  onClick={() => handleAction('suspend', instancia.id)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Suspender"
                >
                  <Pause size={18} className="text-slate-600 dark:text-slate-300" />
                </button>
              ) : (
                <button
                  onClick={() => handleAction('resume', instancia.id)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Reanudar"
                >
                  <Play size={18} className="text-slate-600 dark:text-slate-300" />
                </button>
              )}
              <button
                onClick={() => handleAction('rotate', instancia.id)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Rotar contraseña"
              >
                <RotateCw size={18} className="text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={() => handleAction('delete', instancia.id)}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Eliminar"
              >
                <Trash2 size={18} className="text-error" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Instancias

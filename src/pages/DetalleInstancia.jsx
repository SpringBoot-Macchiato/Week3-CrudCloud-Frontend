import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Eye, EyeOff, RotateCw, Download } from 'lucide-react'

const DetalleInstancia = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState('')

  const instancia = {
    motor: 'MySQL',
    nombre: 'prod-mysql-01',
    estado: 'RUNNING',
    fecha: '2024-11-10',
    credenciales: {
      host: 'db.crudzaso.com',
      puerto: '3306',
      base: 'prod_mysql_01',
      usuario: 'user_prod',
      password: 'Xk9mP2vL7qN3wR8t',
    },
  }

  const handleCopy = (value, field) => {
    navigator.clipboard.writeText(value)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000)
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
        <h1 className="text-2xl md:text-3xl font-semibold text-text dark:text-white mb-2">{instancia.nombre}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm md:text-base text-slate-500 dark:text-slate-400">{instancia.motor}</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              instancia.estado === 'RUNNING'
                ? 'bg-success/10 text-success'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {instancia.estado}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Credenciales */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-text dark:text-white mb-4">Credenciales de acceso</h2>
          <div className="space-y-4">
            {Object.entries(instancia.credenciales).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="block text-xs md:text-sm font-medium text-text dark:text-white capitalize">
                  {key === 'password' ? 'Contraseña' : key === 'base' ? 'Base de datos' : key}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type={key === 'password' && !showPassword ? 'password' : 'text'}
                    value={value}
                    readOnly
                    className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border border-border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-text dark:text-white font-mono text-xs md:text-sm"
                  />
                  {key === 'password' && (
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 md:p-2.5 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                    >
                      {showPassword ? <EyeOff size={18} className="text-slate-600 dark:text-slate-300" /> : <Eye size={18} className="text-slate-600 dark:text-slate-300" />}
                    </button>
                  )}
                  <button
                    onClick={() => handleCopy(value, key)}
                    className="p-2 md:p-2.5 rounded-lg border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                  >
                    <Copy size={18} className={`${copied === key ? 'text-success' : 'text-slate-600 dark:text-slate-300'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border dark:border-slate-700 space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border dark:border-slate-700 rounded-lg font-medium text-sm text-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <RotateCw size={18} />
              <span>Rotar contraseña</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border dark:border-slate-700 rounded-lg font-medium text-sm text-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
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
                <span className="text-sm text-text dark:text-white font-medium text-right">{instancia.fecha}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Motor</span>
                <span className="text-sm text-text dark:text-white font-medium text-right">{instancia.motor}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Estado</span>
                <span className="text-sm text-text dark:text-white font-medium text-right">{instancia.estado}</span>
              </div>
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

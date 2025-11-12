import { useState } from 'react'
import { Database } from 'lucide-react'
import ModalCrearInstancia from '../components/ModalCrearInstancia'

const Motores = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedMotor, setSelectedMotor] = useState(null)

  const motores = [
    { id: 1, name: 'MySQL', version: '8.0', status: 'Disponible', icon: '🐬' },
    { id: 2, name: 'PostgreSQL', version: '15.0', status: 'Disponible', icon: '🐘' },
    { id: 3, name: 'MongoDB', version: '7.0', status: 'Disponible', icon: '🍃' },
    { id: 4, name: 'Redis', version: '7.2', status: 'Disponible', icon: '⚡' },
    { id: 5, name: 'SQL Server', version: '2022', status: 'Próximamente', icon: '💼' },
    { id: 6, name: 'Cassandra', version: '4.1', status: 'Próximamente', icon: '🌌' },
  ]

  const handleCreateInstance = (motor) => {
    setSelectedMotor(motor)
    setShowModal(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-text dark:text-white mb-2">Motores disponibles</h1>
        <p className="text-slate-500 dark:text-slate-400">Selecciona un motor de base de datos para crear una instancia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {motores.map((motor) => (
          <div
            key={motor.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-6 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl">
                {motor.icon}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  motor.status === 'Disponible'
                    ? 'bg-success/10 text-success'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {motor.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-text dark:text-white mb-1">{motor.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Versión {motor.version}</p>

            <button
              onClick={() => handleCreateInstance(motor)}
              disabled={motor.status !== 'Disponible'}
              className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                motor.status === 'Disponible'
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Crear instancia
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <ModalCrearInstancia
          motor={selectedMotor}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default Motores

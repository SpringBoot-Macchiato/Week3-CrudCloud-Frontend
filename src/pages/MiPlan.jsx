import { Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const MiPlan = () => {
  const { user } = useAuth()

  const planes = [
    {
      name: 'Free',
      price: '$0',
      instancias: 2,
      features: [
        'Hasta 2 instancias',
        'Nombre de base de datos automático',
        'Soporte básico',
        'Acceso a todos los motores',
      ],
    },
    {
      name: 'Standard',
      price: '$29',
      instancias: 5,
      features: [
        'Hasta 5 instancias',
        'Nombre personalizado',
        'Soporte prioritario',
        'Acceso a todos los motores',
        'Rotación de contraseñas',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      price: '$79',
      instancias: 10,
      features: [
        'Hasta 10 instancias',
        'Nombre personalizado',
        'Soporte 24/7',
        'Acceso a todos los motores',
        'Rotación de contraseñas',
        'Backups automáticos',
        'Métricas avanzadas',
      ],
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text dark:text-white mb-2">Mi plan</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          Plan actual: <span className="font-medium text-text dark:text-white">{user?.plan}</span>
        </p>
      </div>

      {/* Grid de planes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {planes.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white dark:bg-slate-900 rounded-xl border-2 p-6 md:p-8 relative ${
              plan.popular ? 'border-primary' : 'border-border dark:border-slate-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-medium">
                  Más popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-text dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl md:text-4xl font-bold text-text dark:text-white">{plan.price}</span>
                <span className="text-sm md:text-base text-slate-500 dark:text-slate-400">/mes</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-center text-xs md:text-sm font-medium text-text dark:text-white mb-4">
                Hasta {plan.instancias} instancias
              </p>
            </div>

            <ul className="space-y-3 mb-6 md:mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-success" />
                  </div>
                  <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2.5 md:py-3 rounded-lg font-medium text-sm transition-colors ${
                user?.plan === plan.name.toUpperCase()
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'border-2 border-border dark:border-slate-700 text-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              disabled={user?.plan === plan.name.toUpperCase()}
            >
              {user?.plan === plan.name.toUpperCase() ? 'Plan actual' : 'Actualizar plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Historial de pagos */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-text dark:text-white mb-4">Historial de pagos</h2>
        <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">No hay transacciones registradas</div>
      </div>
    </div>
  )
}

export default MiPlan

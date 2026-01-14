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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-text mb-2">Mi plan</h1>
        <p className="text-slate-500">
          Plan actual: <span className="font-medium text-text">{user?.plan}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planes.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-xl border-2 p-8 relative ${
              plan.popular ? 'border-primary' : 'border-border'
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
              <h3 className="text-2xl font-semibold text-text mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-text">{plan.price}</span>
                <span className="text-slate-500">/mes</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-center text-sm font-medium text-text mb-4">
                Hasta {plan.instancias} instancias
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-success" />
                  </div>
                  <span className="text-sm text-slate-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                user?.plan === plan.name.toUpperCase()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'border-2 border-border text-text hover:bg-slate-50'
              }`}
              disabled={user?.plan === plan.name.toUpperCase()}
            >
              {user?.plan === plan.name.toUpperCase() ? 'Plan actual' : 'Actualizar plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Historial de pagos</h2>
        <div className="text-sm text-slate-500">No hay transacciones registradas</div>
      </div>
    </div>
  )
}

export default MiPlan

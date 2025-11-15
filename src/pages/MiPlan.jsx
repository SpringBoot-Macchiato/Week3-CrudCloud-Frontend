import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'

const MiPlan = () => {
  const { user } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState(null)

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

  const isCurrentPlan = (planName) => {
    return user?.plan === planName.toUpperCase()
  }

  const getButtonText = (planName) => {
    if (isCurrentPlan(planName)) {
      return 'Plan actual'
    }
    return `Cambiar a ${planName}`
  }

  const handlePlanChange = async (planName) => {
    if (isCurrentPlan(planName)) return

    setLoadingPlan(planName)

    try {
      // Si es plan Free, no requiere pago
      if (planName === 'Free') {
        // TODO: Llamar al backend para cambiar a plan Free
        alert('Cambiando a plan Free...')
        setLoadingPlan(null)
        return
      }

      // Para planes pagos, crear preferencia de Mercado Pago
      const response = await api.post('/payments/create-preference', {
        plan: planName.toUpperCase(),
        userId: user?.email || 'demo@email.com'
      })

      // Mercado Pago devuelve una URL de pago (init_point)
      if (response.init_point) {
        // Redirigir a Mercado Pago
        window.location.href = response.init_point
      } else {
        throw new Error('No se recibió URL de pago')
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error)
      alert('Hubo un error al procesar tu solicitud. Por favor intenta nuevamente.')
      setLoadingPlan(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-text dark:text-white mb-2">Mi plan</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Plan actual: <span className="font-medium text-text dark:text-white">{user?.plan}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planes.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white dark:bg-slate-900 rounded-xl border-2 p-8 relative ${
              isCurrentPlan(plan.name)
                ? 'border-success'
                : plan.popular
                ? 'border-primary'
                : 'border-border dark:border-slate-700'
            }`}
          >
            {isCurrentPlan(plan.name) && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-success text-white px-4 py-1 rounded-full text-xs font-medium">
                  Plan activo
                </span>
              </div>
            )}
            {plan.popular && !isCurrentPlan(plan.name) && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-medium">
                  Más popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-text dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-text dark:text-white">{plan.price}</span>
                <span className="text-slate-500 dark:text-slate-400">/mes</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-center text-sm font-medium text-text dark:text-white mb-4">
                Hasta {plan.instancias} instancias
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-success" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanChange(plan.name)}
              className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                isCurrentPlan(plan.name)
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'border-2 border-border dark:border-slate-700 text-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              disabled={isCurrentPlan(plan.name) || loadingPlan !== null}
            >
              {loadingPlan === plan.name ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                getButtonText(plan.name)
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-text dark:text-white mb-4">Historial de pagos</h2>
        <div className="text-sm text-slate-500 dark:text-slate-400">No hay transacciones registradas</div>
      </div>
    </div>
  )
}

export default MiPlan

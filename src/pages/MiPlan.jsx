import { useState, useEffect } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'

const MiPlan = () => {
  const { user } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [mp, setMp] = useState(null)

  // Inicializar Mercado Pago SDK
  useEffect(() => {
    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY
    if (window.MercadoPago && publicKey) {
      const mercadopago = new window.MercadoPago(publicKey, {
        locale: 'es-CO'
      })
      setMp(mercadopago)
    }
  }, [])

  const planes = [
    {
      name: 'Free',
      price: '$0',
      planId: null, // Free no tiene planId porque es gratuito
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
      price: '$1,000 COP',
      planId: 1, // Standard = planId 1
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
      price: '$2,000 COP',
      planId: 2, // Premium = planId 2
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

  const handlePlanChange = async (plan) => {
    if (isCurrentPlan(plan.name)) return

    setLoadingPlan(plan.name)

    try {
      // Si es plan Free, no requiere pago
      if (plan.name === 'Free' || !plan.planId) {
        alert('El plan Free no requiere pago. Funcionalidad de cambio a Free pendiente de implementar.')
        setLoadingPlan(null)
        return
      }

      // Verificar que el SDK de MercadoPago esté cargado
      if (!mp) {
        throw new Error('SDK de Mercado Pago no está cargado. Recarga la página.')
      }

      // Verificar si hay token de autenticación
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Debes iniciar sesión para cambiar de plan')
        setLoadingPlan(null)
        return
      }

      // Verificar si el backend está disponible
      const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || false

      if (DEMO_MODE) {
        // Modo demo: simular flujo de pago
        console.log('Modo demo activado - Simulando flujo de Mercado Pago')
        await new Promise(resolve => setTimeout(resolve, 1500))

        const random = Math.random()
        if (random < 0.8) {
          window.location.href = `/payment/success?payment_id=DEMO-${Date.now()}&status=approved&external_reference=${plan.name}`
        } else if (random < 0.9) {
          window.location.href = `/payment/pending?payment_id=DEMO-${Date.now()}&status=pending&external_reference=${plan.name}`
        } else {
          window.location.href = `/payment/failure?payment_id=DEMO-${Date.now()}&status=rejected&external_reference=${plan.name}`
        }
        return
      }

      // Modo producción: llamar al backend para crear la preferencia
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId: plan.planId })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (!data.preferenceId) {
        throw new Error('No se recibió preferenceId del backend')
      }

      // Abrir el checkout de Mercado Pago como modal
      mp.checkout({
        preference: {
          id: data.preferenceId
        },
        autoOpen: true
      })

      // Limpiar loading después de abrir el modal
      setLoadingPlan(null)

    } catch (error) {
      console.error('Error al procesar el pago:', error)

      let errorMessage = 'Hubo un error al procesar tu solicitud.'

      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.\n\nPara probar el flujo en modo demo, agrega VITE_DEMO_MODE=true en tu archivo .env'
      } else if (error.message.includes('SDK de Mercado Pago')) {
        errorMessage = error.message
      } else {
        errorMessage = `Error: ${error.message}`
      }

      alert(errorMessage)
      setLoadingPlan(null)
    }
  }

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
              onClick={() => handlePlanChange(plan)}
              className={`w-full py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors flex items-center justify-center gap-2 ${
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

      {/* Historial de pagos */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-text dark:text-white mb-4">Historial de pagos</h2>
        <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">No hay transacciones registradas</div>
      </div>
    </div>
  )
}

export default MiPlan

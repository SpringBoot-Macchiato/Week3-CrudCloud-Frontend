import { useState, useEffect } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../utils/api'
import {
  getPlans,
  getMyPayments,
  createPlanCheckout,
  getUserActivePlan,
  formatPrice,
  formatDate,
  getPaymentStatusText,
  getPaymentStatusClass
} from '../utils/apiServices'
import { showInfo, showError } from '../utils/alerts'

const MiPlan = () => {
  const { user } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [mp, setMp] = useState(null)
  const [planes, setPlanes] = useState([])
  const [payments, setPayments] = useState([])
  const [activePlan, setActivePlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  // Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Intentar cargar planes desde el backend
        const planesData = await getPlans()

        // Verificar si el backend ya devuelve el plan FREE
        const hasFreeplan = planesData.some(plan => plan.name.toUpperCase() === 'FREE')

        // Si el backend NO devuelve el plan FREE, agregarlo manualmente
        const allPlanes = hasFreeplan ? planesData : [
          {
            id: null,
            name: 'FREE',
            price: 0,
            maxInstances: 2,
            features: {
              customName: false,
              prioritySupport: false,
              passwordRotation: false,
              autoBackups: false,
              advancedMetrics: false
            }
          },
          ...planesData
        ]

        setPlanes(allPlanes)

        // Si el usuario está autenticado, cargar su plan activo y pagos
        if (user?.userId) {
          try {
            const [activePlanData, paymentsData] = await Promise.all([
              getUserActivePlan(user.userId),
              getMyPayments()
            ])
            setActivePlan(activePlanData)
            setPayments(paymentsData)
          } catch (err) {
            // Si no hay plan activo o pagos, no es un error crítico
            console.log('No active plan or payments found:', err)
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('No se pudo conectar con el backend. Usando datos de ejemplo.')

        // Fallback a planes hardcodeados si el backend falla
        setPlanes([
          {
            id: null,
            name: 'FREE',
            price: 0,
            maxInstances: 2,
            features: {
              customName: false,
              prioritySupport: false,
              passwordRotation: false,
              autoBackups: false,
              advancedMetrics: false
            }
          },
          {
            id: 1,
            name: 'STANDARD',
            price: 1000,
            maxInstances: 5,
            features: {
              customName: true,
              prioritySupport: true,
              passwordRotation: true,
              autoBackups: false,
              advancedMetrics: false
            }
          },
          {
            id: 2,
            name: 'PREMIUM',
            price: 2000,
            maxInstances: 10,
            features: {
              customName: true,
              prioritySupport: true,
              passwordRotation: true,
              autoBackups: true,
              advancedMetrics: true
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.userId])

  // Convertir features del backend a array de texto para la UI
  const getFeaturesArray = (plan) => {
    const baseFeatures = [
      `Hasta ${plan.maxInstances} instancias`,
      'Acceso a todos los motores',
    ]

    const features = plan.features || {}

    if (plan.name === 'FREE') {
      return [
        ...baseFeatures,
        'Nombre de base de datos automático',
        'Soporte básico',
      ]
    }

    const additionalFeatures = []
    if (features.customName) additionalFeatures.push('Nombre personalizado')
    if (features.prioritySupport) {
      additionalFeatures.push(plan.name === 'PREMIUM' ? 'Soporte 24/7' : 'Soporte prioritario')
    }
    if (features.passwordRotation) additionalFeatures.push('Rotación de contraseñas')
    if (features.autoBackups) additionalFeatures.push('Backups automáticos')
    if (features.advancedMetrics) additionalFeatures.push('Métricas avanzadas')

    return [...baseFeatures, ...additionalFeatures]
  }

  const isCurrentPlan = (planName) => {
    // Usar activePlan del backend si está disponible, sino usar user.plan
    const currentPlanName = activePlan?.planName || user?.plan || 'FREE'
    return currentPlanName === planName.toUpperCase()
  }

  const getButtonText = (plan) => {
    if (isCurrentPlan(plan.name)) {
      return 'Plan actual'
    }
    // Capitalizar primera letra para mejor presentación
    const displayName = plan.name.charAt(0) + plan.name.slice(1).toLowerCase()
    return `Cambiar a ${displayName}`
  }

  const handlePlanChange = async (plan) => {
    if (isCurrentPlan(plan.name)) return

    setLoadingPlan(plan.name)

    try {
      // Si es plan Free, no requiere pago
      if (plan.name === 'FREE' || !plan.id) {
        await showInfo('El plan Free no requiere pago. Funcionalidad de cambio a Free pendiente de implementar.')
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
        await showError('Debes iniciar sesión para cambiar de plan', 'Sesión requerida')
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

      // Modo producción: usar apiServices para crear la preferencia
      const { preferenceId } = await createPlanCheckout(plan.id)

      if (!preferenceId) {
        throw new Error('No se recibió preferenceId del backend')
      }

      // Abrir el checkout de Mercado Pago como modal
      mp.checkout({
        preference: {
          id: preferenceId
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

      await showError(errorMessage)
      setLoadingPlan(null)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Cargando planes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-text dark:text-white mb-2">Mi plan</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          Plan actual: <span className="font-medium text-text dark:text-white">
            {activePlan?.planName || user?.plan || 'FREE'}
          </span>
        </p>
        {error && (
          <p className="text-xs md:text-sm text-yellow-600 dark:text-yellow-500 mt-2">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Grid de planes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {planes.map((plan) => {
          const isPopular = plan.name === 'STANDARD'
          const displayName = plan.name.charAt(0) + plan.name.slice(1).toLowerCase()
          const featuresArray = getFeaturesArray(plan)

          return (
            <div
              key={plan.id || plan.name}
              className={`bg-white dark:bg-slate-900 rounded-xl border-2 p-6 md:p-8 relative ${
                isCurrentPlan(plan.name)
                  ? 'border-success'
                  : isPopular
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
              {isPopular && !isCurrentPlan(plan.name) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-medium">
                    Más popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-semibold text-text dark:text-white mb-2">
                  {displayName}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl md:text-4xl font-bold text-text dark:text-white">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-sm md:text-base text-slate-500 dark:text-slate-400">/mes</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-center text-xs md:text-sm font-medium text-text dark:text-white mb-4">
                  Hasta {plan.maxInstances} instancias
                </p>
              </div>

              <ul className="space-y-3 mb-6 md:mb-8">
                {featuresArray.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
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
                    : isPopular
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
                  getButtonText(plan)
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Historial de pagos */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-text dark:text-white mb-4">
          Historial de pagos
        </h2>
        {payments.length === 0 ? (
          <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            No hay transacciones registradas
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border border-border dark:border-slate-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text dark:text-white">
                      Plan {payment.externalReference || 'N/A'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusClass(payment.status)}`}>
                      {getPaymentStatusText(payment.status)}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(payment.createdAt)} · ID: {payment.paymentId || payment.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text dark:text-white">
                    ${payment.amount.toLocaleString('es-CO')} {payment.currency || 'COP'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MiPlan

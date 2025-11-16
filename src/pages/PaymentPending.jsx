import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Clock, ArrowRight, RefreshCw } from 'lucide-react'

const PaymentPending = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const externalReference = searchParams.get('external_reference')

  useEffect(() => {
    // Aquí se puede llamar al backend para registrar el pago pendiente
    console.log('Payment pending:', { paymentId, status, externalReference })
  }, [paymentId, status, externalReference])

  const handleRefresh = () => {
    // Aquí se puede verificar el estado del pago
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-700 p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center">
            <Clock size={48} className="text-yellow-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text dark:text-white mb-3">
          Pago pendiente
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Tu pago está siendo procesado. Esto puede tomar unos minutos. Te notificaremos por correo cuando se complete la transacción.
        </p>

        {paymentId && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              ID de pago
            </p>
            <p className="text-sm font-mono text-text dark:text-white">
              {paymentId}
            </p>
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Tu plan no se ha actualizado aún. Espera a que se confirme el pago para acceder a las nuevas funcionalidades.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Verificar estado del pago
          </button>

          <button
            onClick={() => navigate('/app/plan')}
            className="w-full border-2 border-border dark:border-slate-700 text-text dark:text-white py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            Ver mi plan
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate('/app/dashboard')}
            className="w-full text-slate-600 dark:text-slate-400 py-3 rounded-lg font-medium hover:text-text dark:hover:text-white transition-colors"
          >
            Ir al dashboard
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
          Si el pago no se confirma en 24 horas, será cancelado automáticamente
        </p>
      </div>
    </div>
  )
}

export default PaymentPending

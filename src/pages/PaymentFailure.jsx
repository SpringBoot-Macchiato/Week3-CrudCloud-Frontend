import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { XCircle, ArrowRight, RotateCcw } from 'lucide-react'

const PaymentFailure = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const externalReference = searchParams.get('external_reference')

  useEffect(() => {
    // Aquí se puede llamar al backend para registrar el pago fallido
    console.log('Payment failed:', { paymentId, status, externalReference })
  }, [paymentId, status, externalReference])

  const handleRetry = () => {
    navigate('/app/plan')
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-700 p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center">
            <XCircle size={48} className="text-error" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text dark:text-white mb-3">
          Pago rechazado
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          No pudimos procesar tu pago. Por favor, verifica tus datos e intenta nuevamente.
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

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Posibles razones del rechazo:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-300 text-left space-y-1">
            <li>• Fondos insuficientes</li>
            <li>• Datos de tarjeta incorrectos</li>
            <li>• Límite de compra excedido</li>
            <li>• Tarjeta vencida o bloqueada</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Intentar nuevamente
          </button>

          <button
            onClick={() => navigate('/app/dashboard')}
            className="w-full border-2 border-border dark:border-slate-700 text-text dark:text-white py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            Ir al dashboard
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
          Si el problema persiste, contacta a tu entidad bancaria o prueba con otro método de pago
        </p>
      </div>
    </div>
  )
}

export default PaymentFailure

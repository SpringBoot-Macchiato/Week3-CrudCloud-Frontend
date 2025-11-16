import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const externalReference = searchParams.get('external_reference')

  useEffect(() => {
    // Aquí se puede llamar al backend para confirmar el pago
    // y actualizar el plan del usuario
    console.log('Payment successful:', { paymentId, status, externalReference })
  }, [paymentId, status, externalReference])

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-700 p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-success" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text dark:text-white mb-3">
          ¡Pago exitoso!
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Tu pago ha sido procesado correctamente. Tu plan ha sido actualizado y ya puedes disfrutar de todas las funcionalidades.
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

        <div className="space-y-3">
          <button
            onClick={() => navigate('/app/plan')}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Ver mi plan
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate('/app/dashboard')}
            className="w-full border-2 border-border dark:border-slate-700 text-text dark:text-white py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Ir al dashboard
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
          Recibirás un correo de confirmación con los detalles de tu suscripción
        </p>
      </div>
    </div>
  )
}

export default PaymentSuccess

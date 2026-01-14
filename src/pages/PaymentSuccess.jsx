import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight, Copy } from 'lucide-react'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [copied, setCopied] = useState(false)

  // Leer parámetros que envía Mercado Pago
  const paymentData = {
    status: searchParams.get('status') || searchParams.get('collection_status'),
    payment_id: searchParams.get('payment_id') || searchParams.get('collection_id'),
    preference_id: searchParams.get('preference_id'),
    external_reference: searchParams.get('external_reference')
  }

  useEffect(() => {
    console.log('Payment Success Data:', paymentData)
  }, [])

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-green-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border-2 border-green-500 p-6 md:p-8">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-success" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text dark:text-white mb-3 text-center">
          ✅ Pago aprobado
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">
          Tu transacción fue procesada correctamente
        </p>

        {/* Detalles del pago en formato JSON */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6 border border-dashed border-slate-300 dark:border-slate-700">
          <pre className="text-left text-xs md:text-sm font-mono text-text dark:text-white overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(paymentData, null, 2)}
          </pre>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-success hover:bg-success/90 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            Volver al inicio
          </button>

          <button
            onClick={() => navigate('/app/plan')}
            className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Ver mi plan
            <ArrowRight size={18} />
          </button>

          <button
            onClick={copyUrl}
            className="sm:flex-initial border-2 border-border dark:border-slate-700 text-text dark:text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            title="Copiar URL con parámetros"
          >
            <Copy size={16} />
            {copied ? '¡Copiado!' : 'Copiar URL'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess

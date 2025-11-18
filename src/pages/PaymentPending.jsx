import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Clock, ArrowRight, RefreshCw, Copy } from 'lucide-react'

const PaymentPending = () => {
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
    console.log('Payment Pending Data:', paymentData)
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-yellow-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg border-2 border-yellow-500 p-6 md:p-8">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center">
            <Clock size={48} className="text-yellow-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text dark:text-white mb-3 text-center">
          ⏳ Pago pendiente
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-6 text-center">
          Tu pago está siendo procesado
        </p>

        {/* Detalles del pago en formato JSON */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6 border border-dashed border-slate-300 dark:border-slate-700">
          <pre className="text-left text-xs md:text-sm font-mono text-text dark:text-white overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(paymentData, null, 2)}
          </pre>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            Tu plan no se ha actualizado aún. Espera a que se confirme el pago.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRefresh}
            className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Verificar estado
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex-1 border-2 border-border dark:border-slate-700 text-text dark:text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Volver al inicio
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

export default PaymentPending

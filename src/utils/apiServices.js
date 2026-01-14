import { api } from './api'

/**
 * API Services for Backend Integration
 *
 * Este archivo contiene todas las funciones para interactuar con los endpoints del backend.
 * Utiliza el cliente API genérico (api.js) para hacer las peticiones HTTP.
 */

// ==================== PLANS ====================

/**
 * Obtiene todos los planes disponibles
 * @returns {Promise<Array>} Lista de planes
 * @example
 * const planes = await getPlans()
 * // [{ id: 1, name: "STANDARD", price: 1000, maxInstances: 5, ... }]
 */
export const getPlans = async () => {
  try {
    const response = await api.get('/plans')
    return response
  } catch (error) {
    console.error('Error fetching plans:', error)
    throw error
  }
}

/**
 * Obtiene un plan específico por ID
 * @param {number} planId - ID del plan
 * @returns {Promise<Object>} Datos del plan
 */
export const getPlanById = async (planId) => {
  try {
    const response = await api.get(`/plans/${planId}`)
    return response
  } catch (error) {
    console.error(`Error fetching plan ${planId}:`, error)
    throw error
  }
}

// ==================== PAYMENTS ====================

/**
 * Obtiene todos los pagos del usuario autenticado
 * @returns {Promise<Array>} Lista de pagos del usuario
 * @example
 * const pagos = await getMyPayments()
 * // [{ id: 1, amount: 1000, status: "approved", createdAt: "2025-01-15", ... }]
 */
export const getMyPayments = async () => {
  try {
    const response = await api.get('/payments/my')
    return response
  } catch (error) {
    console.error('Error fetching my payments:', error)
    throw error
  }
}

/**
 * Crea una preferencia de pago en MercadoPago para un plan
 * @param {number} planId - ID del plan a adquirir
 * @returns {Promise<Object>} Objeto con preferenceId de MercadoPago
 * @example
 * const { preferenceId } = await createPlanCheckout(1)
 * // { preferenceId: "123456-abc-def-..." }
 */
export const createPlanCheckout = async (planId) => {
  try {
    const response = await api.post('/payments/create/plan', { planId })
    return response
  } catch (error) {
    console.error('Error creating plan checkout:', error)
    throw error
  }
}

// ==================== USER PLANS ====================

/**
 * Obtiene el plan activo del usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} Datos del plan activo del usuario
 * @example
 * const activePlan = await getUserActivePlan(123)
 * // {
 * //   id: 5,
 * //   userId: 123,
 * //   planId: 2,
 * //   planName: "PREMIUM",
 * //   startDate: "2025-01-01",
 * //   endDate: "2025-02-01",
 * //   isActive: true,
 * //   maxInstances: 10
 * // }
 */
export const getUserActivePlan = async (userId) => {
  try {
    const response = await api.get(`/users-plans/user/${userId}/active`)
    return response
  } catch (error) {
    console.error(`Error fetching active plan for user ${userId}:`, error)
    throw error
  }
}

/**
 * Obtiene todos los planes históricos del usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Lista de planes históricos
 */
export const getUserPlansHistory = async (userId) => {
  try {
    const response = await api.get(`/users-plans/user/${userId}`)
    return response
  } catch (error) {
    console.error(`Error fetching plans history for user ${userId}:`, error)
    throw error
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Formatea el precio para mostrar en la UI
 * @param {number} price - Precio en COP
 * @returns {string} Precio formateado
 * @example
 * formatPrice(1000) // "$1,000 COP"
 */
export const formatPrice = (price) => {
  if (price === 0) return '$0'
  return `$${price.toLocaleString('es-CO')} COP`
}

/**
 * Formatea una fecha ISO a formato legible
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} Fecha formateada
 * @example
 * formatDate("2025-01-15T10:30:00") // "15/01/2025"
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return 'N/A'
  const date = new Date(isoDate)
  return date.toLocaleDateString('es-CO')
}

/**
 * Obtiene el texto del estado de pago traducido
 * @param {string} status - Estado del pago (approved, pending, rejected, etc.)
 * @returns {string} Estado traducido
 */
export const getPaymentStatusText = (status) => {
  const statusMap = {
    'approved': 'Aprobado',
    'pending': 'Pendiente',
    'rejected': 'Rechazado',
    'cancelled': 'Cancelado',
    'in_process': 'En proceso',
    'refunded': 'Reembolsado'
  }
  return statusMap[status] || status
}

/**
 * Obtiene la clase CSS para el estado de pago
 * @param {string} status - Estado del pago
 * @returns {string} Clases CSS para el badge
 */
export const getPaymentStatusClass = (status) => {
  const classMap = {
    'approved': 'bg-success/10 text-success',
    'pending': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500',
    'rejected': 'bg-error/10 text-error',
    'cancelled': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    'in_process': 'bg-blue-500/10 text-blue-600',
    'refunded': 'bg-purple-500/10 text-purple-600'
  }
  return classMap[status] || 'bg-slate-100 text-slate-600'
}

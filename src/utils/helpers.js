/**
 * Mapea engineId a nombre de motor de base de datos
 * @param {number} engineId - ID del motor
 * @returns {string} Nombre del motor
 */
export const getEngineName = (engineId) => {
  const engines = {
    1: 'MySQL',
    2: 'PostgreSQL',
    3: 'SQL Server',
    4: 'MongoDB',
    5: 'Redis',
    6: 'MariaDB'
  }
  return engines[engineId] || 'Unknown'
}

/**
 * Formatea una fecha a formato local español
 * @param {string} dateString - Fecha en formato ISO
 * @param {boolean} includeTime - Incluir hora
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return '-'

  const date = new Date(dateString)
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return date.toLocaleDateString('es-ES', options)
}

/**
 * Formatea una fecha a formato largo español
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export const formatDateLong = (dateString) => {
  if (!dateString) return '-'

  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True si se copió exitosamente
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error)
    return false
  }
}

/**
 * Obtiene el color de estado para una instancia
 * @param {string} state - Estado de la instancia
 * @returns {string} Clases de Tailwind CSS
 */
export const getStateColor = (state) => {
  const colors = {
    RUNNING: 'bg-success/10 text-success',
    CREATING: 'bg-primary/10 text-primary',
    SUSPENDED: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    FAILED: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    STOPPED: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
  }
  return colors[state] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
}

/**
 * Valida si un email es válido
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Formatea un precio en COP
 * @param {number} amount - Monto
 * @returns {string} Precio formateado
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)
}

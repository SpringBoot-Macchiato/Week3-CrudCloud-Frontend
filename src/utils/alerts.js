import Swal from 'sweetalert2'

// Configuración base de SweetAlert2 con el tema de la aplicación
const baseConfig = {
  customClass: {
    popup: 'rounded-xl',
    confirmButton: 'px-6 py-2.5 rounded-lg font-medium transition-colors',
    cancelButton: 'px-6 py-2.5 rounded-lg font-medium transition-colors',
  },
  buttonsStyling: false,
}

// Mostrar alerta de éxito
export const showSuccess = (message, title = 'Éxito') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#22C55E',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-success hover:bg-success/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors',
    },
  })
}

// Mostrar alerta de error
export const showError = (message, title = 'Error') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#EF4444',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-error hover:bg-error/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors',
    },
  })
}

// Mostrar alerta de información
export const showInfo = (message, title = 'Información') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'info',
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#3B82F6',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors',
    },
  })
}

// Mostrar alerta de advertencia
export const showWarning = (message, title = 'Advertencia') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#F59E0B',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors',
    },
  })
}

// Mostrar confirmación con botones Sí/No
export const showConfirm = (message, title = '¿Estás seguro?', confirmText = 'Sí', cancelText = 'No') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'question',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#3B82F6',
    cancelButtonColor: '#94A3B8',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors',
      cancelButton: 'bg-slate-400 hover:bg-slate-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors ml-2',
    },
  })
}

// Mostrar confirmación de eliminación (más específica)
export const showDeleteConfirm = (message = '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title: '¿Eliminar?',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#94A3B8',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-error hover:bg-error/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors',
      cancelButton: 'bg-slate-400 hover:bg-slate-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors ml-2',
    },
  })
}

// Mostrar alerta con texto copiable (para contraseñas, tokens, etc)
export const showCopyableText = (text, title = 'Información', message = 'Guarda esta información en un lugar seguro:') => {
  return Swal.fire({
    ...baseConfig,
    icon: 'info',
    title,
    html: `
      <p class="text-slate-600 dark:text-slate-300 mb-4">${message}</p>
      <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
        <code class="text-sm font-mono break-all">${text}</code>
      </div>
    `,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#3B82F6',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors',
    },
  })
}

// Mostrar loading
export const showLoading = (message = 'Cargando...') => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

// Cerrar loading
export const closeLoading = () => {
  Swal.close()
}

// Toast notifications (pequeñas notificaciones en la esquina)
export const showToast = (message, type = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
  })

  return Toast.fire({
    icon: type,
    title: message,
  })
}

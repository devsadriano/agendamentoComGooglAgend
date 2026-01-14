import { useToast } from 'vue-toastification'

export const useNotification = () => {
  // Se estivermos no server-side, retorna funções vazias
  if (import.meta.server) {
    return {
      showSuccess: () => {},
      showError: () => {},
      showWarning: () => {},
      showInfo: () => {},
      showDefault: () => {},
      clear: () => {},
      toast: null
    }
  }

  const toast = useToast()

  const showSuccess = (message: string, options?: any) => {
    toast.success(message, {
      timeout: 4000,
      ...options
    })
  }

  const showError = (message: string, options?: any) => {
    toast.error(message, {
      timeout: 5000,
      ...options
    })
  }

  const showWarning = (message: string, options?: any) => {
    toast.warning(message, {
      timeout: 4000,
      ...options
    })
  }

  const showInfo = (message: string, options?: any) => {
    toast.info(message, {
      timeout: 4000,
      ...options
    })
  }

  const showDefault = (message: string, options?: any) => {
    toast(message, {
      timeout: 4000,
      ...options
    })
  }

  const clear = () => {
    toast.clear()
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showDefault,
    clear,
    toast
  }
}
<template>
  <!-- Overlay -->
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="handleOverlayClick"
  >
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
    
    <!-- Modal container -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative w-full max-w-sm transform rounded-lg bg-white shadow-xl transition-all"
        @click.stop
      >
        <!-- Content -->
        <div class="p-6">
          <div class="flex items-center space-x-3">
            <!-- Ícone de aviso -->
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            
            <!-- Mensagem -->
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">
                {{ titulo }}
              </p>
              <p class="text-sm text-gray-600 mt-1">
                {{ mensagem }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-6 pb-6">
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="close"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              :disabled="loading"
              @click="confirm"
            >
              <span v-if="loading" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cancelando...
              </span>
              <span v-else>Sim, Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  titulo?: string
  mensagem?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  titulo: 'Confirmar ação',
  mensagem: 'Esta ação não pode ser desfeita.',
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  close: []
}>()

// Métodos
const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

const confirm = () => {
  emit('confirm')
}

const close = () => {
  emit('close')
  emit('update:modelValue', false)
}
</script>
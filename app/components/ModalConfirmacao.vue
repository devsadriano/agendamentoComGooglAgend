<template>
  <BaseModal
    v-model="modalVisible"
    :title="title"
    :confirm-text="confirmText"
    :cancel-text="type === 'success' ? undefined : cancelText"
    :confirm-variant="confirmVariant"
    :loading="loading"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <div class="flex items-start space-x-4">
      <!-- Ícone -->
      <div class="flex-shrink-0">
        <component :is="iconComponent" :class="iconClass" />
      </div>
      
      <!-- Mensagem -->
      <div class="flex-1">
        <p class="text-sm text-gray-700 whitespace-pre-line">
          {{ message }}
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: boolean
  message?: string
  title?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'error' | 'success' | 'primary'
  type?: 'error' | 'success' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Tem certeza que deseja deletar este item?',
  title: 'Confirmar Exclusão',
  confirmText: 'Deletar',
  cancelText: 'Cancelar',
  confirmVariant: 'error',
  type: 'error'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  close: []
}>()

// Estados
const loading = ref(false)

// Computed
const modalVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon
    case 'info':
      return InformationCircleIcon
    case 'error':
    default:
      return ExclamationTriangleIcon
  }
})

const iconClass = computed(() => {
  const baseClass = 'h-8 w-8'
  switch (props.type) {
    case 'success':
      return `${baseClass} text-green-500`
    case 'info':
      return `${baseClass} text-blue-500`
    case 'error':
    default:
      return `${baseClass} text-red-500`
  }
})

// Métodos
const handleConfirm = () => {
  emit('confirm')
}

const handleClose = () => {
  emit('close')
}

// Setter para loading (para uso externo)
const setLoading = (value: boolean) => {
  loading.value = value
}

// Expor métodos para componente pai
defineExpose({
  setLoading
})
</script>
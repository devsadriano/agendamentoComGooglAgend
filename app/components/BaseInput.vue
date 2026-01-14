<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-text-primary mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-error ml-1">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <!-- Icon esquerda -->
      <div
        v-if="$slots['icon-left']"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <slot name="icon-left" />
      </div>

      <!-- Input field -->
      <input
        :id="inputId"
        ref="inputRef"
        :type="actualInputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :minlength="minlength"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <!-- Password toggle icon -->
      <div
        v-if="type === 'password'"
        class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        @click="togglePasswordVisibility"
      >
        <EyeIcon v-if="showPassword" class="w-5 h-5 text-text-tertiary hover:text-text-secondary transition-colors" />
        <EyeSlashIcon v-else class="w-5 h-5 text-text-tertiary hover:text-text-secondary transition-colors" />
      </div>

      <!-- Icon direita (apenas se não for password) -->
      <div
        v-else-if="$slots['icon-right']"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        :class="{ 'pointer-events-none': !clickableRightIcon }"
        @click="handleRightIconClick"
      >
        <slot name="icon-right" />
      </div>
    </div>

    <!-- Helper text / Error message -->
    <div v-if="helperText || errorMessage" class="mt-1">
      <p
        v-if="errorMessage"
        class="text-sm text-error"
      >
        {{ errorMessage }}
      </p>
      <p
        v-else-if="helperText"
        class="text-sm text-text-tertiary"
      >
        {{ helperText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

interface Props {
  id?: string
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local'
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'borderless'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  maxlength?: number
  minlength?: number
  min?: string | number
  max?: string | number
  step?: string | number
  clickableRightIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  required: false,
  clickableRightIcon: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  'icon-right-click': [event: MouseEvent]
}>()

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)

// Estado para controlar visibilidade da senha
const showPassword = ref(false)

// ID único para o input - usando um contador para evitar problemas de hidratação
let inputCounter = 0
const inputId = computed(() => {
  if (props.id) return props.id
  
  // Só gera ID aleatório no cliente para evitar problemas de hidratação
  if (import.meta.client) {
    return `input-${Math.random().toString(36).substr(2, 9)}`
  }
  
  // No servidor, usa um contador sequencial
  return `input-${++inputCounter}`
})

// Tipo de input computado (para toggle de senha)
const actualInputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const handleRightIconClick = (event: MouseEvent) => {
  if (props.clickableRightIcon) {
    emit('icon-right-click', event)
  }
}

// Função para alternar visibilidade da senha
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Método público para focar o input
const focus = () => {
  inputRef.value?.focus()
}

// Método público para selecionar o texto
const select = () => {
  inputRef.value?.select()
}

// Exposer métodos públicos
defineExpose({
  focus,
  select,
})

const inputClasses = computed(() => {
  const baseClasses = [
    'block',
    'w-full',
    'border',
    'rounded-lg',
    'transition-all',
    'duration-250',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-1',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:bg-neutral-50',
  ]

  // Tamanhos
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-base'],
    lg: ['px-4', 'py-3', 'text-lg'],
  }

  // Ajustes para ícones
  if (slots['icon-left']) {
    sizeClasses.sm.push('pl-9')
    sizeClasses.md.push('pl-10')
    sizeClasses.lg.push('pl-12')
  }

  // Padding direito para ícone direito ou password toggle
  if (slots['icon-right'] || props.type === 'password') {
    sizeClasses.sm.push('pr-9')
    sizeClasses.md.push('pr-10')
    sizeClasses.lg.push('pr-12')
  }

  // Estados e variantes
  let stateClasses: string[] = []

  if (props.errorMessage) {
    stateClasses = [
      'border-error',
      'focus:border-error',
      'focus:ring-red-500',
      'bg-red-50',
    ]
  } else if (isFocused.value) {
    stateClasses = [
      'border-blue-500',
      'focus:border-blue-600',
      'focus:ring-blue-500',
      'bg-white',
    ]
  } else {
    // Variantes normais
    const variantClasses = {
      default: [
        'border-border-default',
        'focus:border-blue-500',
        'focus:ring-blue-500',
        'bg-white',
        'hover:border-border-dark',
      ],
      filled: [
        'border-transparent',
        'focus:border-blue-500',
        'focus:ring-blue-500',
        'bg-neutral-100',
        'hover:bg-neutral-200',
      ],
      borderless: [
        'border-transparent',
        'focus:border-transparent',
        'focus:ring-blue-500',
        'bg-transparent',
        'hover:bg-neutral-50',
      ],
    }
    stateClasses = variantClasses[props.variant]
  }

  // Placeholder styles
  const placeholderClasses = [
    'placeholder:text-text-tertiary',
  ]

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...stateClasses,
    ...placeholderClasses,
  ]
})

// Access to slots
const slots = useSlots()
</script>
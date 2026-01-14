<template>
  <button
    :id="id"
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Icon slot (antes do texto) -->
    <span v-if="$slots['icon-left']" class="mr-2">
      <slot name="icon-left" />
    </span>

    <!-- Conteúdo do botão -->
    <span v-if="$slots.default || text">
      <slot>{{ text }}</slot>
    </span>

    <!-- Icon slot (depois do texto) -->
    <span v-if="$slots['icon-right']" class="ml-2">
      <slot name="icon-right" />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  text?: string
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-250',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ]

  // Full width
  if (props.fullWidth) {
    baseClasses.push('w-full')
  }

  // Tamanhos
  const sizeClasses = {
    xs: ['px-2', 'py-1', 'text-xs'],
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-base'],
    lg: ['px-6', 'py-3', 'text-lg'],
    xl: ['px-8', 'py-4', 'text-xl'],
  }

  // Variantes
  const variantClasses = {
    primary: [
      'bg-blue-500',
      'text-white',
      'border-transparent',
      'hover:bg-blue-600',
      'focus:ring-blue-500',
      'active:bg-blue-700',
      'shadow-soft',
      'hover:shadow-medium',
    ],
    secondary: [
      'bg-neutral-100',
      'text-neutral-700',
      'border-neutral-200',
      'hover:bg-neutral-200',
      'focus:ring-neutral-500',
      'active:bg-neutral-300',
      'shadow-soft',
    ],
    success: [
      'bg-success',
      'text-white',
      'border-transparent',
      'hover:bg-green-600',
      'focus:ring-green-500',
      'active:bg-green-700',
      'shadow-soft',
    ],
    warning: [
      'bg-warning',
      'text-white',
      'border-transparent',
      'hover:bg-amber-600',
      'focus:ring-amber-500',
      'active:bg-amber-700',
      'shadow-soft',
    ],
    error: [
      'bg-error',
      'text-white',
      'border-transparent',
      'hover:bg-red-600',
      'focus:ring-red-500',
      'active:bg-red-700',
      'shadow-soft',
    ],
    ghost: [
      'bg-transparent',
      'text-neutral-700',
      'border-transparent',
      'hover:bg-neutral-100',
      'focus:ring-neutral-500',
      'active:bg-neutral-200',
    ],
    outline: [
      'bg-transparent',
      'text-blue-600',
      'border',
      'border-blue-300',
      'hover:bg-blue-50',
      'focus:ring-blue-500',
      'active:bg-blue-100',
    ],
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
  ]
})
</script>
<template>
  <div class="w-full max-w-md">
    <!-- Header do formulário -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-text-primary mb-2">
        Bem-vindo de volta
      </h2>
      <p class="text-text-secondary">
        Faça login para acessar sua conta
      </p>
    </div>

    <!-- Formulário -->
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Campo E-mail -->
      <BaseInput
        id="login-email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        v-model="email"
        required
      >
        <template #icon-left>
          <EnvelopeIcon class="w-5 h-5 text-text-tertiary" />
        </template>
      </BaseInput>

      <!-- Campo Senha -->
      <BaseInput
        id="login-password"
        label="Senha"
        type="password"
        placeholder="••••••••"
        v-model="password"
        required
      >
        <template #icon-left>
          <LockClosedIcon class="w-5 h-5 text-text-tertiary" />
        </template>
      </BaseInput>

      <!-- Link Esqueci a senha -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="login-remember-me"
            name="login-remember-me"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-border-default rounded"
          />
          <label for="login-remember-me" class="ml-2 block text-sm text-text-secondary">
            Lembrar de mim
          </label>
        </div>
        
        <div class="text-sm">
          <NuxtLink
            to="/esqueci-senha"
            class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Esqueci minha senha
          </NuxtLink>
        </div>
      </div>

      <!-- Botão de Login -->
      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        full-width
        :text="isLoading ? 'Entrando...' : 'Entrar'"
        :disabled="isLoading || !isFormValid"
      >
        <template #icon-left>
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
        </template>
      </BaseButton>

      <!-- Divisor -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-border-light"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-text-tertiary">ou</span>
        </div>
      </div>

      <!-- Botão de registro -->
      <div class="text-center">
        <p class="text-sm text-text-secondary">
          Não tem uma conta?
          <a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Criar conta
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { EnvelopeIcon, LockClosedIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import type { LoginCredentials } from '../../shared/types'

// Props do componente
interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Composable de autenticação (import explícito conforme Nuxt 4 guidelines)
const { login, isLoading } = useAuth()

// Dados do formulário
const email = ref('')
const password = ref('')

// Validação do formulário
const isFormValid = computed(() => {
  return email.value.trim() !== '' && 
         password.value.trim() !== '' && 
         email.value.includes('@')
})

// Emits para comunicação com o componente pai
const emit = defineEmits<{
  submit: [LoginCredentials]
}>()

// Função para enviar formulário
const handleSubmit = async () => {
  if (!isFormValid.value) {
    return
  }

  const credentials: LoginCredentials = {
    email: email.value.trim(),
    password: password.value
  }

  const result = await login(credentials)

  // Emite o evento para o componente pai se necessário
  emit('submit', credentials)

  // Limpa os campos apenas se houve sucesso
  if (result.success) {
    email.value = ''
    password.value = ''
  }
}
</script>
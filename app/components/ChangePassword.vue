<template>
  <div class="bg-white p-6 rounded-lg border border-gray-200">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Alterar Senha</h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Nova Senha -->
      <div>
        <label for="nova-senha" class="block text-sm font-medium text-gray-700 mb-1">
          Nova Senha *
        </label>
        <BaseInput
          id="nova-senha"
          v-model="form.novaSenha"
          type="password"
          placeholder="Digite sua nova senha"
          :disabled="loading"
          :error="errors.novaSenha"
          required
        />
      </div>

      <!-- Confirmar Nova Senha -->
      <div>
        <label for="confirmar-senha" class="block text-sm font-medium text-gray-700 mb-1">
          Confirmar Nova Senha *
        </label>
        <BaseInput
          id="confirmar-senha"
          v-model="form.confirmarSenha"
          type="password"
          placeholder="Confirme sua nova senha"
          :disabled="loading"
          :error="errors.confirmarSenha"
          required
        />
      </div>

      <!-- Requisitos da senha -->
      <div class="text-sm text-gray-600">
        <p class="font-medium mb-2">Requisitos da senha:</p>
        <ul class="space-y-1">
          <li :class="validations.minLength ? 'text-green-600' : 'text-gray-500'">
            ✓ Pelo menos 8 caracteres
          </li>
          <li :class="validations.hasNumber ? 'text-green-600' : 'text-gray-500'">
            ✓ Pelo menos um número
          </li>
          <li :class="validations.hasLetter ? 'text-green-600' : 'text-gray-500'">
            ✓ Pelo menos uma letra
          </li>
          <li :class="validations.hasSpecial ? 'text-green-600' : 'text-gray-500'">
            ✓ Pelo menos um caractere especial (!@#$%*&*)
          </li>
        </ul>
      </div>

      <!-- Botões -->
      <div class="flex justify-end space-x-3 pt-4">
        <BaseButton
          variant="secondary"
          size="md"
          @click="limparFormulario"
          :disabled="loading"
        >
          Limpar
        </BaseButton>
        
        <BaseButton
          variant="primary"
          size="md"
          type="submit"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? 'Alterando...' : 'Alterar Senha' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Composables
const { showSuccess, showError } = useNotification()
const { updatePassword, isLoading: authLoading } = useAuth()

// Estado do formulário
const form = ref({
  novaSenha: '',
  confirmarSenha: ''
})

// Estado de loading (usa o loading do composable useAuth)
const loading = computed(() => authLoading.value)

// Erros do formulário
const errors = ref({
  novaSenha: '',
  confirmarSenha: ''
})

// Validações da senha
const validations = computed(() => ({
  minLength: form.value.novaSenha.length >= 8,
  hasNumber: /\d/.test(form.value.novaSenha),
  hasLetter: /[a-zA-Z]/.test(form.value.novaSenha),
  hasSpecial: /[!@#$%*&*]/.test(form.value.novaSenha)
}))

// Verificar se o formulário é válido
const isFormValid = computed(() => {
  return (
    form.value.novaSenha &&
    form.value.confirmarSenha &&
    Object.values(validations.value).every(Boolean) &&
    form.value.novaSenha === form.value.confirmarSenha &&
    !errors.value.novaSenha &&
    !errors.value.confirmarSenha
  )
})

// Limpar erros quando o valor mudar
watch(() => form.value.novaSenha, () => {
  errors.value.novaSenha = ''
})

watch(() => form.value.confirmarSenha, () => {
  errors.value.confirmarSenha = ''
})

// Validar senhas em tempo real
watch(() => form.value.confirmarSenha, (novoValor) => {
  if (novoValor && form.value.novaSenha && novoValor !== form.value.novaSenha) {
    errors.value.confirmarSenha = 'As senhas não coincidem'
  }
})

// Função para validar o formulário
const validarFormulario = (): boolean => {
  errors.value = {
    novaSenha: '',
    confirmarSenha: ''
  }

  // Validar nova senha
  if (!form.value.novaSenha) {
    errors.value.novaSenha = 'Nova senha é obrigatória'
    return false
  }

  if (!Object.values(validations.value).every(Boolean)) {
    errors.value.novaSenha = 'A senha não atende aos requisitos mínimos'
    return false
  }

  // Validar confirmação de senha
  if (!form.value.confirmarSenha) {
    errors.value.confirmarSenha = 'Confirmação de senha é obrigatória'
    return false
  }

  if (form.value.novaSenha !== form.value.confirmarSenha) {
    errors.value.confirmarSenha = 'As senhas não coincidem'
    return false
  }

  return true
}

// Função para submeter o formulário
const handleSubmit = async () => {
  if (!validarFormulario()) {
    return
  }

  try {
    const result = await updatePassword(form.value.novaSenha)
    
    if (result.success) {
      limparFormulario()
      // Redirecionar para login após sucesso
      await navigateTo('/login')
    }
    // Se houver erro, o composable useAuth já mostra a mensagem de erro
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error)
    showError(error.message || 'Erro inesperado ao alterar senha')
  }
}

// Função para limpar o formulário
const limparFormulario = () => {
  form.value = {
    novaSenha: '',
    confirmarSenha: ''
  }
  errors.value = {
    novaSenha: '',
    confirmarSenha: ''
  }
}
</script>
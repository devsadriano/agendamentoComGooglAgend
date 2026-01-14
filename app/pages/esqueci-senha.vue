<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card do formulário -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <!-- Cabeçalho -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Esqueci minha senha</h1>
          <p class="text-gray-600">Digite seu email para receber as instruções de redefinição</p>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <BaseInput
              id="email"
              v-model="email"
              type="email"
              placeholder="Digite seu email"
              :disabled="isLoading"
              required
            />
          </div>

          <!-- Botão enviar -->
          <BaseButton
            type="submit"
            variant="primary"
            size="md"
            class="w-full"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Enviando...' : 'Enviar email de redefinição' }}
          </BaseButton>
        </form>

        <!-- Link para login -->
        <div class="mt-6 text-center">
          <p class="text-gray-600 text-sm">
            Lembrou sua senha?
            <NuxtLink
              to="/login"
              class="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Voltar para login
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <ModalConfirmacao
      ref="modalRef"
      v-model="showModal"
      title="Email de Recuperação Enviado"
      :message="modalMessage"
      confirm-text="Entendi"
      type="success"
      confirm-variant="primary"
      @confirm="handleConfirmModal"
      @close="handleCloseModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModalConfirmacao from '~/components/ModalConfirmacao.vue'

// Composables
const { recoverPassword, isLoading } = useAuth()

// Referências
const modalRef = ref<InstanceType<typeof ModalConfirmacao>>()

// Estados
const email = ref('')
const showModal = ref(false)
const modalMessage = ref('')

// Função para enviar o formulário
const handleSubmit = async () => {
  if (!email.value.trim()) {
    return
  }

  const result = await recoverPassword(email.value.trim())

  if (result.success) {
    modalMessage.value = 'Se o email informado faz parte do sistema, você receberá um link de recuperação em breve.\n\nVerifique também sua caixa de spam caso não encontre o email.'
    showModal.value = true
  }
}

// Função para confirmar modal
const handleConfirmModal = () => {
  showModal.value = false
  email.value = ''
  // Redirecionar para login após fechar o modal
  navigateTo('/login')
}

// Função para fechar modal
const handleCloseModal = () => {
  showModal.value = false
  email.value = ''
  // Redirecionar para login ao fechar
  navigateTo('/login')
}
</script>


<template>
  <NuxtLayout>
    <!-- Header com título -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-gray-800">Perfil</h1>
    </div>
    
    <!-- Área de conteúdo -->
    <div class="p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        
        <!-- Informações Pessoais -->
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Informações Pessoais</h2>
          
          <form @submit.prevent="handleSubmitProfile" class="space-y-4">
            <!-- Nome -->
            <div>
              <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <BaseInput
                id="nome"
                v-model="profileForm.nome"
                type="text"
                placeholder="Digite seu nome"
                :disabled="loadingProfile"
                :error="profileErrors.nome"
              />
            </div>

            <!-- Email (readonly) -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <BaseInput
                id="email"
                v-model="profileForm.email"
                type="email"
                placeholder="Seu email"
                :disabled="true"
                readonly
              />
            </div>

            <!-- Botões -->
            <div class="flex justify-end space-x-3 pt-4">
              <BaseButton
                variant="secondary"
                size="md"
                @click="cancelarEdicaoProfile"
                :disabled="loadingProfile"
              >
                Cancelar
              </BaseButton>
              
              <BaseButton
                variant="primary"
                size="md"
                type="submit"
                :disabled="loadingProfile || !profileChanged"
              >
                {{ loadingProfile ? 'Salvando...' : 'Salvar' }}
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Componente de Alteração de Senha -->
        <ChangePassword />
        
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '~/stores/user'
import ChangePassword from '~/components/ChangePassword.vue'

// Composables
const { showSuccess, showError } = useNotification()
const { updateUserName, isLoading: authLoading } = useAuth()
const userStore = useUserStore()

// Estado do formulário de perfil
const profileForm = ref({
  nome: '',
  email: ''
})

// Estado original para comparação
const originalProfile = ref({
  nome: '',
  email: ''
})

// Estado de loading (usa o loading do composable useAuth)
const loadingProfile = computed(() => authLoading.value)

// Erros do formulário
const profileErrors = ref({
  nome: ''
})

// Verificar se o perfil foi alterado
const profileChanged = computed(() => {
  return profileForm.value.nome !== originalProfile.value.nome
})

// Limpar erros quando o valor mudar
watch(() => profileForm.value.nome, () => {
  profileErrors.value.nome = ''
})

// Carregar dados do perfil
const carregarDadosPerfil = () => {
  const user = useSupabaseUser()
  if (userStore.userProfile) {
    profileForm.value = {
      nome: userStore.userProfile.nome || '',
      email: user.value?.email || ''
    }
    
    originalProfile.value = {
      nome: userStore.userProfile.nome || '',
      email: user.value?.email || ''
    }
  }
}

// Função para validar o formulário de perfil
const validarFormularioProfile = (): boolean => {
  profileErrors.value = {
    nome: ''
  }

  if (!profileForm.value.nome?.trim()) {
    profileErrors.value.nome = 'Nome é obrigatório'
    return false
  }

  if (profileForm.value.nome.trim().length < 2) {
    profileErrors.value.nome = 'Nome deve ter pelo menos 2 caracteres'
    return false
  }

  return true
}

// Função para submeter o formulário de perfil
const handleSubmitProfile = async () => {
  if (!validarFormularioProfile()) {
    return
  }

  try {
    const result = await updateUserName(profileForm.value.nome.trim())
    
    if (result.success) {
      // Atualizar o perfil original
      originalProfile.value.nome = profileForm.value.nome
      
      // Atualizar o store local para refletir a mudança
      await userStore.fetchProfile()
    }
    // O composable useAuth já cuida de mostrar os toasts de sucesso/erro
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error)
    showError(error.message || 'Erro inesperado ao atualizar perfil')
  }
}

// Função para cancelar edição
const cancelarEdicaoProfile = () => {
  profileForm.value.nome = originalProfile.value.nome
  profileErrors.value = {
    nome: ''
  }
}

// Carregar dados quando o componente for montado
onMounted(async () => {
  // Se não há perfil carregado, buscar
  if (!userStore.userProfile) {
    await userStore.fetchProfile()
  }
  
  carregarDadosPerfil()
})

// Observar mudanças no perfil do store
watch(() => userStore.userProfile, () => {
  carregarDadosPerfil()
})
</script>
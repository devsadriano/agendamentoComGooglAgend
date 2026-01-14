<template>
  <NuxtLayout>
    <!-- Header com título -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-gray-800">Profissionais</h1>
    </div>
    
    <!-- Área de conteúdo -->
    <div class="p-6">
      <!-- Header com botão adicionar -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <p class="text-gray-600">Gerencie os profissionais do sistema</p>
        </div>
        <BaseButton
          variant="primary"
          size="md"
          :disabled="!isAdmin"
          @click="abrirModal"
        >
          <template #icon-left>
            <PlusIcon class="h-4 w-4" />
          </template>
          Adicionar Profissional
        </BaseButton>
      </div>

      <!-- Tabela -->
      <TabelaProfissionais 
        :profissionais="profissionais"
        :loading="loading"
        :error="error"
        :is-admin="isAdmin"
        @editar="abrirModalEdicao"
        @deletar="confirmarDeletar"
      />
    </div>

    <!-- Modal de Edição/Criação -->
    <ModalProfissional
      v-model="modalAberto"
      :is-edicao="modalEdicao"
      :profissional="profissionalEdicao"
      :perfis="perfis"
      :especialidades="especialidades"
      :is-admin="isAdmin"
      @success="onModalSuccess"
    />

    <!-- Modal de Confirmação -->
    <ModalConfirmacao
      v-model="modalConfirmacao"
      message="Tem certeza que deseja deletar este profissional?"
      @confirm="executarDelecao"
      @close="modalConfirmacao = false"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { Profissional, Perfil, Especialidade } from '../../shared/types/database'

const { buscarProfissionais, buscarPerfis, buscarEspecialidades, deletarProfissional } = useProfissionais()
const userStore = useUserStore()
const toast = useNotification()

// Estados reativos
const profissionais = ref<Profissional[]>([])
const perfis = ref<Perfil[]>([])
const especialidades = ref<Especialidade[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const modalAberto = ref(false)
const modalEdicao = ref(false)
const profissionalEdicao = ref<Profissional | null>(null)
const modalConfirmacao = ref(false)
const profissionalParaDeletar = ref<number | null>(null)

// Computed para verificar se é admin
const isAdmin = computed(() => userStore.profile?.role === 'admin')

// Método para abrir o modal de criação
const abrirModal = () => {
  modalEdicao.value = false
  profissionalEdicao.value = null
  modalAberto.value = true
}

// Método para abrir o modal de edição
const abrirModalEdicao = (id: number) => {
  // Buscar o profissional nos dados já carregados
  const profissional = profissionais.value.find(p => p.profissional_id === id)
  if (profissional) {
    modalEdicao.value = true
    profissionalEdicao.value = profissional
    modalAberto.value = true
  }
}

// Método para abrir confirmação de deletar
const confirmarDeletar = (id: number) => {
  profissionalParaDeletar.value = id
  modalConfirmacao.value = true
}

// Método para executar a exclusão
const executarDelecao = async () => {
  if (!profissionalParaDeletar.value) return
  
  try {
    await deletarProfissional(profissionalParaDeletar.value)
    toast.showSuccess('Profissional deletado com sucesso!')
    await carregarProfissionais()
    modalConfirmacao.value = false
    profissionalParaDeletar.value = null
  } catch (error) {
    console.error('Erro ao deletar profissional:', error)
    toast.showError('Erro ao deletar profissional. Tente novamente.')
  }
}

// Método chamado quando o modal tem sucesso
const onModalSuccess = async () => {
  // Recarregar apenas a lista de profissionais
  await carregarProfissionais()
}

// Função para carregar profissionais
const carregarProfissionais = async () => {
  loading.value = true
  error.value = null
  
  try {
    profissionais.value = await buscarProfissionais()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('Erro ao carregar profissionais:', err)
  } finally {
    loading.value = false
  }
}

// Função para carregar perfis
const carregarPerfis = async () => {
  try {
    perfis.value = await buscarPerfis()
  } catch (err) {
    console.error('Erro ao carregar perfis:', err)
  }
}

// Função para carregar especialidades
const carregarEspecialidades = async () => {
  try {
    especialidades.value = await buscarEspecialidades()
  } catch (err) {
    console.error('Erro ao carregar especialidades:', err)
  }
}

// Função para carregar todos os dados necessários
const carregarDados = async () => {
  await Promise.all([
    carregarProfissionais(),
    carregarPerfis(),
    carregarEspecialidades()
  ])
}

// Carregar dados ao montar a página
onMounted(async () => {
  await carregarDados()
})
</script>
<template>
  <NuxtLayout>
    <!-- Header com título -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-gray-800">Especialidades</h1>
    </div>
    
    <!-- Área de conteúdo -->
    <div class="p-6">
      <!-- Header com botão adicionar -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <p class="text-gray-600">Gerencie as especialidades do sistema</p>
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
          Adicionar Especialidade
        </BaseButton>
      </div>

      <!-- Tabela -->
      <TabelaEspecialidades 
        :especialidades="especialidades"
        :loading="loading"
        :error="error"
        :is-admin="isAdmin"
        @editar="abrirModalEdicao"
        @deletar="confirmarDeletar"
      />
    </div>

    <!-- Modal de Edição/Criação -->
    <ModalEspecialidade
      v-model="modalAberto"
      :is-edicao="modalEdicao"
      :especialidade="especialidadeEdicao"
      @success="onModalSuccess"
    />

    <!-- Modal de Confirmação -->
    <ModalConfirmacao
      v-model="modalConfirmacao"
      message="Tem certeza que deseja deletar esta especialidade?"
      @confirm="executarDelecao"
      @close="modalConfirmacao = false"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { Especialidade } from '../../shared/types/database'

const { buscarEspecialidades, deletarEspecialidade } = useProfissionais()
const userStore = useUserStore()

// Estados reativos
const especialidades = ref<Especialidade[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const modalAberto = ref(false)
const modalEdicao = ref(false)
const especialidadeEdicao = ref<Especialidade | null>(null)
const modalConfirmacao = ref(false)
const especialidadeParaDeletar = ref<number | null>(null)

// Computed para verificar se é admin
const isAdmin = computed(() => userStore.profile?.role === 'admin')

// Método para abrir o modal de criação
const abrirModal = () => {
  modalEdicao.value = false
  especialidadeEdicao.value = null
  modalAberto.value = true
}

// Método para abrir o modal de edição
const abrirModalEdicao = (id: number) => {
  // Buscar a especialidade nos dados já carregados
  const especialidade = especialidades.value.find(e => e.id === id)
  if (especialidade) {
    modalEdicao.value = true
    especialidadeEdicao.value = especialidade
    modalAberto.value = true
  }
}

// Método para abrir confirmação de deletar
const confirmarDeletar = (id: number) => {
  especialidadeParaDeletar.value = id
  modalConfirmacao.value = true
}

// Método para executar a exclusão
const executarDelecao = async () => {
  if (!especialidadeParaDeletar.value) return
  
  try {
    await deletarEspecialidade(especialidadeParaDeletar.value)
    await carregarEspecialidades()
    modalConfirmacao.value = false
    especialidadeParaDeletar.value = null
  } catch (error) {
    console.error('Erro ao deletar especialidade:', error)
    // TODO: Mostrar notificação de erro
  }
}

// Método chamado quando o modal tem sucesso
const onModalSuccess = async () => {
  // Recarregar a lista de especialidades
  await carregarEspecialidades()
}

// Função para carregar especialidades
const carregarEspecialidades = async () => {
  loading.value = true
  error.value = null
  
  try {
    especialidades.value = await buscarEspecialidades()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('Erro ao carregar especialidades:', err)
  } finally {
    loading.value = false
  }
}

// Carregar especialidades ao montar a página
onMounted(async () => {
  await carregarEspecialidades()
})
</script>
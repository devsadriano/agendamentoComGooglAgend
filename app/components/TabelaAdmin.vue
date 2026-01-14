<template>
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <!-- Header da tabela -->
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-800">Usuários do Sistema</h2>
      <BaseButton
        variant="primary"
        size="md"
        @click="abrirModalNovoUsuario"
      >
        <template #icon-left>
          <PlusIcon class="w-5 h-5" />
        </template>
        Adicionar Usuário
      </BaseButton>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="p-6 text-center">
      <p class="text-gray-500">Carregando Usuários...</p>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="p-6 text-center">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <!-- Tabela -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Criação
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="perfil in perfis" :key="perfil.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ perfil.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ perfil.nome }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ perfil.email?.trim() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                perfil.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              ]">
                {{ perfil.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(perfil.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  type="button"
                  class="p-1 rounded transition-colors text-red-600 hover:text-red-900 hover:bg-red-50"
                  title="Deletar usuario"
                  @click="abrirConfirmacaoDeletar(perfil)"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="perfis.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              Nenhum Usuário encontrado
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Novo Usuário -->
    <ModalNovoUsuario
      ref="modalNovoUsuarioRef"
      v-model="showModalNovoUsuario"
      @confirm="handleConfirmNovoUsuario"
      @close="handleCloseModalNovoUsuario"
    />

    <ModalConfirmacao
      ref="modalConfirmacaoRef"
      v-model="showModalConfirmacao"
      :message="mensagemConfirmacao"
      @confirm="handleConfirmDeletarUsuario"
      @close="handleCloseModalConfirmacao"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useProfissionais } from '~/composables/useProfissionais'
import { useNotification } from '~/composables/useNotification'
import type { Perfil } from '../../shared/types/database'
import BaseButton from '~/components/BaseButton.vue'
import ModalNovoUsuario from '~/components/ModalNovoUsuario.vue'
import ModalConfirmacao from '~/components/ModalConfirmacao.vue'

// Composable
const { buscarPerfis } = useProfissionais()

// Estados
const perfis = ref<Perfil[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showModalNovoUsuario = ref(false)
const modalNovoUsuarioRef = ref<InstanceType<typeof ModalNovoUsuario> | null>(null)
const criandoUsuario = ref(false)
const { showSuccess, showError } = useNotification()
const showModalConfirmacao = ref(false)
const modalConfirmacaoRef = ref<InstanceType<typeof ModalConfirmacao> | null>(null)
const mensagemConfirmacao = ref('')
const userIdParaDeletar = ref<string | null>(null)
const deletandoUsuario = ref(false)

// FunÇõÇœo para formatar data
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// FunÇõÇœo para carregar os perfis
const carregarPerfis = async () => {
  loading.value = true
  error.value = null

  try {
    perfis.value = await buscarPerfis()
  } catch (err: any) {
    error.value = err.message || 'Erro ao carregar Usuários'
    console.error('Erro ao carregar perfis:', err)
  } finally {
    loading.value = false
  }
}

// FunÇõÇæes do modal
const abrirModalNovoUsuario = () => {
  modalNovoUsuarioRef.value?.setError('')
  showModalNovoUsuario.value = true
}

const handleConfirmNovoUsuario = async (data: { nome: string; email: string; senha: string }) => {
  if (criandoUsuario.value) return
  criandoUsuario.value = true
  modalNovoUsuarioRef.value?.setLoading(true)

  try {
    await $fetch('/api/create_user', {
      method: 'POST',
      body: {
        nome: data.nome,
        email: data.email,
        password: data.senha,
      },
    })

    modalNovoUsuarioRef.value?.setError('')
    showSuccess('Usuario criado com sucesso!')
    showModalNovoUsuario.value = false
    await carregarPerfis()
  } catch (err: any) {
    const message = err?.data?.statusMessage || err?.message || 'Erro ao criar usuario'
    modalNovoUsuarioRef.value?.setError(message)
    showError(message)
  } finally {
    modalNovoUsuarioRef.value?.setLoading(false)
    criandoUsuario.value = false
  }
}

const handleCloseModalNovoUsuario = () => {
  showModalNovoUsuario.value = false
}

const abrirConfirmacaoDeletar = (perfil: Perfil) => {
  if (!perfil.user_id) {
    showError('Nao foi possivel identificar o usuario para deletar.')
    return
  }

  userIdParaDeletar.value = perfil.user_id
  mensagemConfirmacao.value = `Tem certeza que deseja deletar o usuario "${perfil.nome || perfil.email || perfil.user_id}"?`
  showModalConfirmacao.value = true
}

const handleConfirmDeletarUsuario = async () => {
  if (!userIdParaDeletar.value || deletandoUsuario.value) return
  deletandoUsuario.value = true
  modalConfirmacaoRef.value?.setLoading(true)

  try {
    await $fetch('/api/delete_user', {
      method: 'POST',
      body: {
        user_id: userIdParaDeletar.value,
      },
    })

    showSuccess('Usuario deletado com sucesso!')
    showModalConfirmacao.value = false
    userIdParaDeletar.value = null
    mensagemConfirmacao.value = ''
    await carregarPerfis()
  } catch (err: any) {
    const message = err?.data?.statusMessage || err?.message || 'Erro ao deletar usuario'
    showError(message)
  } finally {
    modalConfirmacaoRef.value?.setLoading(false)
    deletandoUsuario.value = false
  }
}

const handleCloseModalConfirmacao = () => {
  showModalConfirmacao.value = false
  userIdParaDeletar.value = null
  mensagemConfirmacao.value = ''
}

// Carregar perfis quando o componente for montado
// Isso sÇü acontece apÇüs o middleware ter validado que o user Ç¸ admin
onMounted(() => {
  carregarPerfis()
})
</script>

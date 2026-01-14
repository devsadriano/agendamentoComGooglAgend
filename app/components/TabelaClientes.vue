<template>
  <div class="overflow-x-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="text-gray-500">Carregando clientes...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 py-4">
      Erro ao carregar clientes: {{ error }}
    </div>

    <!-- Table -->
    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nome
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            CPF
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Telefone
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Endereço
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="clientes.length === 0">
          <td colspan="7" class="px-6 py-4 text-center text-gray-500">
            Nenhum cliente encontrado
          </td>
        </tr>
        <tr v-for="cliente in clientes" :key="cliente.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ cliente.id }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ cliente.nome_cliente }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ cliente.cpf }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ cliente.email }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ cliente.telefone }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ cliente.endereco }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex space-x-2">
              <!-- Botão Editar -->
              <button
                type="button"
                class="p-1 rounded transition-colors text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                title="Editar cliente"
                @click="handleEditar(cliente.id)"
              >
                <PencilIcon class="h-5 w-5" />
              </button>
              
              <!-- Botão Deletar -->
              <button
                type="button"
                class="p-1 rounded transition-colors text-red-600 hover:text-red-900 hover:bg-red-50"
                title="Deletar cliente"
                @click="handleDeletar(cliente.id)"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { Cliente } from '../../shared/types/database'

// Props
interface Props {
  clientes: Cliente[]
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

const emit = defineEmits<{
  editar: [id: number]
  deletar: [id: number]
}>()

const handleEditar = (id: number) => {
  emit('editar', id)
}

const handleDeletar = (id: number) => {
  emit('deletar', id)
}
</script>
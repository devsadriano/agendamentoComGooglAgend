<template>
  <div class="overflow-x-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="text-gray-500">Carregando especialidades...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 py-4">
      Erro ao carregar especialidades: {{ error }}
    </div>

    <!-- Table -->
    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nome da Especialidade
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="especialidades.length === 0">
          <td colspan="3" class="px-6 py-4 text-center text-gray-500">
            Nenhuma especialidade encontrada
          </td>
        </tr>
        <tr v-for="especialidade in especialidades" :key="especialidade.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ especialidade.id }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ especialidade.nome }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex space-x-2">
              <!-- Botão Editar -->
              <button
                type="button"
                :disabled="!isAdmin"
                :class="[
                  'p-1 rounded transition-colors',
                  isAdmin 
                    ? 'text-blue-600 hover:text-blue-900 hover:bg-blue-50' 
                    : 'text-gray-400 cursor-not-allowed'
                ]"
                title="Editar especialidade"
                @click="handleEditar(especialidade.id)"
              >
                <PencilIcon class="h-5 w-5" />
              </button>
              
              <!-- Botão Deletar -->
              <button
                type="button"
                :disabled="!isAdmin"
                :class="[
                  'p-1 rounded transition-colors',
                  isAdmin 
                    ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                    : 'text-gray-400 cursor-not-allowed'
                ]"
                title="Deletar especialidade"
                @click="handleDeletar(especialidade.id)"
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
import type { Especialidade } from '../../shared/types/database'

// Props
interface Props {
  especialidades: Especialidade[]
  loading?: boolean
  error?: string | null
  isAdmin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  isAdmin: false
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
<template>
  <div class="overflow-x-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="text-gray-500">Carregando profissionais...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 py-4">
      Erro ao carregar profissionais: {{ error }}
    </div>

    <!-- Table -->
    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nome do Profissional
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Especialidade
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="profissionais.length === 0">
          <td colspan="4" class="px-6 py-4 text-center text-gray-500">
            Nenhum profissional encontrado
          </td>
        </tr>
        <tr v-for="profissional in profissionais" :key="profissional.profissional_id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ profissional.profissional_id }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ profissional.nome_profissional }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ profissional.especialidade_profissional }}
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
                title="Editar profissional"
                @click="handleEditar(profissional.profissional_id)"
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
                title="Deletar profissional"
                @click="handleDeletar(profissional.profissional_id)"
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
import type { Profissional } from '../../shared/types/database'

// Props
interface Props {
  profissionais: Profissional[]
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
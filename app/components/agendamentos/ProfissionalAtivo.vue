<template>
  <div 
    class="text-center cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
    @click="abrirModalSelecao"
    title="Clique para trocar de profissional"
  >
    <div v-if="loading" class="text-gray-500">
      Carregando...
    </div>
    <div v-else-if="profissionalAtivo" class="space-y-1">
      <h3 class="text-xl font-semibold text-gray-800 uppercase">
        {{ profissionalAtivo.nome_profissional }}
      </h3>
      <p class="text-base text-gray-600">
        {{ profissionalAtivo.especialidade_profissional }}
      </p>
      <p class="text-xs text-blue-500 mt-2">
        Clique para trocar
      </p>
    </div>
    <div v-else class="text-gray-500">
      <p>Nenhum profissional encontrado</p>
      <p class="text-xs text-blue-500 mt-2">
        Clique para selecionar
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfissionalAtivo } from '../../composables/useProfissionalAtivo'

// Emits
const emit = defineEmits<{
  'abrir-selecao': []
}>()

// Usar o composable compartilhado do profissional ativo
const { profissionalAtivo, loading, error } = useProfissionalAtivo()

// Métodos
const abrirModalSelecao = () => {
  emit('abrir-selecao')
}
</script>
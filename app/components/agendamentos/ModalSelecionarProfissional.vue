<template>
  <BaseModal
    v-model="modalVisible"
    title="Selecionar Profissional"
    :show-footer="false"
    @close="handleClose"
  >
    <div class="space-y-4">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500">Carregando profissionais...</div>
      </div>

      <!-- Lista de profissionais -->
      <div v-else class="space-y-2">
        <div
          v-for="profissional in profissionais"
          :key="profissional.profissional_id"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          :class="{
            'border-blue-500 bg-blue-50': profissional.profissional_id === profissionalAtivo?.profissional_id
          }"
          @click="selecionarProfissional(profissional)"
        >
          <!-- Avatar -->
          <div class="flex-shrink-0 mr-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-lg font-medium text-blue-600">
                {{ profissional.nome_profissional?.charAt(0).toUpperCase() || 'P' }}
              </span>
            </div>
          </div>

          <!-- Informações -->
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ profissional.nome_profissional }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ profissional.especialidade_profissional }}
                </p>
              </div>
              
              <!-- Indicador de seleção -->
              <div v-if="profissional.profissional_id === profissionalAtivo?.profissional_id" class="flex-shrink-0">
                <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Caso não tenha profissionais -->
        <div v-if="profissionais.length === 0" class="text-center py-8 text-gray-500">
          Nenhum profissional encontrado
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Profissional } from '../../../shared/types/database'
import { useProfissionalAtivo } from '../../composables/useProfissionalAtivo'
import { useProfissionais } from '../../composables/useProfissionais'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'profissional-selecionado': [profissional: Profissional]
}>()

// Composables
const { profissionalAtivo, definirProfissionalAtivo } = useProfissionalAtivo()
const { buscarProfissionais } = useProfissionais()

// Estados reativos
const loading = ref(false)
const profissionais = ref<Profissional[]>([])

// Computed
const modalVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Métodos
const carregarProfissionais = async () => {
  loading.value = true
  try {
    profissionais.value = await buscarProfissionais()
  } catch (error) {
    console.error('Erro ao carregar profissionais:', error)
  } finally {
    loading.value = false
  }
}

const selecionarProfissional = async (profissional: Profissional) => {
  // Definir o profissional ativo
  await definirProfissionalAtivo(profissional)
  
  // Emitir evento para o componente pai
  emit('profissional-selecionado', profissional)
  
  // Fechar modal
  modalVisible.value = false
}

const handleClose = () => {
  modalVisible.value = false
}

// Carregar profissionais quando o modal for aberto
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      carregarProfissionais()
    }
  }
)
</script>
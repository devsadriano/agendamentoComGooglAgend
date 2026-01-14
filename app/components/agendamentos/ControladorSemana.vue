<template>
  <div class="w-full" style="background-color: #FAFAFA;">
    <!-- Primeira linha: Data, botões e botão Novo -->
    <div class="flex items-center p-4">
      <!-- Lado esquerdo: Data e botões de navegação (largura fixa) -->
      <div class="w-64 flex items-center space-x-4">
        <!-- Período da semana -->
        <div class="text-lg font-medium text-gray-700">
          {{ formatarData(primeiroDia) }} - {{ formatarData(ultimoDia) }}
        </div>
        
        <!-- Botões de navegação -->
        <div class="flex items-center space-x-2">
          <!-- Botão voltar semana -->
          <button 
            @click="voltarSemana"
            class="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Semana anterior"
          >
            <ChevronLeftIcon class="h-6 w-6 text-gray-600" />
          </button>
          
          <!-- Botão avançar semana -->
          <button 
            @click="avancarSemana"
            class="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Próxima semana"
          >
            <ChevronRightIcon class="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      <!-- Centro: Profissional Ativo (ocupa espaço restante) -->
      <div class="flex-1 flex justify-center">
        <ProfissionalAtivo @abrir-selecao="emit('abrir-selecao-profissional')" />
      </div>

      <!-- Lado direito: Botão Novo (largura fixa igual ao esquerdo) -->
      <div class="w-64 flex justify-end">
        <BaseButton
          variant="primary"
          size="lg"
          @click="novoAgendamento"
        >
          Novo
        </BaseButton>
      </div>
    </div>

    <!-- Segunda linha: Lista de dias -->
    <div class="mt-4">
      <ListaDias :dias-semana="agendamentoStore.semanaAtual" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import BaseButton from '../BaseButton.vue'
import ProfissionalAtivo from './ProfissionalAtivo.vue'
import ListaDias from './ListaDias.vue'

// Definir emits
const emit = defineEmits<{
  'novoAgendamento': []
  'abrir-selecao-profissional': []
}>()

// Acessar o store de agendamentos
const agendamentoStore = useAgendamentoStore()

// Computed para obter o primeiro e último dia da semana
const primeiroDia = computed(() => {
  const semana = agendamentoStore.semanaAtual
  return semana.length > 0 ? semana[0]?.data || new Date() : new Date()
})

const ultimoDia = computed(() => {
  const semana = agendamentoStore.semanaAtual
  return semana.length > 0 ? semana[6]?.data || new Date() : new Date()
})

// Função para formatar data no formato dd/mm
const formatarData = (data: Date): string => {
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  })
}

// Funções para navegação
const voltarSemana = () => {
  agendamentoStore.voltarSemana()
}

const avancarSemana = () => {
  agendamentoStore.avancarSemana()
}

// Função para novo agendamento
const novoAgendamento = () => {
  emit('novoAgendamento')
}
</script>
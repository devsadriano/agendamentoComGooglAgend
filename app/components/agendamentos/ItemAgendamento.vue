<template>
  <div class="flex flex-col w-full relative mx-1" style="background-color: #F3F4F6;">
    <!-- Container com estrutura EXATA da ReguaHorarios -->
    <div class="relative">
      <!-- Grid de horários base IDÊNTICO à ReguaHorarios -->
      <template v-for="(hora, index) in horarios" :key="hora">
        <div class="h-24"></div>
        <!-- Espaço separador após cada horário, exceto o último -->
        <div 
          v-if="index < horarios.length - 1" 
          class="h-1" 
          style="background-color: transparent;"
        ></div>
      </template>
      
      <!-- Agendamentos posicionados absolutamente -->
      <SlotAgendamento 
        v-for="agendamento in agendamentos" 
        :key="agendamento.id"
        :agendamento="agendamento"
        @editar-agendamento="emit('editar-agendamento', $event)"
      />
      
      <!-- Indicador de loading -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50">
        <div class="text-sm text-gray-500">Carregando...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SlotAgendamento from './SlotAgendamento.vue'
import type { Agendamento } from '../../../shared/types/database'

interface Props {
  data: Date
  agendamentos: Agendamento[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'editar-agendamento': [agendamento: Agendamento]
}>()

// Horários disponíveis (deve estar sincronizado com a régua)
const horarios = computed(() => {
  const horas = []
  for (let i = 8; i <= 22; i++) {
    horas.push(`${i.toString().padStart(2, '0')}:00`)
  }
  return horas
})
</script>
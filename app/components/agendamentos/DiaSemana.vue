<template>
  <div class="flex flex-col items-center flex-1 relative rounded-t-3xl mx-1" style="background-color: #F3F4F6;">
    <!-- Conteúdo do dia com padding -->
    <div class="flex flex-col items-center px-3 py-6">
      <!-- Número do dia -->
      <div class="text-4xl font-semibold text-gray-800 mb-2">
        {{ dia.diaNumero }}
      </div>
      
      <!-- Dia da semana por extenso (ex: DOM, SEG) -->
      <div class="text-sm font-medium text-gray-600 uppercase">
        {{ diaSemanaAbrev }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiaSemana } from '../../../shared/types/database'

// Props
interface Props {
  dia: DiaSemana
  isPrimeiro?: boolean
  isUltimo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPrimeiro: false,
  isUltimo: false
})

// Computed para abreviação do dia da semana
const diaSemanaAbrev = computed(() => {
  const abreviacoes: Record<string, string> = {
    'Domingo': 'DOM',
    'Segunda': 'SEG',
    'Terça': 'TER',
    'Quarta': 'QUA',
    'Quinta': 'QUI',
    'Sexta': 'SEX',
    'Sábado': 'SAB'
  }
  
  return abreviacoes[props.dia.diaSemana] || props.dia.diaSemana.substring(0, 3).toUpperCase()
})
</script>

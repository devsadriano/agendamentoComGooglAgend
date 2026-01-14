<template>
  <div class="flex" style="background-color: #FAFAFA;">
    <!-- Espaço para compensar a largura da régua -->
    <div class="w-20 mr-1"></div>
    
    <!-- Header dos dias da semana -->
    <div class="flex flex-1">
      <DiaSemanaComponent 
        v-for="(dia, index) in diasSemana" 
        :key="dia.data.toISOString()"
        :dia="dia"
        :is-primeiro="index === 0"
        :is-ultimo="index === diasSemana.length - 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiaSemana } from '../../../shared/types/database'
import DiaSemanaComponent from './DiaSemana.vue'

// Props
interface Props {
  diasSemana: DiaSemana[]
}

const props = defineProps<Props>()
</script>
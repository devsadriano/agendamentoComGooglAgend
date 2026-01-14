<template>
  <div class="w-20 mr-1" style="background-color: #F3F4F6;">
    <!-- Lista de horários -->
    <div>
      <template v-for="(hora, index) in horarios" :key="hora">
        <div class="h-24 flex items-center justify-center text-sm text-gray-500">
          {{ hora }}
        </div>
        <!-- Espaço separador após cada horário, exceto o último -->
        <div 
          v-if="index < horarios.length - 1" 
          class="h-1" 
          style="background-color: #FAFAFA;"
        ></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
// Lista de horários das 8h às 22h
const horarios = computed(() => {
  const horas = []
  for (let i = 8; i <= 22; i++) {
    horas.push(`${i.toString().padStart(2, '0')}:00`)
  }
  return horas
})
</script>
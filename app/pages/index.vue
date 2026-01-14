<template>
  <NuxtLayout>
    <!-- Header com título -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-gray-800">Agendamentos</h1>
    </div>
    
    <!-- Área de conteúdo -->
    <div class="p-6 flex flex-col h-full min-h-[calc(100vh-80px)]">
      <!-- Componente principal de gerenciamento -->
      <AgendamentoManager class="flex-1 h-full" />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Import explícito do componente
import AgendamentoManager from '../components/agendamentos/AgendamentoManager.vue'

// Inicializar o store de agendamentos
const agendamentoStore = useAgendamentoStore()

// Configuração da página
useHead({
  title: 'Agendamentos - Sistema de Agendamento',
  meta: [
    { name: 'description', content: 'Gerenciamento de agendamentos do sistema' }
  ]
})
</script>
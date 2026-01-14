<template>
  <NuxtLayout>
    <!-- Header com título -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-gray-800">Administração</h1>
    </div>
    
    <!-- Área de conteúdo -->
    <div class="p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Tabela de usuários -->
        <TabelaAdmin />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import TabelaAdmin from '~/components/TabelaAdmin.vue'

// Usar middleware adminGuard para proteger a página
definePageMeta({
  middleware: 'admin-guard'
})
</script>


<template>
  <div class="min-h-screen bg-neutral-50 flex">
    <!-- Sidebar -->
    <Sidebar ref="sidebarRef" />
    
    <!-- Main Content -->
    <main 
      :class="[
        'flex-1 overflow-y-auto transition-all duration-300',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      ]"
    >
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Referência do componente Sidebar
const sidebarRef = ref()

// Estado computado para verificar se o sidebar está colapsado
const sidebarCollapsed = computed(() => {
  return sidebarRef.value?.isCollapsed || false
})
</script>
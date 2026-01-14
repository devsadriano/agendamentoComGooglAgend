<template>
  <div class="relative">
    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen"
      :class="[
        'absolute bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50',
        isCollapsed ? 'left-16' : 'left-0'
      ]"
    >
      <!-- Perfil -->
      <button 
        class="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
        @click="handleProfileClick"
      >
        <UserIcon class="w-4 h-4" />
        <span>Perfil</span>
      </button>
      
      <!-- Divisor -->
      <div class="border-t border-gray-100 my-1"></div>
      
      <!-- Sair -->
      <button 
        class="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
        @click="handleLogoutClick"
        :disabled="isLoading"
      >
        <ArrowRightOnRectangleIcon class="w-4 h-4" />
        <span>{{ isLoading ? 'Saindo...' : 'Sair' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '~/composables/useAuth'

// Props
interface Props {
  isOpen: boolean
  isCollapsed?: boolean
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// Composable de autenticação
const { logout, isLoading } = useAuth()

// Função para lidar com clique no perfil
const handleProfileClick = async () => {
  try {
    await navigateTo('/perfil')
    emit('close')
  } catch (error) {
    console.error('Erro ao navegar para perfil:', error)
  }
}

// Função para fazer logout
const handleLogoutClick = async () => {
  try {
    await logout()
    emit('close')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}
</script>
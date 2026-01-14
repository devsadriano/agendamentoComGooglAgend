<template>
  <aside :class="[
    'bg-white shadow-lg h-screen flex flex-col fixed left-0 top-0 z-10 transition-all duration-300',
    isCollapsed ? 'w-16' : 'w-64'
  ]">
    <!-- Header -->
    <div class="bg-blue-600 text-white p-4 flex items-center justify-between">
      <div v-if="!isCollapsed" class="flex-1">
        <h2 class="text-xl font-bold">Agendamento</h2>
        <p class="text-blue-100 text-sm">Sistema de Gestão</p>
      </div>
      
      <!-- Botão de colapso -->
      <button 
        @click="toggleSidebar"
        class="p-1 rounded hover:bg-blue-700 transition-colors"
        :class="{ 'mx-auto': isCollapsed }"
      >
        <ChevronLeftIcon v-if="!isCollapsed" class="w-5 h-5" />
        <ChevronRightIcon v-else class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 space-y-2">
      <!-- 1. Dashboard - redireciona para página index -->
      <NuxtLink 
        to="/" 
        :class="[
          'flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group',
          isCollapsed ? 'justify-center' : 'space-x-3',
          { 'bg-blue-50 text-blue-600 border-r-2 border-blue-600': $route.path === '/' }
        ]"
        :title="isCollapsed ? 'Dashboard' : ''"
      >
        <HomeIcon class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="font-medium">Dashboard</span>
      </NuxtLink>

      <!-- 2. Especialidades - redireciona para página especialidades -->
      <NuxtLink 
        to="/especialidades" 
        :class="[
          'flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group',
          isCollapsed ? 'justify-center' : 'space-x-3',
          { 'bg-blue-50 text-blue-600 border-r-2 border-blue-600': $route.path === '/especialidades' }
        ]"
        :title="isCollapsed ? 'Especialidades' : ''"
      >
        <LightBulbIcon class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="font-medium">Especialidades</span>
      </NuxtLink>

      <!-- 3. Agendamentos -->
      <NuxtLink 
        to="/agendamentos" 
        :class="[
          'flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group',
          isCollapsed ? 'justify-center' : 'space-x-3',
          { 'bg-blue-50 text-blue-600 border-r-2 border-blue-600': $route.path === '/agendamentos' }
        ]"
        :title="isCollapsed ? 'Agendamentos' : ''"
      >
        <CalendarIcon class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="font-medium">Agendamentos</span>
      </NuxtLink>

      <!-- 4. Clientes -->
      <NuxtLink 
        to="/clientes" 
        :class="[
          'flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group',
          isCollapsed ? 'justify-center' : 'space-x-3',
          { 'bg-blue-50 text-blue-600 border-r-2 border-blue-600': $route.path === '/clientes' }
        ]"
        :title="isCollapsed ? 'Clientes' : ''"
      >
        <UserIcon class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="font-medium">Clientes</span>
      </NuxtLink>

      <!-- 5. Profissionais -->
      <NuxtLink 
        to="/profissionais" 
        :class="[
          'flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group',
          isCollapsed ? 'justify-center' : 'space-x-3',
          { 'bg-blue-50 text-blue-600 border-r-2 border-blue-600': $route.path === '/profissionais' }
        ]"
        :title="isCollapsed ? 'Profissionais' : ''"
      >
        <UsersIcon class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="font-medium">Profissionais</span>
      </NuxtLink>

      <!-- 6. Administração (apenas para admins) -->
      <NuxtLink 
        v-if="isAdmin"
        to="/admin" 
        :class="[
          'flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group',
          isCollapsed ? 'justify-center' : 'space-x-3',
          { 'bg-blue-50 text-blue-600 border-r-2 border-blue-600': $route.path === '/admin' }
        ]"
        :title="isCollapsed ? 'Administração' : ''"
      >
        <CogIcon class="w-5 h-5 flex-shrink-0" />
        <span v-if="!isCollapsed" class="font-medium">Administração</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="dropdown-container relative">
        <button 
          @click="handleConfigClick"
          :class="[
            'w-full flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group text-left',
            isCollapsed ? 'justify-center' : 'space-x-3',
            { 'bg-gray-100': isDropdownOpen }
          ]"
          :title="isCollapsed ? 'Configurações' : ''"
        >
          <CogIcon class="w-5 h-5 text-gray-600 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-medium text-gray-700">Configurações</span>
        </button>
        
        <!-- Dropdown Menu - aparece sempre quando aberto -->
        <DropdownMenu 
          :is-open="isDropdownOpen" 
          @close="closeDropdown"
          :is-collapsed="isCollapsed"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// Import explícito do composable conforme Nuxt 4 guidelines
import { useAuth } from '~/composables/useAuth'
// Import da store do usuário
import { useUserStore } from '~/stores/user'

// Imports dos ícones do Heroicons
import {
  HomeIcon,
  LightBulbIcon,
  CalendarIcon,
  UserIcon,
  UsersIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

// Import do componente DropdownMenu
import DropdownMenu from './DropdownMenu.vue'

// Store do usuário
const userStore = useUserStore()

// Estado do dropdown
const isDropdownOpen = ref(false)

// Estado do colapso do sidebar
const isCollapsed = ref(false)

// Verificar se o usuário é admin
const isAdmin = computed(() => userStore.userRole === 'admin')

// Expor o estado para componentes pais
defineExpose({
  isCollapsed
})

// Função para lidar com clique em configurações (abre/fecha dropdown)
const handleConfigClick = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Função para toggle do colapso
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
  // Não fechar o dropdown quando colapsar - permitir que funcione em ambos os estados
}

// Função para fechar dropdown
const closeDropdown = () => {
  isDropdownOpen.value = false
}

// Fechar dropdown quando clicar fora
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    closeDropdown()
  }
}

// Adicionar/remover listener para clique fora
import { onMounted, onUnmounted, computed } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
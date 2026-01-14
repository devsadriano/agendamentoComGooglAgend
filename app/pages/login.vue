<template>
  <div class="min-h-screen flex">
    <!-- Coluna da Esquerda - Branding/Informações -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
        <div class="max-w-md">
          <!-- Logo/Nome da empresa -->
          <div class="mb-8">
            <div class="flex items-center mb-4">
              <CalendarIcon class="w-12 h-12 text-white" />
              <h1 class="ml-3 text-3xl font-bold">AgendaPro</h1>
            </div>
            <div class="w-16 h-1 bg-white/30 rounded"></div>
          </div>

          <!-- Título principal -->
          <h2 class="text-4xl font-bold leading-tight mb-6">
            Gerencie seus agendamentos com facilidade
          </h2>
          
          <!-- Descrição -->
          <p class="text-xl text-white/90 mb-8 leading-relaxed">
            Simplifique a gestão dos seus compromissos e ofereça uma experiência excepcional aos seus clientes.
          </p>

          <!-- Features destacadas -->
          <div class="space-y-4">
            <div class="flex items-center">
              <CheckCircleIcon class="w-6 h-6 text-secondary-300 mr-3 flex-shrink-0" />
              <span class="text-white/90">Agendamento online 24/7</span>
            </div>
            <div class="flex items-center">
              <CheckCircleIcon class="w-6 h-6 text-secondary-300 mr-3 flex-shrink-0" />
              <span class="text-white/90">Notificações automáticas</span>
            </div>
            <div class="flex items-center">
              <CheckCircleIcon class="w-6 h-6 text-secondary-300 mr-3 flex-shrink-0" />
              <span class="text-white/90">Relatórios detalhados</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Coluna da Direita - Formulário de Login -->
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-background-primary">
      <div class="mx-auto w-full max-w-sm lg:max-w-md">
        <!-- Logo mobile (visível apenas em telas pequenas) -->
        <div class="lg:hidden text-center mb-8">
          <div class="flex items-center justify-center mb-4">
            <CalendarIcon class="w-10 h-10 text-blue-500" />
            <h1 class="ml-2 text-2xl font-bold text-text-primary">AgendaPro</h1>
          </div>
        </div>

        <!-- Componente do formulário -->
        <LoginForm @submit="handleLogin" />

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-xs text-text-tertiary">
            © 2025 AgendaPro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

// Configurações da página
definePageMeta({
  title: 'Login',
  layout: false // Remove o layout padrão para esta página
})

useHead({
  title: 'Login - AgendaPro',
  meta: [
    { name: 'description', content: 'Faça login na sua conta AgendaPro para gerenciar seus agendamentos' }
  ]
})

// Função para lidar com o login (será implementada depois)
const handleLogin = (credentials: { email: string; password: string }) => {
  console.log('Login attempt:', credentials)
  // Aqui futuramente será implementada a lógica de autenticação
}
</script>

<style scoped>
/* Garantir que a página ocupe toda a altura da viewport */
html, body {
  height: 100%;
}
</style>
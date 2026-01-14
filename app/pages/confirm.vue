<template>
  <div class="min-h-screen bg-background-primary flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="mb-6">
        <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircleIcon class="w-8 h-8 text-blue-600" />
        </div>
        <h2 class="text-2xl font-bold text-text-primary mb-2">
          Autenticação em Progresso
        </h2>
        <p class="text-text-secondary">
          Aguarde enquanto confirmamos seu acesso...
        </p>
      </div>
      
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

// Configurações da página
definePageMeta({
  title: 'Confirmação',
  layout: false // Remove o layout padrão para esta página
})

useHead({
  title: 'Confirmação - AgendaPro',
  meta: [
    { name: 'description', content: 'Página de confirmação de autenticação' }
  ]
})

// Obtém o usuário e redirecionamento com cookie
const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

// Observa mudanças no usuário
watch(user, () => {
  if (user.value) {
    // Pega a página original salva no cookie, se houver
    const redirectPath = redirectInfo.pluck() // Pega e limpa o cookie
    
    // Redireciona para a página original ou para a inicial
    return navigateTo(redirectPath || '/')
  }
}, { immediate: true })

// Se após um tempo não houver autenticação, redireciona para login
onMounted(() => {
  setTimeout(() => {
    if (!user.value) {
      navigateTo('/login')
    }
  }, 10000) // 10 segundos
})
</script>
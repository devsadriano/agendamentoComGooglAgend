<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card do formulário -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <!-- Cabeçalho -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Redefinir Senha</h1>
          <p class="text-gray-600">Digite sua nova senha abaixo</p>
        </div>

        <!-- Formulário de alteração de senha -->
        <ChangePassword />

        <!-- Link para login -->
        <div class="mt-6 text-center">
          <p class="text-gray-600 text-sm">
            Lembrou sua senha?
            <NuxtLink
              to="/login"
              class="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Voltar para login
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChangePassword from '~/components/ChangePassword.vue'

// Apenas para integrar o componente ChangePassword
</script>

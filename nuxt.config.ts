// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt'],
  alias: {
    '~shared': './shared'
  },
  ssr: true,
  experimental: {
    payloadExtraction: false // Melhora problemas de hidratação
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login', '/confirm', '/esqueci-senha', '/recuperar-senha'], // Páginas que não precisam de autenticação
      saveRedirectToCookie: true // Salva página original no cookie
    }
  },
  css: [
    'vue-toastification/dist/index.css'
  ],
  build: {
    transpile: ['vue-toastification']
  }
})
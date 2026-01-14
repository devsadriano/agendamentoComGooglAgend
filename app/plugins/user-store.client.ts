export default defineNuxtPlugin(async () => {
  // Só executa no cliente para evitar problemas de SSR
  if (process.client) {
    const user = useSupabaseUser()
    const userStore = useUserStore()
    
    // Watch para mudanças no usuário autenticado
    watch(user, async (newUser) => {
      if (newUser) {
        // Usuário logado - busca perfil
        await userStore.fetchProfile()
      } else {
        // Usuário deslogado - limpa perfil
        userStore.clearProfile()
      }
    }, { immediate: true })
  }
})
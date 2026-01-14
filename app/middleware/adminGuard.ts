/**
 * Middleware para proteger a página /admin
 * Verifica se o usuário é admin usando a RPC do Supabase
 * Se não for admin, redireciona para a página inicial
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkIsAdmin } = useAuth()
  
  // Verificar se o usuário é admin
  const isAdmin = await checkIsAdmin()
  
  // Se não for admin, redirecionar para a página inicial
  if (!isAdmin) {
    return navigateTo('/')
  }
})

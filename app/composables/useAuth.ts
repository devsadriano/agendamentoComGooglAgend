import type { LoginCredentials, AuthError, AuthResult } from '../../shared/types'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const { showSuccess, showError } = useNotification()
  
  // Estado de loading para operações de autenticação
  const isLoading = ref(false)
  
  /**
   * Realiza o login do usuário
   */
  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      isLoading.value = true
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
      
      if (error) {
        const authError: AuthError = {
          message: error.message,
          code: error.message
        }
        
        // Exibe toast de erro
        showError('Erro ao fazer login: ' + error.message)
        
        return { success: false, error: authError }
      }
      
      if (data.user) {
        // Toast de sucesso
        showSuccess('Login realizado com sucesso!')
        
        // Redireciona para a página inicial
        await navigateTo('/')
        
        return { success: true }
      }
      
      return { success: false, error: { message: 'Erro desconhecido' } }
      
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      }
      
      showError('Erro inesperado durante o login')
      
      return { success: false, error: authError }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Realiza o logout do usuário
   */
  const logout = async (): Promise<AuthResult> => {
    try {
      isLoading.value = true
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        const authError: AuthError = {
          message: error.message,
          code: error.message
        }
        
        showError('Erro ao fazer logout: ' + error.message)
        
        return { success: false, error: authError }
      }
      
      // Toast de sucesso
      showSuccess('Logout realizado com sucesso!')
      
      // Redireciona para a página de login
      await navigateTo('/login')
      
      return { success: true }
      
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      }
      
      showError('Erro inesperado durante o logout')
      
      return { success: false, error: authError }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Altera a senha do usuário
   */
  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    try {
      isLoading.value = true
      
      // Verifica se o usuário está autenticado
      if (!user.value) {
        const authError: AuthError = {
          message: 'Usuário não autenticado',
          code: 'USER_NOT_AUTHENTICATED'
        }
        
        showError('Você precisa estar logado para alterar a senha')
        
        return { success: false, error: authError }
      }
      
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) {
        const authError: AuthError = {
          message: error.message,
          code: error.message
        }
        
        // Exibe toast de erro
        showError('Erro ao alterar senha: ' + error.message)
        
        return { success: false, error: authError }
      }
      
      if (data.user) {
        // Toast de sucesso
        showSuccess('Senha alterada com sucesso!')
        
        return { success: true }
      }
      
      return { success: false, error: { message: 'Erro desconhecido ao alterar senha' } }
      
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      }
      
      showError('Erro inesperado ao alterar senha')
      
      return { success: false, error: authError }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Atualiza o nome do usuário
   */
  const updateUserName = async (novoNome: string): Promise<AuthResult> => {
    try {
      isLoading.value = true
      
      // Verifica se o usuário está autenticado
      if (!user.value) {
        const authError: AuthError = {
          message: 'Usuário não autenticado',
          code: 'USER_NOT_AUTHENTICATED'
        }
        
        showError('Você precisa estar logado para alterar o nome')
        
        return { success: false, error: authError }
      }
      
      // @ts-ignore - RPC call para atualizar nome
      const { data, error } = await supabase.rpc('ag_update_nome_profile', {
        novo_nome: novoNome
      })
      
      if (error) {
        const authError: AuthError = {
          message: error.message,
          code: error.message
        }
        
        // Exibe toast de erro
        showError('Erro ao alterar nome: ' + error.message)
        
        return { success: false, error: authError }
      }
      
      // Assumindo sucesso se não há erro (a RPC foi executada com sucesso)
      // Toast de sucesso
      showSuccess('Nome alterado com sucesso!')
      
      return { success: true }
      
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      }
      
      showError('Erro inesperado ao alterar nome')
      
      return { success: false, error: authError }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Envia um email para recuperação de senha
   */
  const recoverPassword = async (email: string): Promise<AuthResult> => {
    try {
      isLoading.value = true
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/recuperar-senha`
      })
      
      if (error) {
        const authError: AuthError = {
          message: error.message,
          code: error.message
        }
        
        // Exibe toast de erro
        showError('Erro ao enviar email de recuperação: ' + error.message)
        
        return { success: false, error: authError }
      }
      
      // Sucesso - não exibe toast aqui pois será exibido via modal
      return { success: true }
      
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      }
      
      showError('Erro inesperado ao enviar email de recuperação')
      
      return { success: false, error: authError }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  const isAuthenticated = computed(() => !!user.value)
  
  /**
   * Dados do usuário atual
   */
  const currentUser = computed(() => user.value)
  
  /**
   * Verifica se o usuário é admin chamando a RPC do Supabase
   */
  const checkIsAdmin = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('ag_isadmin')
      
      if (error) {
        console.error('Erro ao verificar se é admin:', error)
        return false
      }
      
      // A RPC retorna { isadmin: true/false }
      return (data as any)?.isadmin || false
    } catch (error) {
      console.error('Erro inesperado ao verificar admin:', error)
      return false
    }
  }
  
  return {
    // Estados
    isLoading: readonly(isLoading),
    isAuthenticated,
    currentUser,
    
    // Ações
    login,
    logout,
    updatePassword,
    updateUserName,
    recoverPassword,
    checkIsAdmin,
  }
}
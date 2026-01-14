import { defineStore } from 'pinia'
import type { UserProfile, UserState } from '../../shared/types/database'

/**
 * Store do usuário - gerencia perfil e estado do usuário autenticado
 * Integrado com tabela ag_profiles do Supabase usando RLS
 */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    isLoading: (state) => state.loading,
    userProfile: (state) => state.profile,
    userName: (state) => state.profile?.nome || null,
    userRole: (state) => state.profile?.role || 'user',
    hasError: (state) => !!state.error
  },

  actions: {
    async fetchProfile() {
      // @ts-ignore - useSupabaseClient é auto-importado pelo Nuxt
      if (typeof useSupabaseClient === 'undefined') {
        console.error('useSupabaseClient não disponível')
        return
      }

      this.loading = true
      this.error = null

      try {
        // @ts-ignore
        const supabase = useSupabaseClient()
        
        // Busca o perfil do usuário na tabela ag_profiles
        // Não precisa de filtro pois a RLS já está configurada
        const { data, error } = await supabase
          .from('ag_profiles')
          .select('*')
          .single()

        if (error) {
          // Se perfil não existe (código PGRST116), não é erro crítico
          if (error.code === 'PGRST116') {
            this.profile = null
            return
          }
          throw error
        }

        // Validação básica dos dados antes de salvar
        if (data && typeof data === 'object') {
          this.profile = data as UserProfile
        } else {
          throw new Error('Dados do perfil inválidos')
        }
      } catch (error: any) {
        this.error = error.message || 'Erro ao buscar perfil do usuário'
        console.error('Erro ao buscar perfil:', error)
      } finally {
        this.loading = false
      }
    },

    async updateProfile(updateData: Partial<UserProfile>) {
      // @ts-ignore - useSupabaseClient é auto-importado pelo Nuxt
      if (typeof useSupabaseClient === 'undefined') {
        console.error('useSupabaseClient não disponível')
        return
      }

      this.loading = true
      this.error = null

      try {
        // @ts-ignore
        const supabase = useSupabaseClient()
        
        // Validação: usuário deve ter perfil para atualizar
        if (!this.profile?.id) {
          throw new Error('Perfil não encontrado para atualização')
        }

        // Atualiza o perfil do usuário
        const { error } = await supabase
          .from('ag_profiles')
          // @ts-ignore - Contorna problema de tipagem do Supabase com .update()
          .update(updateData)
          .eq('id', this.profile.id)

        if (error) {
          throw error
        }

        // Atualiza o estado local apenas se a operação foi bem-sucedida
        this.profile = { ...this.profile, ...updateData }
      } catch (error: any) {
        this.error = error.message || 'Erro ao atualizar perfil do usuário'
        console.error('Erro ao atualizar perfil:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Limpa o perfil do usuário (usado no logout)
     */
    clearProfile() {
      this.profile = null
      this.error = null
      this.loading = false
    }
  }
})
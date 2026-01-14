import type { Profissional } from '../../shared/types/database'
import { useProfissionais } from './useProfissionais'

// Estado global do profissional ativo
const profissionalAtivo = ref<Profissional | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const forceReload = ref(0) // Trigger para forçar recarga

export const useProfissionalAtivo = () => {
  const userStore = useUserStore()
  const { buscarProfissionais } = useProfissionais()

  /**
   * Carrega e define o profissional ativo
   * Prioriza o profissional associado ao usuário logado
   */
  const carregarProfissionalAtivo = async () => {
    loading.value = true
    error.value = null

    try {
      const profissionais = await buscarProfissionais()
      
      if (profissionais.length === 0) {
        profissionalAtivo.value = null
        return
      }

      // Se o usuário está logado, buscar pelo profile_id
      if (userStore.userProfile?.id) {
        const profissionalLogado = profissionais.find(
          prof => prof.profile_id === userStore.userProfile?.id
        )
        
        if (profissionalLogado) {
          profissionalAtivo.value = profissionalLogado
          return
        }
      }

      // Se não encontrou ou não está logado, usa o primeiro da lista
      profissionalAtivo.value = profissionais[0] || null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar profissional ativo'
      console.error('Erro ao carregar profissional ativo:', err)
      profissionalAtivo.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Define manualmente um profissional como ativo
   * Se for passado apenas um ID, busca os dados do profissional
   */
  const definirProfissionalAtivo = async (profissional: Profissional | number | null) => {
    if (typeof profissional === 'number') {
      // Se foi passado um ID, buscar os dados do profissional
      try {
        const profissionais = await buscarProfissionais()
        const profissionalEncontrado = profissionais.find(p => p.profissional_id === profissional)
        profissionalAtivo.value = profissionalEncontrado || null
      } catch (error) {
        console.error('Erro ao buscar profissional por ID:', error)
        profissionalAtivo.value = null
      }
    } else {
      // Se foi passado um objeto ou null, definir diretamente
      profissionalAtivo.value = profissional
    }
  }

  /**
   * Força recarregamento do profissional ativo
   * Útil quando há mudanças externas no estado
   */
  const recarregarProfissionalAtivo = () => {
    forceReload.value++
  }

  // Carregar profissional automaticamente em várias situações
  watchEffect(async () => {
    // Observar: usuário logado, force reload trigger
    const shouldLoad = userStore.userProfile?.id || forceReload.value > 0
    
    if (shouldLoad) {
      await carregarProfissionalAtivo()
    } else if (!userStore.userProfile?.id) {
      // Se não há usuário logado, limpar o profissional ativo
      profissionalAtivo.value = null
    }
  })

  // Detectar mudanças externas no estado (ex: via DevTools) - APENAS NO CLIENTE
  if (process.dev && process.client) {
    let ultimoProfissionalId = profissionalAtivo.value?.profissional_id || null
    
    setInterval(() => {
      const atualProfissionalId = profissionalAtivo.value?.profissional_id || null
      
      // Se houve mudança externa, recarregar
      if (ultimoProfissionalId !== atualProfissionalId) {
        console.log('🔍 Mudança externa detectada no profissional ativo')
        ultimoProfissionalId = atualProfissionalId
        // Força recarga dos agendamentos dependentes
        forceReload.value++
      }
    }, 1000) // Verificar a cada 1 segundo
  }

  // Observar mudanças diretas no profissional ativo para debugging
  if (process.dev) {
    watch(profissionalAtivo, (novoProfissional, antigoProfilessional) => {
      if (novoProfissional?.profissional_id !== antigoProfilessional?.profissional_id) {
        console.log('🔄 Profissional ativo alterado:', {
          anterior: antigoProfilessional?.nome_profissional || 'Nenhum',
          novo: novoProfissional?.nome_profissional || 'Nenhum',
          id: novoProfissional?.profissional_id || null
        })
      }
    })
  }

  // Disponibilizar função global para testes (apenas em desenvolvimento E no cliente)
  if (process.dev && process.client && typeof window !== 'undefined') {
    // @ts-ignore
    window.trocarProfissional = async (profissionalId: number) => {
      console.log(`🔧 Mudando profissional para ID: ${profissionalId}`)
      await definirProfissionalAtivo(profissionalId)
    }
    
    // @ts-ignore
    window.profissionalAtual = () => {
      console.log('👤 Profissional atual:', profissionalAtivo.value)
      return profissionalAtivo.value
    }
  }

  return {
    profissionalAtivo, // Remover readonly para permitir reatividade
    loading: readonly(loading),
    error: readonly(error),
    carregarProfissionalAtivo,
    definirProfissionalAtivo,
    recarregarProfissionalAtivo
  }
}
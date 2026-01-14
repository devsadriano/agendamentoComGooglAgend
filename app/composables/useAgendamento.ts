import type { Agendamento, AgendamentoCompleto } from '../../shared/types/database'

// Cache global de agendamentos por profissional e período
type CacheKey = string // formato: "profissional_id:YYYY-MM-DD:YYYY-MM-DD"
const cacheAgendamentos = new Map<CacheKey, Agendamento[]>()

export const useAgendamento = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Gera chave de cache baseada no profissional e período
   */
  const gerarChaveCache = (profissionalId: number, dataInicio: string, dataFim: string): CacheKey => {
    return `${profissionalId}:${dataInicio}:${dataFim}`
  }

  /**
   * Busca agendamentos por profissional em um período específico
   * Filtra apenas agendamentos não cancelados (cancelado = false)
   * Implementa cache para evitar requisições desnecessárias
   * @param profissionalId - ID do profissional
   * @param dataInicio - Data de início no formato YYYY-MM-DD
   * @param dataFim - Data de fim no formato YYYY-MM-DD
   * @returns Lista de agendamentos do profissional no período
   */
  const buscarAgendamentosPorProfissionalEPeriodo = async (
    profissionalId: number, 
    dataInicio: string, 
    dataFim: string
  ): Promise<Agendamento[]> => {
    // Verificar cache primeiro
    const chaveCache = gerarChaveCache(profissionalId, dataInicio, dataFim)
    if (cacheAgendamentos.has(chaveCache)) {
      console.log('📦 Cache hit:', chaveCache)
      return cacheAgendamentos.get(chaveCache)!
    }

    loading.value = true
    error.value = null

    try {
      const supabase = useSupabaseClient()
      
      const { data, error: fetchError } = await supabase
        .from('ag_agendamentos')
        .select('*')
        .eq('profissional_id', profissionalId)
        .eq('cancelado', false)
        .gte('data', dataInicio) // maior ou igual à data de início
        .lte('data', dataFim)    // menor ou igual à data de fim
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      const agendamentos = data || []
      
      // Armazenar no cache
      cacheAgendamentos.set(chaveCache, agendamentos)
      console.log('💾 Cache armazenado:', chaveCache, `${agendamentos.length} agendamentos`)

      return agendamentos
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar agendamentos'
      console.error('Erro ao buscar agendamentos:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Função legada - mantida para compatibilidade
   * @deprecated Use buscarAgendamentosPorProfissionalEPeriodo
   */
  const buscarAgendamentosPorProfissional = async (profissionalId: number): Promise<Agendamento[]> => {
    loading.value = true
    error.value = null

    try {
      const supabase = useSupabaseClient()
      
      const { data, error: fetchError } = await supabase
        .from('ag_agendamentos')
        .select('*')
        .eq('profissional_id', profissionalId)
        .eq('cancelado', false)
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      return data || []
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar agendamentos'
      console.error('Erro ao buscar agendamentos:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpa o cache de um profissional específico
   */
  const limparCacheProfissional = (profissionalId: number) => {
    const chavesParaRemover = Array.from(cacheAgendamentos.keys())
      .filter(chave => chave.startsWith(`${profissionalId}:`))
    
    chavesParaRemover.forEach(chave => {
      cacheAgendamentos.delete(chave)
    })
    
    console.log('🗑️ Cache limpo para profissional:', profissionalId)
  }

  /**
   * Limpa todo o cache
   */
  const limparTodoCache = () => {
    cacheAgendamentos.clear()
    console.log('🗑️ Todo cache limpo')
  }

  /**
   * Converte horário para formato GMT-3 (Brasil)
   */
  const converterHorarioParaGMT3 = (hora: string): string => {
    // Adicionar segundos se não estiver presente
    let horarioCompleto = hora
    if (hora.split(':').length === 2) {
      horarioCompleto = `${hora}:00`
    }
    
    // Adicionar timezone GMT-3
    const horarioGMT3 = `${horarioCompleto}-03:00`
    console.log('🕒 Convertendo:', hora, '→', horarioGMT3)
    
    return horarioGMT3
  }

  /**
   * Insere um novo agendamento no banco de dados
   * @param agendamento - Dados do agendamento a ser inserido
   * @returns O agendamento criado com ID gerado pelo Supabase
   */
  const inserirAgendamento = async (agendamento: {
    profissional_id: number
    cliente_id: number
    data: string
    hora_inicio: string
    hora_fim: string
    titulo: string
    descricao?: string
    cor?: string
  }): Promise<Agendamento | null> => {
    loading.value = true
    error.value = null

    try {
      const supabase = useSupabaseClient<any>()
      
      // Converter horários para GMT-3
      const horaInicioGMT3 = converterHorarioParaGMT3(agendamento.hora_inicio)
      const horaFimGMT3 = converterHorarioParaGMT3(agendamento.hora_fim)
      
      // Dados para inserção (user_id será inserido automaticamente pelo RLS)
      const dadosParaInserir = {
        profissional_id: agendamento.profissional_id,
        cliente_id: agendamento.cliente_id,
        data: agendamento.data,
        hora_inicio: horaInicioGMT3,
        hora_fim: horaFimGMT3,
        titulo: agendamento.titulo,
        descricao: agendamento.descricao || null,
        cor: agendamento.cor || '#DBE9FE',
        cancelado: false
      }

      console.log('📝 Inserindo agendamento com horários GMT-3:', dadosParaInserir)
      console.log('🕐 Horário original início:', agendamento.hora_inicio)
      console.log('🕐 Horário original fim:', agendamento.hora_fim)
      console.log('🌍 Horário GMT-3 início:', horaInicioGMT3)
      console.log('🌍 Horário GMT-3 fim:', horaFimGMT3)

      const { data, error: insertError } = await supabase
        .from('ag_agendamentos')
        .insert(dadosParaInserir)
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      console.log('✅ Agendamento inserido com sucesso:', data)

      // Limpar cache do profissional afetado para forçar nova busca
      limparCacheProfissional(agendamento.profissional_id)

      return data as Agendamento
    } catch (err: any) {
      error.value = err.message || 'Erro ao inserir agendamento'
      console.error('❌ Erro ao inserir agendamento:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Edita um agendamento existente (apenas título, descrição e cor)
   * @param id - ID do agendamento
   * @param dados - Dados a serem atualizados
   * @returns O agendamento atualizado
   */
  const editarAgendamento = async (id: number, dados: {
    titulo: string
    descricao?: string | null
    cor: string
  }): Promise<Agendamento | null> => {
    loading.value = true
    error.value = null

    try {
      const supabase = useSupabaseClient<any>()
      
      const dadosParaAtualizar = {
        titulo: dados.titulo,
        descricao: dados.descricao,
        cor: dados.cor
      }

      console.log('📝 Editando agendamento ID:', id, dadosParaAtualizar)

      const { data, error: updateError } = await supabase
        .from('ag_agendamentos')
        .update(dadosParaAtualizar)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      console.log('✅ Agendamento editado com sucesso:', data)

      // Limpar cache do profissional afetado para forçar nova busca
      if (data.profissional_id) {
        limparCacheProfissional(data.profissional_id)
      }

      return data as Agendamento
    } catch (err: any) {
      error.value = err.message || 'Erro ao editar agendamento'
      console.error('❌ Erro ao editar agendamento:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Cancela um agendamento (marca como cancelado e define data de cancelamento)
   * @param id - ID do agendamento
   * @returns O agendamento cancelado
   */
  const cancelarAgendamento = async (id: number): Promise<Agendamento | null> => {
    loading.value = true
    error.value = null

    try {
      const supabase = useSupabaseClient<any>()
      
      const dadosParaCancelar = {
        cancelado: true,
        cancelado_as: new Date().toISOString()
      }

      console.log('🚫 Cancelando agendamento ID:', id)

      const { data, error: updateError } = await supabase
        .from('ag_agendamentos')
        .update(dadosParaCancelar)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      console.log('✅ Agendamento cancelado com sucesso:', data)

      // Limpar cache do profissional afetado para forçar nova busca
      if (data.profissional_id) {
        limparCacheProfissional(data.profissional_id)
      }

      return data as Agendamento
    } catch (err: any) {
      error.value = err.message || 'Erro ao cancelar agendamento'
      console.error('❌ Erro ao cancelar agendamento:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca relatório completo de agendamentos com informações de cliente e profissional
   * @param filtros - Filtros opcionais para a busca
   * @returns Lista de agendamentos completos
   */
  const buscarRelatorioAgendamentos = async (filtros?: {
    profissionalId?: number
    clienteId?: number
    dataInicio?: string
    dataFim?: string
    incluirCancelados?: boolean
  }): Promise<AgendamentoCompleto[]> => {
    loading.value = true
    error.value = null

    try {
      const supabase = useSupabaseClient<any>()
      
      console.log('📊 Buscando relatório de agendamentos via RPC com filtros:', filtros)

      // Usar RPC function para buscar agendamentos completos
      const { data, error: fetchError } = await supabase
        .rpc('ag_get_agendamentos_completos')

      if (fetchError) {
        throw fetchError
      }

      let agendamentos = data || []

      // Aplicar filtros localmente se fornecidos
      if (filtros) {
        if (filtros.profissionalId) {
          agendamentos = agendamentos.filter((ag: AgendamentoCompleto) => 
            ag.profissional_id === filtros.profissionalId
          )
        }
        
        if (filtros.clienteId) {
          agendamentos = agendamentos.filter((ag: AgendamentoCompleto) => 
            ag.cliente_id === filtros.clienteId
          )
        }
        
        if (filtros.dataInicio) {
          agendamentos = agendamentos.filter((ag: AgendamentoCompleto) => 
            ag.data && ag.data >= filtros.dataInicio!
          )
        }
        
        if (filtros.dataFim) {
          agendamentos = agendamentos.filter((ag: AgendamentoCompleto) => 
            ag.data && ag.data <= filtros.dataFim!
          )
        }
        
        // Aplicar filtro de cancelados apenas se especificado
        if (filtros.incluirCancelados === false) {
          agendamentos = agendamentos.filter((ag: AgendamentoCompleto) => 
            !ag.cancelado
          )
        }
        // Se incluirCancelados for true ou undefined, mostrar todos
      }
      // Se nenhum filtro fornecido, mostrar TODOS os agendamentos (incluindo cancelados)

      // Ordenar por data mais recente primeiro, depois por horário mais recente
      agendamentos.sort((a: AgendamentoCompleto, b: AgendamentoCompleto) => {
        // Verificar se as datas existem
        if (!a.data || !b.data) return 0
        if (a.data !== b.data) {
          // Ordenação decrescente (mais recente primeiro)
          return b.data.localeCompare(a.data)
        }
        // Verificar se os horários existem - para a mesma data, mais recente primeiro
        if (!a.hora_inicio || !b.hora_inicio) return 0
        return b.hora_inicio.localeCompare(a.hora_inicio)
      })

      console.log('📈 Relatório carregado:', `${agendamentos.length} agendamentos encontrados`)

      return agendamentos as AgendamentoCompleto[]
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar relatório de agendamentos'
      console.error('❌ Erro ao buscar relatório de agendamentos:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    buscarAgendamentosPorProfissionalEPeriodo,
    buscarAgendamentosPorProfissional, // mantido para compatibilidade
    limparCacheProfissional,
    limparTodoCache,
    inserirAgendamento,
    editarAgendamento,
    cancelarAgendamento,
    buscarRelatorioAgendamentos
  }
}
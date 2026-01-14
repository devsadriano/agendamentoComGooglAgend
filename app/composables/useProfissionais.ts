import type { Especialidade, Profissional, Perfil, Cliente } from '../../shared/types/database'

// Tipo para o retorno da função de inserir
interface ApiResponse {
  success: boolean
  message: string
}

export const useProfissionais = () => {
  const supabase = useSupabaseClient()

  // Buscar perfis
  const buscarPerfis = async (): Promise<Perfil[]> => {
    try {
      const { data, error } = await supabase
        .rpc('ag_get_profiles_if_admin')

      if (error) {
        console.error('Erro ao buscar perfis:', error)
        throw error
      }

      return data || []

    } catch (error) {
      console.error('Erro ao buscar perfis:', error)
      throw error
    }
  }

  // Buscar profissionais
  const buscarProfissionais = async (): Promise<Profissional[]> => {
    try {
      const { data, error } = await supabase
        .rpc('ag_get_profissionais')

      if (error) {
        console.error('Erro ao buscar profissionais:', error)
        throw error
      }

      return data || []

    } catch (error) {
      console.error('Erro ao buscar profissionais:', error)
      throw error
    }
  }

  // Buscar especialidades
  const buscarEspecialidades = async (): Promise<Especialidade[]> => {
    try {
      const { data, error } = await supabase
        .from('ag_especialidades')
        .select('id, nome_espec')
        .order('nome_espec')

      if (error) {
        console.error('Erro ao buscar especialidades:', error)
        throw error
      }

      // Mapear nome_espec para nome conforme o tipo
      return data?.map((item: any) => ({
        id: item.id,
        nome: item.nome_espec
      })) || []

    } catch (error) {
      console.error('Erro ao buscar especialidades:', error)
      throw error
    }
  }

  // Inserir profissional
  const inserirProfissional = async (profile_id: number, especialidade_id: number): Promise<void> => {
    try {
      const { error } = await (supabase as any)
        .from('ag_profissionais')
        .insert({
          profile_id,
          especialidade_id
        })

      if (error) {
        console.error('Erro ao inserir profissional:', error)
        throw error
      }

    } catch (error) {
      console.error('Erro ao inserir profissional:', error)
      throw error
    }
  }

  // Editar profissional
  const editarProfissional = async (profissional_id: number, profile_id: number, especialidade_id: number): Promise<void> => {
    try {
      const { error } = await (supabase as any)
        .from('ag_profissionais')
        .update({
          profile_id,
          especialidade_id
        })
        .eq('id', profissional_id)

      if (error) {
        console.error('Erro ao editar profissional:', error)
        throw error
      }

    } catch (error) {
      console.error('Erro ao editar profissional:', error)
      throw error
    }
  }

  // Deletar profissional
  const deletarProfissional = async (profissional_id: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('ag_profissionais')
        .delete()
        .eq('id', profissional_id)

      if (error) {
        console.error('Erro ao deletar profissional:', error)
        throw error
      }

    } catch (error) {
      console.error('Erro ao deletar profissional:', error)
      throw error
    }
  }

  // Inserir especialidade
  const inserirEspecialidade = async (nome: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .rpc('ag_add_especialidade', {
          p_nome: nome
        } as any)

      if (error) {
        console.error('Erro ao inserir especialidade:', error)
        throw error
      }

      return data as ApiResponse

    } catch (error) {
      console.error('Erro ao inserir especialidade:', error)
      throw error
    }
  }

  // Editar especialidade
  const editarEspecialidade = async (id: number, nome: string): Promise<ApiResponse> => {
    try {
      const { data, error } = await supabase
        .rpc('ag_update_especialidade', {
          p_id: id,
          p_nome: nome
        } as any)

      if (error) {
        console.error('Erro ao editar especialidade:', error)
        throw error
      }

      return data as ApiResponse

    } catch (error) {
      console.error('Erro ao editar especialidade:', error)
      throw error
    }
  }

  // Deletar especialidade
  const deletarEspecialidade = async (id: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('ag_especialidades')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar especialidade:', error)
        throw error
      }

    } catch (error) {
      console.error('Erro ao deletar especialidade:', error)
      throw error
    }
  }

  // Buscar clientes
  const buscarClientes = async (): Promise<Cliente[]> => {
    try {
      const { data, error } = await supabase
        .from('ag_clientes')
        .select('*')
        .order('nome_cliente')

      if (error) {
        console.error('Erro ao buscar clientes:', error)
        throw error
      }

      return data || []

    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      throw error
    }
  }

  // Inserir cliente
  const inserirCliente = async (
    nome_cliente: string, 
    cpf: string, 
    endereco?: string | null, 
    email?: string | null, 
    telefone?: string | null
  ): Promise<void> => {
    try {
      const { error } = await (supabase as any)
        .from('ag_clientes')
        .insert({
          nome_cliente,
          cpf,
          endereco,
          email,
          telefone
        })

      if (error) {
        console.error('Erro ao inserir cliente:', error)
        throw error
      }

    } catch (error) {
      console.error('Erro ao inserir cliente:', error)
      throw error
    }
  }

  // Editar cliente
  const editarCliente = async (
    id: number,
    nome_cliente: string, 
    cpf: string, 
    endereco?: string | null, 
    email?: string | null, 
    telefone?: string | null
  ): Promise<void> => {
    try {
      const { error } = await (supabase as any)
        .from('ag_clientes')
        .update({
          nome_cliente,
          cpf,
          endereco,
          email,
          telefone
        })
        .eq('id', id)

      if (error) {
        console.error('Erro ao editar cliente:', error)
        throw error
      }

    } catch (error) {
      console.error('Erro ao editar cliente:', error)
      throw error
    }
  }

  // Deletar cliente
  const deletarCliente = async (id: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('ag_clientes')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar cliente:', error)
        throw error
      }

    } catch (error) {
      console.error('Erro ao deletar cliente:', error)
      throw error
    }
  }

  return {
    buscarPerfis,
    buscarProfissionais,
    buscarEspecialidades,
    buscarClientes,
    inserirCliente,
    editarCliente,
    deletarCliente,
    inserirProfissional,
    editarProfissional,
    deletarProfissional,
    inserirEspecialidade,
    editarEspecialidade,
    deletarEspecialidade
  }
}
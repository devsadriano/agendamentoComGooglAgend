// Tipos para o perfil do usuário baseado na tabela ag_profiles
export interface UserProfile {
  id: number
  created_at: string
  user_id: string | null
  nome: string | null
  role: string | null
}

// Estado do store do usuário
export interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

// Tipos para especialidades baseado na tabela ag_especialidades
export interface Especialidade {
  id: number
  nome: string
}

// Tipos para profissionais baseado no retorno da RPC ag_get_profissionais
export interface Profissional {
  profissional_id: number
  profile_id: number
  especialidade_id: number
  nome_profissional: string
  especialidade_profissional: string
}

// Tipos para perfis baseado no retorno da RPC ag_get_profiles_if_admin
export interface Perfil {
  id: number
  created_at: string
  user_id: string | null
  nome: string | null
  role: string | null
  email: string | null
}

// Tipos para clientes baseado na tabela ag_clientes
export interface Cliente {
  id: number
  created_at: string
  cpf: string | null
  nome_cliente: string | null
  endereco: string | null
  email: string | null
  telefone: string | null
}

// Tipos para as actions do store
export interface UserActions {
  fetchProfile(): Promise<void>
  updateProfile(data: Partial<UserProfile>): Promise<void>
  clearProfile(): void
}

// Tipos para dia da semana no contexto de agendamentos
export interface DiaSemana {
  data: Date
  diaSemana: string
  diaNumero: number
  mesAno: string
}

// Tipos para agendamentos baseado na tabela ag_agendamentos
export interface Agendamento {
  id: number
  created_at: string
  user_id: string | null
  profissional_id: number | null
  cliente_id: number | null
  data: string | null
  hora_inicio: string | null
  hora_fim: string | null
  titulo: string | null
  descricao: string | null
  cancelado: boolean | null
  cancelado_as: string | null
  cor: string | null
}

// Estado do store de agendamentos
export interface AgendamentoState {
  dataReferencia: Date
  loading: boolean
  error: string | null
}

// Tipos para relatório completo de agendamentos baseado na RPC ag_get_agendamentos_completos
export interface AgendamentoCompleto {
  agendamento_id: number
  created_at: string
  user_id: string | null
  data: string | null
  hora_inicio: string | null
  hora_fim: string | null
  titulo: string | null
  descricao: string | null
  cancelado: boolean | null
  cancelado_as: string | null
  cor: string | null
  cliente_id: number | null
  nome_cliente: string | null
  cpf_cliente: string | null
  email_cliente: string | null
  telefone_cliente: string | null
  profissional_id: number | null
  profile_id: number | null
  nome_profissional: string | null
  especialidade_id: number | null
  especialidade_profissional: string | null
}
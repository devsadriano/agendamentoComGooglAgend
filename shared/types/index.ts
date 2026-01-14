// Re-export dos tipos de autenticação para facilitar imports
export * from './auth'

// Tipos globais do projeto podem ser adicionados aqui
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
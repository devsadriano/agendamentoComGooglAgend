export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}

export interface AuthResult {
  success: boolean
  error?: AuthError
}

export interface User {
  id: string
  email?: string
  created_at?: string
  updated_at?: string
  [key: string]: any
}
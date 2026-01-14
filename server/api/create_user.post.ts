import { createError, readBody } from 'h3'
import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from '#supabase/server'
import type { Database } from '../../types/database.types'

// Payload esperado na requisicao
type CreateUserBody = {
  email?: string
  password?: string
  nome?: string
  role?: string
}

// Rota: cria usuario no Auth e perfil na tabela ag_profiles
export default defineEventHandler(async (event) => {
  // Verifica sessao do usuario atual
  const authUser = await serverSupabaseUser(event)
  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Usuario nao autenticado',
    })
  }

  // Confirma permissao de admin via RPC (evita filtro por user_id undefined)
  const supabaseClient = await serverSupabaseClient<Database>(event)
  const { data: isAdminData, error: isAdminError } = await (supabaseClient as any).rpc(
    'ag_isadmin'
  )

  if (isAdminError) {
    throw createError({
      statusCode: 500,
      statusMessage: isAdminError.message,
    })
  }

  if (!(isAdminData as any)?.isadmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado',
    })
  }

  // Leitura e normalizacao do body
  const body = (await readBody<CreateUserBody>(event)) ?? {}
  const email = body.email?.trim()
  const password = body.password
  const nome = body.nome?.trim()
  const role = body.role?.trim() || 'user'

  // Validacao minima de entrada
  if (!email || !password || !nome) {
    throw createError({
      statusCode: 400,
      statusMessage: 'email, password e nome sao obrigatorios',
    })
  }

  console.log('[create_user] request', { email, nome, role })

  // Cliente admin com service role
  const supabase = await serverSupabaseServiceRole<Database>(event)

  // Cria usuario no Auth (email confirmado automaticamente)
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  console.log('[create_user] createUser result', {
    userId: userData?.user?.id,
    hasUser: !!userData?.user,
    error: userError?.message,
  })

  // Falha ao criar o usuario no Auth
  if (userError || !userData?.user) {
    throw createError({
      statusCode: 500,
      statusMessage: userError?.message || 'Erro ao criar usuario',
    })
  }

  const createdUserId = userData.user.id
  if (!createdUserId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao criar usuario: user_id ausente',
    })
  }

  // Insere o perfil vinculado ao user_id criado
  console.log('[create_user] insert profile', { user_id: createdUserId })
  const { error: profileError } = await supabase.from('ag_profiles').insert({
    nome,
    email,
    role,
    user_id: createdUserId,
  })

  // Falha ao criar o perfil
  if (profileError) {
    console.error('[create_user] profile insert error', {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
    })
    await supabase.auth.admin.deleteUser(createdUserId)
    throw createError({
      statusCode: 500,
      statusMessage: profileError.message,
    })
  }

  // Retorna apenas o identificador do usuario criado
  return { user_id: userData.user.id }
})

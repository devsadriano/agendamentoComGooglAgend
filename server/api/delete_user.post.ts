import { createError, readBody } from 'h3'
import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from '#supabase/server'
import type { Database } from '../../types/database.types'

type DeleteUserBody = {
  user_id?: string
}

// Rota: deleta usuario no Auth e perfil na tabela ag_profiles
export default defineEventHandler(async (event) => {
  const authUser = await serverSupabaseUser(event)
  if (!authUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Usuario nao autenticado',
    })
  }

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

  const body = (await readBody<DeleteUserBody>(event)) ?? {}
  const userId = body.user_id?.trim()

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'user_id e obrigatorio',
    })
  }

  const supabase = await serverSupabaseServiceRole<Database>(event)

  const { error: profileError } = await supabase
    .from('ag_profiles')
    .delete()
    .eq('user_id', userId)

  if (profileError) {
    throw createError({
      statusCode: 500,
      statusMessage: profileError.message,
    })
  }

  const { error: authError } = await supabase.auth.admin.deleteUser(userId)

  if (authError) {
    throw createError({
      statusCode: 500,
      statusMessage: authError.message,
    })
  }

  return { success: true }
})

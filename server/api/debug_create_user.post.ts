import { readBody, getRequestHeaders } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const headers = getRequestHeaders(event)

  console.log('[debug_create_user] headers', headers)
  console.log('[debug_create_user] body', body)

  return { ok: true }
})

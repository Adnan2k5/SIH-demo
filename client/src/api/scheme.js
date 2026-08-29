import client from './client'

export const recommendScheme = (payload) =>
  client.post('/scheme/route', payload).then((r) => r.data)

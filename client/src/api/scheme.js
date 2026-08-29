import client from './client'

export const recommendScheme = (payload) =>
  client.post('/scheme/recommend', payload).then((r) => r.data)

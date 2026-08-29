import client from './client'

export const analyzeAdvisory = (payload) =>
  client.post('/advisory/analyze', payload).then((r) => r.data)

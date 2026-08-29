import client from './client'

export const calculateFinance = (payload) =>
  client.post('/finance/calculate', payload).then((r) => r.data)

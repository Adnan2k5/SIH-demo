import client from './client'

export const generateReport = (payload) =>
  client
    .post('/report/generate', payload, { responseType: 'blob' })
    .then((r) => r.data)

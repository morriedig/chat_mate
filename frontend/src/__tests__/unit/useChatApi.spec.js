import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

function jsonResponse(data) {
  return Promise.resolve({ json: () => Promise.resolve(data) })
}

async function requestTokenUrl(apiUrl) {
  vi.resetModules()
  vi.stubEnv('VITE_API_URL', apiUrl)
  const fetchMock = vi.fn(() => jsonResponse({ success: true, token: 'token-1' }))
  vi.stubGlobal('fetch', fetchMock)
  const { requestAuthToken } = await import('../../composables/useChatApi')
  await requestAuthToken()
  return new URL(fetchMock.mock.calls[0][0])
}

describe('useChatApi token request', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('chatmate_clientId', 'client_abc')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('sends the stored clientId to Apps Script', async () => {
    const url = await requestTokenUrl('https://script.google.com/macros/s/test/exec')
    expect(url.searchParams.get('action')).toBe('token')
    expect(url.searchParams.get('clientId')).toBe('client_abc')
  })

  it('sends the stored clientId to the Node server', async () => {
    const url = await requestTokenUrl('http://localhost:3000/chat')
    expect(url.pathname).toBe('/token')
    expect(url.searchParams.get('clientId')).toBe('client_abc')
  })
})

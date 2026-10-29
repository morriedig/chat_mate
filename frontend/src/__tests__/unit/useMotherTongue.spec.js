import { describe, it, expect, vi, beforeEach } from 'vitest'

async function load() {
  vi.resetModules()
  return import('../../composables/useMotherTongue')
}

describe('useMotherTongue', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('hides Japanese from the language list', async () => {
    const { supportedLanguages } = await load()

    expect(supportedLanguages.map(l => l.id)).toEqual(['en', 'zh'])
  })

  it('falls back to English when the saved language is hidden', async () => {
    localStorage.setItem('chatmate_motherTongue', 'ja')
    const { useMotherTongue } = await load()

    expect(useMotherTongue().motherTongue.value).toBe('en')
  })

  it('keeps a saved visible language', async () => {
    localStorage.setItem('chatmate_motherTongue', 'zh')
    const { useMotherTongue } = await load()

    expect(useMotherTongue().motherTongue.value).toBe('zh')
  })
})

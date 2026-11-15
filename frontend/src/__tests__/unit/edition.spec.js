import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { editionBuild, transformIndexHtml, resolveEdition } from '../../../editionBuild.js'
import { landingPageUrl } from '../../utils/landingPage'
import { zhEdition, enEdition } from '../helpers/editions'

// Tests run from frontend/
const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')

describe('edition build settings', () => {
  it('keeps the English app at /chat_mate/app/ with public/ and dist/', () => {
    expect(editionBuild('en', { githubPages: true })).toMatchObject({ base: '/chat_mate/app/', publicDir: 'public', outDir: 'dist' })
  })

  it('puts the Chinese app at /chat_mate/zh/app/ with its own public-zh/ and dist-zh/', () => {
    expect(editionBuild('zh', { githubPages: true })).toMatchObject({ base: '/chat_mate/zh/app/', publicDir: 'public-zh', outDir: 'dist-zh' })
  })

  it('serves both editions from / in local dev', () => {
    expect(editionBuild('zh').base).toBe('/')
  })

  it('treats a missing or unknown VITE_EDITION as English', () => {
    expect(resolveEdition(undefined)).toBe('en')
    expect(resolveEdition('fr')).toBe('en')
  })
})

describe('index.html per edition', () => {
  it('leaves index.html unchanged in the English build', () => {
    expect(transformIndexHtml(indexHtml, editionBuild('en'))).toBe(indexHtml)
  })

  it('uses the Chinese app name and description in the Chinese build', () => {
    const html = transformIndexHtml(indexHtml, editionBuild('zh'))
    expect(html).toContain('<title>Chat Mate 華語</title>')
    expect(html).toContain('<meta name="description" content="Learn Taiwan Mandarin by chatting with AI friends" />')
    expect(html).toContain('<link rel="apple-touch-icon" href="icons/apple-touch-icon.png" />')
  })
})

describe('landing page redirect', () => {
  it('sends the English app to the English landing page', () => {
    expect(landingPageUrl('https://example.github.io/chat_mate/app/#/chat')).toBe('https://example.github.io/chat_mate/')
  })

  it('sends the Chinese app to the Chinese landing page', () => {
    expect(landingPageUrl('https://example.github.io/chat_mate/zh/app/?x=1#/')).toBe('https://example.github.io/chat_mate/zh/')
  })
})

describe('edition test helpers', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it.each([['zh', zhEdition], ['en', enEdition]])('match what edition.js exports when built with VITE_EDITION=%s', async (value, helper) => {
    vi.stubEnv('VITE_EDITION', value)
    vi.resetModules()
    const { isFeatureEnabled, ...constants } = await import('../../edition')
    const { isFeatureEnabled: helperEnabled, ...helperConstants } = helper
    expect(helperConstants).toEqual(constants)
    const features = ['weeklyChapters', 'dailyOpinion', 'opinionChat', 'retell', 'articles', 'placementTest',
      'diary', 'dailyChallenge', 'roleplay', 'languageSwitch', 'dailyPractice', 'taskChat']
    expect(features.map(helperEnabled)).toEqual(features.map(isFeatureEnabled))
  })
})

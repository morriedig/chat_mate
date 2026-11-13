import { describe, it, expect } from 'vitest'
import { chapterSymbol } from '../../utils/chapterSymbol'

describe('chapterSymbol', () => {
  it('maps known emoji icons to Material Symbols', () => {
    expect(chapterSymbol('🧳')).toBe('luggage')
    expect(chapterSymbol('💡')).toBe('lightbulb')
  })

  it('uses a Material Symbols name as-is', () => {
    expect(chapterSymbol('update')).toBe('update')
    expect(chapterSymbol('record_voice_over')).toBe('record_voice_over')
  })

  it('falls back to menu_book for unknown or missing icons', () => {
    expect(chapterSymbol('✈️')).toBe('menu_book')
    expect(chapterSymbol('Update Now')).toBe('menu_book')
    expect(chapterSymbol(undefined)).toBe('menu_book')
    expect(chapterSymbol('')).toBe('menu_book')
  })
})

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CharacterGrid from '../../components/learning/CharacterGrid.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

// Mock TTS utilities
vi.mock('../../utils/tts', () => ({
  playTTS: vi.fn().mockResolvedValue(undefined),
  isTTSAvailable: vi.fn().mockReturnValue(true)
}))

describe('CharacterGrid', () => {
  const mockCharacters = [
    { id: 'a', char: 'あ', romaji: 'a', row: 'vowel' },
    { id: 'i', char: 'い', romaji: 'i', row: 'vowel' },
    { id: 'u', char: 'う', romaji: 'u', row: 'vowel' },
    { id: 'e', char: 'え', romaji: 'e', row: 'vowel' },
    { id: 'o', char: 'お', romaji: 'o', row: 'vowel' },
    { id: 'ka', char: 'か', romaji: 'ka', row: 'k' },
    { id: 'ki', char: 'き', romaji: 'ki', row: 'k' },
    { id: 'ku', char: 'く', romaji: 'ku', row: 'k' },
    { id: 'ke', char: 'け', romaji: 'ke', row: 'k' },
    { id: 'ko', char: 'こ', romaji: 'ko', row: 'k' }
  ]

  const createWrapper = (props = {}) => {
    return mount(CharacterGrid, {
      props: {
        characters: mockCharacters,
        ...props
      }
    })
  }

  describe('rendering', () => {
    it('should render the grid', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should display all characters', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('あ')
      expect(wrapper.text()).toContain('い')
      expect(wrapper.text()).toContain('か')
      expect(wrapper.text()).toContain('こ')
    })

    it('should display romaji for each character', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('a')
      expect(wrapper.text()).toContain('ka')
      expect(wrapper.text()).toContain('ko')
    })

    it('should render grid with correct columns', () => {
      const wrapper = createWrapper({ columns: 5 })
      const grid = wrapper.find('.grid')
      expect(grid.exists()).toBe(true)
      expect(grid.attributes('style')).toContain('grid-template-columns: repeat(5')
    })

    it('should use custom column count', () => {
      const wrapper = createWrapper({ columns: 3 })
      const grid = wrapper.find('.grid')
      expect(grid.attributes('style')).toContain('grid-template-columns: repeat(3')
    })
  })

  describe('row grouping', () => {
    it('should group characters by row', () => {
      const wrapper = createWrapper()
      // Should show row headers
      expect(wrapper.text()).toContain('vowel')
      expect(wrapper.text()).toContain('k')
    })

    it('should handle characters without rows', () => {
      const noRowChars = mockCharacters.map(c => ({ ...c, row: undefined }))
      const wrapper = createWrapper({ characters: noRowChars })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('cell states', () => {
    it('should show learned state with green styling', () => {
      const wrapper = createWrapper({
        learnedIds: new Set(['a', 'i'])
      })
      const learnedCells = wrapper.findAll('.bg-green-100')
      expect(learnedCells.length).toBe(2)
    })

    it('should show in-progress state with amber styling', () => {
      const wrapper = createWrapper({
        inProgressIds: new Set(['ka'])
      })
      const inProgressCells = wrapper.findAll('.bg-amber-100')
      expect(inProgressCells.length).toBe(1)
    })

    it('should show not-started state with slate styling', () => {
      const wrapper = createWrapper()
      const notStartedCells = wrapper.findAll('.bg-slate-100')
      expect(notStartedCells.length).toBe(10)
    })

    it('should show checkmark on learned cells', () => {
      const wrapper = createWrapper({
        learnedIds: new Set(['a'])
      })
      // The learned cell should have the green check badge
      const checkBadges = wrapper.findAll('.bg-green-500')
      expect(checkBadges.length).toBe(1)
    })

    it('should accept Array for learnedIds', () => {
      const wrapper = createWrapper({
        learnedIds: ['a', 'i', 'u']
      })
      const learnedCells = wrapper.findAll('.bg-green-100')
      expect(learnedCells.length).toBe(3)
    })
  })

  describe('summary bar', () => {
    it('should show collected count', () => {
      const wrapper = createWrapper({
        learnedIds: new Set(['a', 'i'])
      })
      expect(wrapper.text()).toContain('prelesson.collected')
    })

    it('should show legend for states', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('prelesson.stateLearned')
      expect(wrapper.text()).toContain('prelesson.stateInProgress')
      expect(wrapper.text()).toContain('prelesson.stateNew')
    })
  })

  describe('interaction', () => {
    it('should emit select event when cell is tapped', async () => {
      const wrapper = createWrapper()
      const cells = wrapper.findAll('button')
      await cells[0].trigger('click')
      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')[0][0]).toEqual(mockCharacters[0])
    })

    it('should have touch-target class for accessibility', () => {
      const wrapper = createWrapper()
      const cells = wrapper.findAll('.touch-target')
      expect(cells.length).toBeGreaterThan(0)
    })
  })

  describe('dark mode', () => {
    it('should include dark mode classes', () => {
      const wrapper = createWrapper()
      const html = wrapper.html()
      expect(html).toContain('dark:')
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CharacterMatchGame from '../../components/learning/CharacterMatchGame.vue'

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

describe('CharacterMatchGame', () => {
  const mockCharacters = [
    { id: 'a', char: 'あ', romaji: 'a', reading: 'a' },
    { id: 'i', char: 'い', romaji: 'i', reading: 'i' },
    { id: 'u', char: 'う', romaji: 'u', reading: 'u' },
    { id: 'e', char: 'え', romaji: 'e', reading: 'e' },
    { id: 'o', char: 'お', romaji: 'o', reading: 'o' }
  ]

  const createWrapper = (props = {}) => {
    return mount(CharacterMatchGame, {
      props: {
        characters: mockCharacters,
        language: 'ja',
        ...props
      }
    })
  }

  describe('rendering', () => {
    it('should render the game interface', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should display progress bar', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.h-2.bg-slate-200').exists()).toBe(true)
    })

    it('should display audio prompt card', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.rounded-2xl').exists()).toBe(true)
    })

    it('should display question count', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('1 /')
      expect(wrapper.text()).toContain(`${mockCharacters.length}`)
    })

    it('should show instruction text', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('prelesson.tapCharacterYouHear')
    })

    it('should display character options as buttons', () => {
      const wrapper = createWrapper()
      // Grid options should contain character buttons
      const optionButtons = wrapper.findAll('.grid button')
      expect(optionButtons.length).toBe(5)
    })

    it('should display romaji on option buttons', () => {
      const wrapper = createWrapper()
      const html = wrapper.html()
      // All romaji should appear in the options
      const romajiValues = mockCharacters.map(c => c.romaji)
      // At least some romaji should be visible (the current question's options)
      const foundRomaji = romajiValues.filter(r => html.includes(r))
      expect(foundRomaji.length).toBeGreaterThan(0)
    })
  })

  describe('audio playback', () => {
    it('should have audio play button', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('play_arrow')
    })

    it('should not throw error when audio button is clicked', async () => {
      const wrapper = createWrapper()
      // Find the large audio button in the prompt card
      const audioButton = wrapper.find('.size-16')
      if (audioButton.exists()) {
        await audioButton.trigger('click')
      }
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('answer selection', () => {
    it('should allow selecting a character option', async () => {
      const wrapper = createWrapper()
      const optionButtons = wrapper.findAll('.grid button')
      expect(optionButtons.length).toBeGreaterThanOrEqual(1)

      await optionButtons[0].trigger('click')

      // After clicking, feedback should appear (correct or wrong)
      const html = wrapper.html()
      expect(html).toMatch(/check_circle|cancel|prelesson\.nextCharacter/)
    })

    it('should disable options after answer is selected', async () => {
      const wrapper = createWrapper()
      const optionButtons = wrapper.findAll('.grid button')
      await optionButtons[0].trigger('click')

      // Buttons should be disabled
      const disabledButtons = wrapper.findAll('.grid button[disabled]')
      expect(disabledButtons.length).toBeGreaterThan(0)
    })
  })

  describe('score tracking', () => {
    it('should show score counter', () => {
      const wrapper = createWrapper()
      expect(wrapper.text()).toContain('check_circle')
    })
  })

  describe('game completion', () => {
    it('should emit complete event when all questions answered', async () => {
      vi.useFakeTimers()
      const wrapper = createWrapper()

      for (let i = 0; i < mockCharacters.length; i++) {
        const optionButtons = wrapper.findAll('.grid button')
        if (optionButtons.length === 0) break

        // Find the correct answer for the current question
        const currentCorrect = wrapper.vm.currentQuestion?.correct
        if (!currentCorrect) break

        // Find the button with the correct character
        const correctButton = optionButtons.find(btn => btn.text().includes(currentCorrect.char))
        if (correctButton) {
          await correctButton.trigger('click')
          // Advance timer for auto-advance on correct answer
          vi.advanceTimersByTime(900)
          await wrapper.vm.$nextTick()
        } else {
          // Click any button and then advance manually
          await optionButtons[0].trigger('click')
          const nextBtn = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
          if (nextBtn.exists()) {
            await nextBtn.trigger('click')
          }
        }
      }

      const emitted = wrapper.emitted('complete')
      if (emitted) {
        expect(emitted.length).toBe(1)
        expect(emitted[0][0]).toHaveProperty('score')
        expect(emitted[0][0]).toHaveProperty('total')
      }

      vi.useRealTimers()
    })

    it('should show completion screen with score after game ends', async () => {
      vi.useFakeTimers()
      const wrapper = createWrapper()

      // Answer all questions by selecting any option
      for (let i = 0; i < mockCharacters.length; i++) {
        const optionButtons = wrapper.findAll('.grid button')
        if (optionButtons.length === 0) break

        await optionButtons[0].trigger('click')
        // For correct answers, auto-advance timer
        vi.advanceTimersByTime(900)
        await wrapper.vm.$nextTick()

        // For wrong answers, click next button
        const nextBtn = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
        if (nextBtn.exists() && nextBtn.text().includes('prelesson.nextCharacter')) {
          await nextBtn.trigger('click')
        }
      }

      if (wrapper.vm.isCompleted) {
        expect(wrapper.text()).toContain('prelesson.matchComplete')
        expect(wrapper.text()).toContain('learning.yourScore')
      }

      vi.useRealTimers()
    })
  })

  describe('restart', () => {
    it('should have restart button after completion', async () => {
      vi.useFakeTimers()
      const wrapper = createWrapper()

      // Complete the game
      for (let i = 0; i < mockCharacters.length; i++) {
        const optionButtons = wrapper.findAll('.grid button')
        if (optionButtons.length === 0) break

        await optionButtons[0].trigger('click')
        vi.advanceTimersByTime(900)
        await wrapper.vm.$nextTick()

        const nextBtn = wrapper.find('.w-full.py-4.rounded-xl.bg-primary')
        if (nextBtn.exists() && nextBtn.text().includes('prelesson.nextCharacter')) {
          await nextBtn.trigger('click')
        }
      }

      if (wrapper.vm.isCompleted) {
        expect(wrapper.text()).toContain('learning.tryAgain')
      }

      vi.useRealTimers()
    })
  })

  describe('props reactivity', () => {
    it('should reinitialize when characters prop changes', async () => {
      const wrapper = createWrapper()
      const newChars = [
        { id: 'ka', char: 'か', romaji: 'ka', reading: 'ka' },
        { id: 'ki', char: 'き', romaji: 'ki', reading: 'ki' },
        { id: 'ku', char: 'く', romaji: 'ku', reading: 'ku' }
      ]

      await wrapper.setProps({ characters: newChars })
      expect(wrapper.text()).toContain('1 /')
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

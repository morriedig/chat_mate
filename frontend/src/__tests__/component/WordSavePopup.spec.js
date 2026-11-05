import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WordSavePopup from '../../components/chat/WordSavePopup.vue'
import { useVocabularyBank, generateWordId } from '../../composables/useVocabularyBank'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key })
}))

const mountSheet = (props = {}) => mount(WordSavePopup, {
  props: { word: 'deadline', context: 'The deadline is Friday.', ...props },
  global: { stubs: { Teleport: true } },
})

describe('WordSavePopup', () => {
  beforeEach(() => {
    const { removeWord } = useVocabularyBank()
    removeWord(generateWordId('deadline'))
  })

  it('is a bottom sheet with the word as title, the saved context and a translation field', () => {
    const wrapper = mountSheet()

    expect(wrapper.find('[role="dialog"]').attributes('aria-label')).toBe('deadline')
    expect(wrapper.text()).toContain('The deadline is Friday.')
    expect(wrapper.find('input').exists()).toBe(true)
    // Not positioned at the pointer any more
    expect(wrapper.find('[style*="left"]').exists()).toBe(false)
  })

  it('saves the word with its translation and context, then closes', async () => {
    const wrapper = mountSheet()
    await wrapper.find('input').setValue('截止日')
    await wrapper.find('.word-save').trigger('click')

    const { words } = useVocabularyBank()
    const saved = words.value.find(w => w.word === 'deadline')
    expect(saved).toMatchObject({ translation: '截止日', context: 'The deadline is Friday.', source: 'chat' })
    expect(wrapper.emitted('saved')).toEqual([['deadline']])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('offers Remove for a word that is already saved', async () => {
    useVocabularyBank().addWord({ word: 'deadline', translation: '', context: '', source: 'chat' })
    const wrapper = mountSheet()

    expect(wrapper.text()).toContain('vocabBank.alreadySaved')
    expect(wrapper.find('input').exists()).toBe(false)
    await wrapper.find('.word-remove').trigger('click')

    expect(useVocabularyBank().hasWord('deadline')).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

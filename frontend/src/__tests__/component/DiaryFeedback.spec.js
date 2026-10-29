import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DiaryFeedback from '../../components/diary/DiaryFeedback.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key })
}))

describe('DiaryFeedback', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const createWrapper = (didWell) => mount(DiaryFeedback, {
    props: {
      feedback: { reaction: 'Nice!', didWell, corrections: [], betterExpressions: [], newVocabulary: [], encouragement: '', score: 8 },
      character: { id: 'emma', name: 'Emma', avatar: '👩‍🎨' },
    },
  })

  it('shows the quoted text and comment for object items', () => {
    const wrapper = createWrapper([{ text: 'which is why I finish early', comment: 'Natural way to link a result.' }])

    expect(wrapper.text()).toContain('"which is why I finish early"')
    expect(wrapper.text()).toContain('Natural way to link a result.')
    expect(wrapper.text()).not.toContain('"comment"')
  })

  it('still shows plain string items', () => {
    const wrapper = createWrapper(['Good use of because'])

    expect(wrapper.text()).toContain('Good use of because')
  })
})

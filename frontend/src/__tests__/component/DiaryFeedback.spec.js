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

  it('shows corrections expanded by default and lets the section collapse', async () => {
    const wrapper = mount(DiaryFeedback, {
      props: {
        feedback: {
          reaction: 'Nice!',
          corrections: [{ original: 'I goed home', corrected: 'I went home', explanation: 'went is the past of go', severity: 'major' }],
        },
        character: { id: 'emma', name: 'Emma' },
      },
    })

    const toggle = wrapper.find('[aria-controls="diary-fb-corrections"]')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(wrapper.text()).toContain('I went home')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(wrapper.text()).not.toContain('I went home')
  })

  it('shows the friend as a monogram, not an emoji avatar', () => {
    const wrapper = createWrapper(['Good use of because'])

    expect(wrapper.find('[role="img"][aria-label="Emma"]').text()).toBe('E')
    expect(wrapper.text()).not.toContain('👩‍🎨')
  })
})

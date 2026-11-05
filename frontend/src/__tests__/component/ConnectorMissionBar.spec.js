import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ConnectorMissionBar from '../../components/chat/ConnectorMissionBar.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key) => key })
}))

const targets = [
  { id: 'a', phrase: 'If you ask me, …' },
  { id: 'b', phrase: 'I’d say …' },
  { id: 'c', phrase: 'I could be wrong, but …' },
]

const mountBar = (props = {}) => mount(ConnectorMissionBar, { props: { targets, ...props } })

describe('ConnectorMissionBar', () => {
  it('shows the goal, the count and one chip per target', () => {
    const wrapper = mountBar({ task: 'A friend wants to change jobs.', usedIds: ['a'] })

    expect(wrapper.find('.mission-goal').text()).toBe('A friend wants to change jobs.')
    expect(wrapper.find('.mission-count').text()).toBe('1 / 3')
    expect(wrapper.findAll('.mission-chip')).toHaveLength(3)
  })

  it('marks used targets with a check and the success style, without a pop animation', () => {
    const wrapper = mountBar({ task: 'Goal', usedIds: ['a'] })
    const [used, unused] = wrapper.findAll('.mission-chip')

    expect(used.classes()).toContain('bg-success-soft')
    expect(used.text()).toContain('check')
    expect(unused.classes()).toContain('bg-surface-raised')
    expect(unused.text()).not.toContain('check')
    expect(wrapper.html()).not.toContain('chipPop')
  })

  it('enables the task summary only after the first user turn', async () => {
    const wrapper = mountBar({ task: 'Goal', canEnd: false })
    const summary = wrapper.find('.mission-end')

    expect(summary.text()).toBe('taskChat.seeSummary')
    expect(summary.attributes('disabled')).toBeDefined()

    await wrapper.setProps({ canEnd: true })
    await summary.trigger('click')
    expect(wrapper.emitted('end')).toHaveLength(1)
  })

  it('folds to one row with the goal, count and summary, and asks to expand on tap', async () => {
    const wrapper = mountBar({ task: 'Goal', usedIds: ['a'], collapsed: true, canEnd: true })

    expect(wrapper.find('.mission-goal').exists()).toBe(false)
    expect(wrapper.find('.mission-chip').exists()).toBe(false)
    expect(wrapper.find('.mission-toggle').text()).toContain('Goal')
    expect(wrapper.find('.mission-toggle').attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.mission-count').text()).toBe('1 / 3')
    expect(wrapper.find('.mission-end').exists()).toBe(true)

    await wrapper.find('.mission-toggle').trigger('click')
    expect(wrapper.emitted('update:collapsed')).toEqual([[false]])
  })

  it('shows the complete note when every target is used', () => {
    const wrapper = mountBar({ task: 'Goal', usedIds: ['a', 'b', 'c'], canEnd: true })
    expect(wrapper.text()).toContain('taskChat.complete')
  })

  it('sends a finished lesson mission back to learning', async () => {
    const wrapper = mountBar({ usedIds: ['a', 'b', 'c'] })

    expect(wrapper.find('.mission-end').exists()).toBe(false)
    expect(wrapper.text()).toContain('mission.complete')
    await wrapper.findAll('button').find(b => b.text() === 'mission.backToLearning').trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })

  it('serves opinion chat: topic label, gloss, no count, and its own end label', async () => {
    const wrapper = mountBar({
      label: 'opinionChat.topicLabel',
      task: 'Is remote work better?',
      gloss: '遠端工作比較好嗎？',
      targets: [{ id: 'because', phrase: 'because' }],
      usedIds: ['because'],
      showCount: false,
      endLabel: 'opinionChat.endChat',
      canEnd: true,
    })

    expect(wrapper.find('h2').text()).toContain('opinionChat.topicLabel')
    expect(wrapper.text()).toContain('遠端工作比較好嗎？')
    expect(wrapper.find('.mission-count').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('mission.complete')
    await wrapper.find('.mission-end').trigger('click')
    expect(wrapper.find('.mission-end').text()).toBe('opinionChat.endChat')
    expect(wrapper.emitted('end')).toHaveLength(1)
  })
})

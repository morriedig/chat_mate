import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import ChatSummaryPanel from '../../components/chat/ChatSummaryPanel.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key, params) => (params ? `${key}:${JSON.stringify(params)}` : key) })
}))

const isLoading = ref(false)
const failure = ref(null)
const summarize = vi.fn()
vi.mock('../../composables/useChatSummary', () => ({
  useChatSummary: () => ({ isLoading, failure, summarize })
}))

const addMistake = vi.fn()
vi.mock('../../composables/useMistakes', () => ({
  useMistakes: () => ({ addMistake })
}))

const queueRepeatTomorrow = vi.fn(() => ({ status: 'none' }))
vi.mock('../../composables/useSpeakingQueue', () => ({
  useSpeakingQueue: () => ({ queueRepeatTomorrow })
}))

const mission = {
  targets: [
    { id: 'a', phrase: 'If you ask me, …' },
    { id: 'b', phrase: 'I’d say …' },
    { id: 'c', phrase: 'I could be wrong, but …' },
  ],
}
const point = { original: 'I am agree', hint: 'agree is a verb', corrected: 'I agree', explanation: 'No be verb.', type: 'other' }

const mountPanel = (props = {}) => mount(ChatSummaryPanel, {
  props: { mission, messages: [], usedIds: ['a'], character: { name: 'Emma' }, ...props },
  global: { stubs: { Teleport: true } },
})

describe('ChatSummaryPanel', () => {
  beforeEach(() => {
    isLoading.value = false
    failure.value = null
    summarize.mockReset()
    addMistake.mockReset()
    queueRepeatTomorrow.mockReset()
    queueRepeatTomorrow.mockReturnValue({ status: 'none' })
  })

  it('leads with the used / total metric, counting patterns the AI spotted too', async () => {
    summarize.mockResolvedValue({ points: [], usedPatternIds: ['b'] })
    const wrapper = mountPanel()
    await flushPromises()

    expect(wrapper.find('.summary-metric').text()).toContain('2 / 3')
    expect(wrapper.findAll('.summary-target.is-used')).toHaveLength(2)
    expect(wrapper.findAll('.summary-target')).toHaveLength(3)
  })

  it('shows the hint first and the suggested sentence only on request', async () => {
    summarize.mockResolvedValue({ points: [point], usedPatternIds: [] })
    const wrapper = mountPanel()
    await flushPromises()

    expect(wrapper.text()).toContain('agree is a verb')
    expect(wrapper.find('.summary-answer').exists()).toBe(false)

    await wrapper.find('.summary-show-answer').trigger('click')
    expect(wrapper.find('.summary-answer').text()).toContain('I agree')
    expect(wrapper.find('.summary-show-answer').exists()).toBe(false)
  })

  it('saves each correction for review', async () => {
    summarize.mockResolvedValue({ points: [point], usedPatternIds: [] })
    const wrapper = mountPanel()
    await flushPromises()

    expect(addMistake).toHaveBeenCalledWith({ ...point, source: 'summary' })
    expect(wrapper.text()).toContain('taskChat.savedForReview')
  })

  it('says so when nothing needs changing', async () => {
    summarize.mockResolvedValue({ points: [], usedPatternIds: [] })
    const wrapper = mountPanel()
    await flushPromises()

    expect(wrapper.text()).toContain('taskChat.nothingToFix')
    expect(wrapper.text()).not.toContain('taskChat.savedForReview')
  })

  it('shows a static skeleton while loading', () => {
    summarize.mockReturnValue(new Promise(() => {}))
    isLoading.value = true
    const wrapper = mountPanel()

    expect(wrapper.find('.summary-loading').exists()).toBe(true)
    expect(wrapper.find('.animate-spin, .animate-pulse').exists()).toBe(false)
  })

  it('keeps a failure inside the corrections section and retries', async () => {
    summarize.mockImplementationOnce(async () => { failure.value = 'unavailable'; return null })
    const wrapper = mountPanel()
    await flushPromises()

    expect(wrapper.find('.summary-failure').text()).toContain('taskChat.unavailable')

    summarize.mockImplementationOnce(async () => { failure.value = null; return { points: [point], usedPatternIds: [] } })
    await wrapper.find('.summary-retry').trigger('click')
    await flushPromises()

    expect(summarize).toHaveBeenCalledTimes(2)
    expect(wrapper.find('.summary-failure').exists()).toBe(false)
    expect(wrapper.text()).toContain('I am agree')
  })

  it('does not offer Retry once the daily limit is reached', async () => {
    summarize.mockImplementationOnce(async () => { failure.value = 'daily-limit'; return null })
    const wrapper = mountPanel()
    await flushPromises()

    expect(wrapper.text()).toContain('common.dailyLimit')
    expect(wrapper.find('.summary-retry').exists()).toBe(false)
  })

  it('keeps chatting or goes home from the bottom actions', async () => {
    summarize.mockResolvedValue({ points: [], usedPatternIds: [] })
    const wrapper = mountPanel()
    await flushPromises()

    await wrapper.find('.summary-keep').trigger('click')
    await wrapper.find('.summary-home').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('home')).toHaveLength(1)
  })

  describe('明天再說這句', () => {
    const repeat = { enabled: true, original: 'Yesterday I go', target: 'Yesterday I went', cue: '說昨天去了哪', hint: '過去式', patternId: '' }

    it('books the chosen sentence for tomorrow and shows it without the answer', async () => {
      queueRepeatTomorrow.mockReturnValue({ status: 'queued', item: { cue: repeat.cue } })
      summarize.mockResolvedValue({ points: [], usedPatternIds: [], repeatTomorrow: repeat })
      const wrapper = mountPanel({ mission: { ...mission, id: 'task_1' } })
      await flushPromises()

      expect(queueRepeatTomorrow).toHaveBeenCalledWith(repeat, { sourceId: 'task_1' })
      const card = wrapper.find('.summary-repeat')
      expect(card.text()).toContain('Yesterday I go')
      expect(card.text()).toContain(repeat.cue)
      expect(card.text()).toContain('taskChat.repeatTomorrow.queued')
      expect(card.text()).not.toContain('Yesterday I went')
    })

    it('replaces tomorrow’s sentence only when the learner taps replace', async () => {
      queueRepeatTomorrow.mockReturnValueOnce({ status: 'taken', item: { cue: '別的句子' } })
      queueRepeatTomorrow.mockReturnValueOnce({ status: 'queued', item: { cue: repeat.cue } })
      summarize.mockResolvedValue({ points: [], usedPatternIds: [], repeatTomorrow: repeat })
      const wrapper = mountPanel({ mission: { ...mission, id: 'task_2' } })
      await flushPromises()

      expect(queueRepeatTomorrow).toHaveBeenCalledTimes(1)
      expect(wrapper.find('.summary-repeat').text()).toContain('別的句子')
      await wrapper.find('.summary-repeat-replace').trigger('click')
      expect(queueRepeatTomorrow).toHaveBeenLastCalledWith(repeat, { sourceId: 'task_2', replace: true })
      expect(wrapper.find('.summary-repeat').text()).toContain('taskChat.repeatTomorrow.queued')
    })

    it('shows nothing when the summary has no sentence to repeat', async () => {
      queueRepeatTomorrow.mockReturnValue({ status: 'none' })
      summarize.mockResolvedValue({ points: [], usedPatternIds: [], repeatTomorrow: { ...repeat, enabled: false } })
      const wrapper = mountPanel()
      await flushPromises()
      expect(wrapper.find('.summary-repeat').exists()).toBe(false)
    })
  })
})

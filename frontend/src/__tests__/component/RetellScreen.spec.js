import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key, params) => (params ? `${key} ${JSON.stringify(params)}` : key) }) }))
const push = vi.fn()
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))
const addXP = vi.fn()
vi.mock('../../composables/useUserProgress', () => ({ useUserProgress: () => ({ addXP }) }))
vi.mock('../../composables/useDailyGoal', () => ({ useDailyGoal: () => ({ startTimer: vi.fn(), stopTimer: vi.fn() }) }))

let sttAvailable = false
const listenOnce = vi.fn()
vi.mock('../../utils/stt', () => ({
  listenOnce: (...args) => listenOnce(...args),
  stopListening: vi.fn(),
  isSTTAvailable: () => sttAvailable,
}))

import RetellScreen from '../../components/RetellScreen.vue'

describe('RetellScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    addXP.mockClear()
    listenOnce.mockReset()
    sttAvailable = false
  })
  afterEach(() => vi.useRealTimers())

  const say = async (wrapper, text) => {
    await wrapper.find('textarea').setValue(text)
    vi.advanceTimersByTime(30000)
    await wrapper.find('.finish-round').trigger('click')
  }

  it('runs plan and three typed rounds, then compares speed', async () => {
    const wrapper = mount(RetellScreen)
    await wrapper.find('.start-plan').trigger('click')
    expect(wrapper.text()).toContain('retell.planTitle')

    await wrapper.find('.skip-plan').trigger('click')
    await say(wrapper, 'I think working from home is better because I save time every day')
    expect(wrapper.text()).toContain('retell.roundDone')

    await wrapper.find('.next-round').trigger('click')
    await say(wrapper, 'Working from home is better because I save time and I focus more and sleep more')
    await wrapper.find('.next-round').trigger('click')
    await say(wrapper, 'Home is better because I save time focus more sleep more and eat better food at home every day')

    expect(wrapper.text()).toContain('retell.resultImproved')
    expect(addXP).toHaveBeenCalledWith(10, 'retell')
    const saved = JSON.parse(localStorage.getItem('chatmate_retell'))
    expect(saved.history[0].rounds).toHaveLength(3)
  })

  it('ends a round when its time runs out', async () => {
    const wrapper = mount(RetellScreen)
    await wrapper.find('.start-plan').trigger('click')
    vi.advanceTimersByTime(30000)
    await flushPromises()
    expect(wrapper.text()).toContain('retell.roundTitle')

    await wrapper.find('textarea').setValue('Short answer')
    vi.advanceTimersByTime(90000)
    await flushPromises()
    expect(wrapper.text()).toContain('retell.roundDone')
  })

  it('keeps listening through a round and joins what it heard', async () => {
    sttAvailable = true
    listenOnce
      .mockResolvedValueOnce('I think it is better')
      .mockResolvedValueOnce('because I save time')
      .mockImplementation(() => new Promise(() => {}))
    const wrapper = mount(RetellScreen)
    await wrapper.find('.start-plan').trigger('click')
    await wrapper.find('.skip-plan').trigger('click')
    await flushPromises()

    expect(listenOnce).toHaveBeenCalledTimes(3)
    expect(wrapper.text()).toContain('I think it is better because I save time')
  })
})

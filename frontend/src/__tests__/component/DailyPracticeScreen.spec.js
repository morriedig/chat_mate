import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key, params) => (params && typeof params === 'object' ? `${key} ${JSON.stringify(params)}` : key) }) }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('../../composables/useDailyGoal', () => ({ useDailyGoal: () => ({ startTimer: vi.fn(), stopTimer: vi.fn() }) }))
vi.mock('../../composables/useTaskChatLauncher', () => ({ useTaskChatLauncher: () => ({ startTaskChat: vi.fn() }) }))
vi.mock('../../utils/tts', () => ({ playTTS: vi.fn(), stopTTS: vi.fn() }))

import DailyPracticeScreen from '../../components/DailyPracticeScreen.vue'

const LEVELS = ['beginner', 'intermediate', 'advanced']
const levelRadio = (wrapper, lv) => wrapper.findAll('[role=radio]').find(b => b.text() === `levels.${lv}.name`)
// The level the screen shows as selected (plan state is module-level, so read it from the control)
const shownLevel = wrapper => LEVELS.find(lv => levelRadio(wrapper, lv).attributes('aria-checked') === 'true')

describe('DailyPracticeScreen level control', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = ''
  })

  it('changes level right away when no answer is in progress', async () => {
    const wrapper = mount(DailyPracticeScreen, { attachTo: document.body })
    await flushPromises()
    const other = shownLevel(wrapper) === 'advanced' ? 'beginner' : 'advanced'
    await levelRadio(wrapper, other).trigger('click')
    expect(shownLevel(wrapper)).toBe(other)
    expect(document.body.querySelector('[role=dialog]')).toBeNull()
    wrapper.unmount()
  })

  it('asks before changing level mid-answer, and only changes it on confirm', async () => {
    const wrapper = mount(DailyPracticeScreen, { attachTo: document.body })
    await flushPromises()
    const before = shownLevel(wrapper)
    const other = before === 'advanced' ? 'beginner' : 'advanced'

    // Start the first card's quiz and pick an answer
    const start = wrapper.findAll('button').find(b => b.text() === 'dailyPractice.startPractice')
    if (start) await start.trigger('click')
    await wrapper.find('section [role=radiogroup] [role=radio]').trigger('click')

    await levelRadio(wrapper, other).trigger('click')
    expect(shownLevel(wrapper)).toBe(before)
    const dialog = document.body.querySelector('[role=dialog]')
    expect(dialog).not.toBeNull()

    const confirm = [...dialog.querySelectorAll('button')].find(b => b.textContent.trim() === 'dailyPractice.levelChangeConfirm')
    confirm.click()
    await flushPromises()
    expect(shownLevel(wrapper)).toBe(other)
    expect(document.body.querySelector('[role=dialog]')).toBeNull()
    wrapper.unmount()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key, params) => (params && typeof params === 'object' ? `${key} ${JSON.stringify(params)}` : key) }) }))
vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('../../composables/useDailyGoal', () => ({ useDailyGoal: () => ({ startTimer: vi.fn(), stopTimer: vi.fn() }) }))
vi.mock('../../composables/useTaskChatLauncher', () => ({ useTaskChatLauncher: () => ({ startTaskChat: vi.fn() }) }))
vi.mock('../../utils/tts', () => ({ playTTS: vi.fn(), stopTTS: vi.fn() }))
vi.mock('../../utils/stt', () => ({ isSTTAvailable: () => false, listenOnce: vi.fn(), stopListening: vi.fn() }))

const LEVELS = ['beginner', 'intermediate', 'advanced']
const levelRadio = (wrapper, lv) => wrapper.findAll('[role=radio]').find(b => b.text() === `levels.${lv}.name`)
// The level the screen shows as selected (plan state is module-level, so read it from the control)
const shownLevel = wrapper => LEVELS.find(lv => levelRadio(wrapper, lv).attributes('aria-checked') === 'true')
const button = (wrapper, text) => wrapper.findAll('button').find(b => b.text() === text)

async function mountScreen() {
  vi.resetModules()
  const { default: DailyPracticeScreen } = await import('../../components/DailyPracticeScreen.vue')
  const wrapper = mount(DailyPracticeScreen, { attachTo: document.body })
  await flushPromises()
  return wrapper
}

// Step 1: fix the common mistake, compare, rate
async function finishErrorStep(wrapper) {
  await button(wrapper, 'mistakes.compare').trigger('click')
  await button(wrapper, 'dailyPractice.rating.ok').trigger('click')
}

// Step 2: (study if new) pick an answer, next
async function finishPatternStep(wrapper) {
  const start = button(wrapper, 'dailyPractice.startPractice')
  if (start) await start.trigger('click')
  await wrapper.find('section [role=radiogroup] [role=radio]').trigger('click')
  await button(wrapper, 'dailyPractice.next').trigger('click')
}

describe('DailyPracticeScreen', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = ''
  })

  it('changes level right away when no answer is in progress', async () => {
    const wrapper = await mountScreen()
    const other = shownLevel(wrapper) === 'advanced' ? 'beginner' : 'advanced'
    await levelRadio(wrapper, other).trigger('click')
    expect(shownLevel(wrapper)).toBe(other)
    expect(document.body.querySelector('[role=dialog]')).toBeNull()
    wrapper.unmount()
  })

  it('asks before changing level once a core step is done, and only changes it on confirm', async () => {
    const wrapper = await mountScreen()
    const before = shownLevel(wrapper)
    const other = before === 'advanced' ? 'beginner' : 'advanced'
    await finishErrorStep(wrapper)

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

  it('shows the three core steps first, then 今天完成 and the remaining extras', async () => {
    const wrapper = await mountScreen()
    expect(wrapper.findAll('.core-steps li')).toHaveLength(3)
    expect(wrapper.find('.core-steps [aria-current=step]').text()).toContain('dailyPractice.core.steps.error')

    await finishErrorStep(wrapper)
    expect(wrapper.find('.core-steps [aria-current=step]').text()).toContain('dailyPractice.core.steps.pattern')
    const start = button(wrapper, 'dailyPractice.startPractice')
    if (start) await start.trigger('click')
    const corePatternText = wrapper.find('section [role=radiogroup]').attributes('aria-label')
    await finishPatternStep(wrapper)

    // Step 3: typing needs 2 English words; the answer shows only after sending
    const send = wrapper.find('.core-send')
    expect(send.attributes('disabled')).toBeDefined()
    await wrapper.find('#core-typed').setValue('If you ask me, it works.')
    expect(wrapper.find('.core-send').attributes('disabled')).toBeUndefined()
    await wrapper.find('.core-send').trigger('click')
    expect(wrapper.text()).toContain('If you ask me, it works.')
    await wrapper.find('.core-got-it').trigger('click')

    expect(wrapper.find('.core-done').exists()).toBe(true)
    expect(wrapper.find('.core-done').text()).toContain('dailyPractice.core.doneText')
    const more = wrapper.find('.core-more')
    expect(more.text()).toContain('dailyPractice.core.more')

    // Extras never repeat the core's pattern
    await more.trigger('click')
    const firstExtra = wrapper.find('section [role=radiogroup]')
    if (firstExtra.exists()) expect(firstExtra.attributes('aria-label')).not.toBe(corePatternText)
    expect(wrapper.find('.core-steps').exists()).toBe(false)
    wrapper.unmount()
  })

  it('reopens at the unfinished step', async () => {
    let wrapper = await mountScreen()
    await finishErrorStep(wrapper)
    await finishPatternStep(wrapper)
    wrapper.unmount()

    wrapper = await mountScreen()
    expect(wrapper.find('.core-steps [aria-current=step]').text()).toContain('dailyPractice.core.steps.speaking')
    expect(wrapper.find('#core-typed').exists()).toBe(true)
    wrapper.unmount()
  })
})

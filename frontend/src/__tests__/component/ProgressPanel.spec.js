import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import ProgressPanel from '../../components/ProgressPanel.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key, a) => (a && typeof a === 'object' ? `${key}:${JSON.stringify(a)}` : key) }),
}))

const progress = ref({ totalXP: 340, currentStreak: 4, longestStreak: 9, unlockedAchievements: ['a', 'b'] })
vi.mock('../../composables/useUserProgress', () => ({
  useUserProgress: () => ({
    progress,
    currentRank: ref({ level: 3, title: 'Learner' }),
    nextRank: ref({ level: 4, title: 'Speaker' }),
    progressToNextRank: ref(13),
    xpToNextRank: ref(260),
    unlockedAchievements: computed(() => progress.value.unlockedAchievements),
    ACHIEVEMENTS: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
  }),
}))
vi.mock('../../composables/useDailyGoal', () => ({
  useDailyGoal: () => ({ todayMinutes: ref(6.4), goalMinutes: ref(10) }),
}))
vi.mock('../../composables/useWeeklyQuests', () => ({
  useWeeklyQuests: () => ({ quests: ref([{ completed: true }, { completed: false }, { completed: true }]) }),
}))
const seen = {
  newAchievementIds: ref(['b']),
  rankIsNew: ref(true),
  markAchievementsSeen: vi.fn(() => { seen.newAchievementIds.value = [] }),
  markRankSeen: vi.fn(),
}
vi.mock('../../composables/useProgressSeen', () => ({ useProgressSeen: () => seen }))

const SheetStub = { name: 'CmBottomSheet', props: ['title'], emits: ['close'], template: '<div class="sheet" :data-title="title"><slot /></div>' }

function mountPanel() {
  return mount(ProgressPanel, {
    global: {
      stubs: {
        CmBottomSheet: SheetStub,
        AchievementsPanel: { name: 'AchievementsPanel', props: ['newIds'], template: '<div class="ach" />' },
        WeeklyQuestsPanel: { name: 'WeeklyQuestsPanel', emits: ['close'], template: '<div class="quests" />' },
        AnalyticsDashboard: { name: 'AnalyticsDashboard', emits: ['close'], template: '<div class="analytics" />' },
        ShareCardPanel: { name: 'ShareCardPanel', emits: ['close'], template: '<div class="share" />' },
      },
    },
  })
}

describe('ProgressPanel', () => {
  beforeEach(() => {
    seen.newAchievementIds.value = ['b']
    seen.rankIsNew.value = true
    seen.markAchievementsSeen.mockClear()
    seen.markRankSeen.mockClear()
  })

  it('shows rank, XP, streak, daily goal, achievements and quests', () => {
    const text = mountPanel().text()
    expect(text).toContain('Lv.3')
    expect(text).toContain('rank.totalXP:{"xp":340}')
    expect(text).toContain('progressPanel.toNext:{"xp":260}')
    expect(text).toContain('home.railMinutes:{"count":6,"goal":10}')
    expect(text).toContain('2 / 3') // achievements and quests both read 2 / 3
    expect(text).toContain('analytics.title')
    expect(text).toContain('shareCard.share')
  })

  it('labels a new rank and new achievements quietly', () => {
    const wrapper = mountPanel()
    expect(wrapper.find('[data-test="progress-rank"]').text()).toContain('progressPanel.new')
    expect(wrapper.find('[data-test="progress-achievements"]').text()).toContain('progressPanel.new')
    expect(wrapper.find('[data-test="progress-quests"]').text()).not.toContain('progressPanel.new')
  })

  it('opens achievements with the new ids, marks them seen on close, and returns', async () => {
    const wrapper = mountPanel()
    await wrapper.find('[data-test="progress-achievements"]').trigger('click')
    const ach = wrapper.findComponent({ name: 'AchievementsPanel' })
    expect(ach.props('newIds')).toEqual(['b'])

    wrapper.findComponent(SheetStub).vm.$emit('close')
    await wrapper.vm.$nextTick()
    expect(seen.markAchievementsSeen).toHaveBeenCalled()
    expect(wrapper.find('[data-test="progress-rank"]').exists()).toBe(true)
  })

  it('opens quests, analytics and share card one at a time', async () => {
    const wrapper = mountPanel()
    for (const [id, cls] of [['quests', '.quests'], ['analytics', '.analytics'], ['share', '.share']]) {
      await wrapper.find(`[data-test="progress-${id}"]`).trigger('click')
      expect(wrapper.find(cls).exists()).toBe(true)
      expect(wrapper.find('[data-test="progress-rank"]').exists()).toBe(false)
      const sub = wrapper.findComponent({ name: { quests: 'WeeklyQuestsPanel', analytics: 'AnalyticsDashboard', share: 'ShareCardPanel' }[id] })
      sub.vm.$emit('close')
      await wrapper.vm.$nextTick()
    }
  })

  it('marks the rank seen when closed', () => {
    mountPanel().unmount()
    expect(seen.markRankSeen).toHaveBeenCalled()
  })
})

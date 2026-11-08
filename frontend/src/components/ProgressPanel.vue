<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../composables/useUserProgress'
import { useDailyGoal } from '../composables/useDailyGoal'
import { useWeeklyQuests } from '../composables/useWeeklyQuests'
import { useProgressSeen } from '../composables/useProgressSeen'
import CmBottomSheet from './ui/CmBottomSheet.vue'
import CmProgress from './ui/CmProgress.vue'
import AchievementsPanel from './chat/AchievementsPanel.vue'
import WeeklyQuestsPanel from './WeeklyQuestsPanel.vue'
import AnalyticsDashboard from './AnalyticsDashboard.vue'
import ShareCardPanel from './ShareCardPanel.vue'

// 進度與成就: rank, XP, daily goal, achievements, weekly quests, analytics and the
// share card in one place the user opens on purpose. Nothing here pops up by itself.
const { t } = useI18n()
const emit = defineEmits(['close'])

const { progress, currentRank, nextRank, progressToNextRank, xpToNextRank, unlockedAchievements, ACHIEVEMENTS } = useUserProgress()
const { todayMinutes, goalMinutes } = useDailyGoal()
const { quests } = useWeeklyQuests()
const { newAchievementIds, rankIsNew, markAchievementsSeen, markRankSeen } = useProgressSeen()

// Keep the rank "new" label visible while the panel is open, then mark it seen
const showRankNew = rankIsNew.value
onBeforeUnmount(markRankSeen)

// One sheet at a time: a detail sheet replaces this one and closing it comes back here
const sub = ref(null)
const achievementsNewIds = ref([])

function openSub(id) {
  if (id === 'achievements') achievementsNewIds.value = [...newAchievementIds.value]
  sub.value = id
}

function closeSub() {
  if (sub.value === 'achievements') markAchievementsSeen()
  sub.value = null
}

const rankName = computed(() => t(`ranks.${currentRank.value.title.toLowerCase()}`, currentRank.value.title))
const questsDone = computed(() => quests.value.filter(q => q.completed).length)
const minutes = computed(() => Math.floor(todayMinutes.value))

const stats = computed(() => [
  { id: 'streak', label: t('home.railStreak'), value: t('home.railDays', { count: progress.value.currentStreak || 0 }, progress.value.currentStreak || 0) },
  { id: 'best', label: t('analytics.bestStreak'), value: t('home.railDays', { count: progress.value.longestStreak || 0 }, progress.value.longestStreak || 0) },
  { id: 'today', label: t('dailyGoal.title'), value: t('home.railMinutes', { count: minutes.value, goal: goalMinutes.value }) },
])

const rows = computed(() => [
  {
    id: 'achievements',
    icon: 'military_tech',
    label: t('chat.achievements'),
    value: `${unlockedAchievements.value.length} / ${ACHIEVEMENTS.length}`,
    isNew: newAchievementIds.value.length > 0,
  },
  { id: 'quests', icon: 'assignment', label: t('weeklyQuests.title'), value: `${questsDone.value} / ${quests.value.length}` },
  { id: 'analytics', icon: 'analytics', label: t('analytics.title'), value: '' },
  { id: 'share', icon: 'share', label: t('shareCard.share'), value: '' },
])
</script>

<template>
  <CmBottomSheet
    v-if="!sub"
    :title="t('progressPanel.title')"
    :description="t('progressPanel.description')"
    :close-label="t('common.close')"
    @close="emit('close')"
  >
    <!-- Rank and XP -->
    <section class="mb-4 rounded-[14px] border border-hairline bg-surface p-4" data-test="progress-rank">
      <div class="mb-1 flex min-w-0 items-center gap-2">
        <span class="min-w-0 truncate text-body font-medium text-ink">Lv.{{ currentRank.level }} {{ rankName }}</span>
        <span v-if="showRankNew" class="shrink-0 rounded-[6px] bg-accent-soft px-1.5 text-meta font-medium text-accent">{{ t('progressPanel.new') }}</span>
        <span class="ml-auto shrink-0 text-meta text-ink-muted tabular-nums">{{ t('rank.totalXP', { xp: progress.totalXP }) }}</span>
      </div>
      <CmProgress class="mt-2" :value="nextRank ? progressToNextRank : 100" :max="100" :label="t('analytics.rankProgress')" />
      <p class="mt-2 text-meta text-ink-muted tabular-nums">
        {{ nextRank ? t('progressPanel.toNext', { xp: xpToNextRank }) : t('rank.maxLevel') }}
      </p>
    </section>

    <!-- Streak and daily goal -->
    <dl class="mb-4 grid grid-cols-3 overflow-hidden rounded-[14px] border border-hairline bg-surface">
      <div
        v-for="(stat, i) in stats"
        :key="stat.id"
        class="flex min-w-0 flex-col px-1 py-3 text-center"
        :class="i > 0 ? 'border-l border-hairline' : ''"
      >
        <dt class="order-2 break-words text-meta text-ink-muted">{{ stat.label }}</dt>
        <dd class="order-1 break-words text-body font-medium text-ink tabular-nums">{{ stat.value }}</dd>
      </div>
    </dl>

    <!-- Details -->
    <ul class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
      <li v-for="row in rows" :key="row.id">
        <button
          type="button"
          :data-test="`progress-${row.id}`"
          @click="openSub(row.id)"
          class="flex min-h-[52px] w-full items-center gap-3 px-4 py-2 text-left active:bg-surface-raised"
        >
          <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">{{ row.icon }}</span>
          <span class="min-w-0 flex-1 break-words text-body text-ink">{{ row.label }} <span v-if="row.isNew" class="inline-block rounded-[6px] bg-accent-soft px-1.5 align-middle text-meta font-medium text-accent">{{ t('progressPanel.new') }}</span></span>
          <span v-if="row.value" class="shrink-0 text-meta text-ink-muted tabular-nums">{{ row.value }}</span>
          <span class="material-symbols-outlined shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
        </button>
      </li>
    </ul>
  </CmBottomSheet>

  <CmBottomSheet
    v-else-if="sub === 'achievements'"
    :title="t('chat.achievements')"
    :description="t('chat.achievementsDescription')"
    :close-label="t('common.close')"
    @close="closeSub"
  >
    <AchievementsPanel class="-mx-5 -mt-4" :new-ids="achievementsNewIds" />
  </CmBottomSheet>
  <WeeklyQuestsPanel v-else-if="sub === 'quests'" @close="closeSub" />
  <AnalyticsDashboard v-else-if="sub === 'analytics'" @close="closeSub" />
  <ShareCardPanel v-else-if="sub === 'share'" @close="closeSub" />
</template>

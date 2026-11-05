<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../composables/useUserProgress'
import { characters } from '../data/characters'
import CmAvatar from './ui/CmAvatar.vue'
import CmBottomSheet from './ui/CmBottomSheet.vue'
import CmProgress from './ui/CmProgress.vue'
import CmStateBlock from './ui/CmStateBlock.vue'

const { t } = useI18n()
const emit = defineEmits(['close'])

const { progress, currentRank, progressToNextRank } = useUserProgress()

function localDateKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Generate last 30 days activity heatmap using real activityLog
const heatmapData = computed(() => {
  const log = progress.value.activityLog || {}
  const days = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const key = localDateKey(date)
    const entry = log[key]
    const total = entry ? (entry.messages || 0) + (entry.diary || 0) * 3 : 0
    // 4-tier intensity: 0=none, 1=light (1-3), 2=medium (4-10), 3=heavy (11+)
    let level = 0
    if (total > 0) level = 1
    if (total >= 4) level = 2
    if (total >= 11) level = 3
    days.push({
      date: key,
      day: date.getDate(),
      level,
      total,
      weekday: date.getDay(),
    })
  }
  return days
})

const hasAnyActivity = computed(() => heatmapData.value.some(d => d.level > 0))

// One accent at four strengths; no extra hues
function intensityClass(level) {
  if (level === 0) return 'bg-surface-raised'
  if (level === 1) return 'bg-accent/30'
  if (level === 2) return 'bg-accent/60'
  return 'bg-accent'
}

const stats = computed(() => [
  { id: 'xp', label: t('analytics.totalXP'), value: progress.value.totalXP },
  { id: 'messages', label: t('analytics.messages'), value: progress.value.messagesSent },
  { id: 'streak', label: t('analytics.streak'), value: t('analytics.days', { count: progress.value.currentStreak }) },
  { id: 'best', label: t('analytics.bestStreak'), value: t('analytics.days', { count: progress.value.longestStreak }) },
  { id: 'words', label: t('analytics.words'), value: (progress.value.wordsLearned || []).length },
  { id: 'achievements', label: t('analytics.achievements'), value: (progress.value.unlockedAchievements || []).length },
])

const characterName = (id) => characters.find(c => c.id === id)?.name || id

const rankProgress = computed(() => progressToNextRank.value)
</script>

<template>
  <CmBottomSheet
    :title="t('analytics.title')"
    :description="t('analytics.description')"
    :close-label="t('common.close')"
    @close="emit('close')"
  >
    <!-- Rank and XP -->
    <section class="mb-6 rounded-[14px] border border-hairline bg-surface p-4">
      <div class="mb-2 flex items-baseline justify-between gap-3">
        <span class="text-body font-medium text-ink">{{ t(`ranks.${currentRank.title.toLowerCase()}`, currentRank.title) }}</span>
        <span class="text-meta text-ink-muted tabular-nums">{{ rankProgress }}%</span>
      </div>
      <CmProgress :value="rankProgress" :max="100" :label="t('analytics.rankProgress')" />
    </section>

    <!-- Stats -->
    <dl class="mb-8 grid grid-cols-3 overflow-hidden rounded-[14px] border border-hairline bg-surface">
      <div
        v-for="(stat, i) in stats"
        :key="stat.id"
        class="flex min-w-0 flex-col px-2 py-3 text-center"
        :class="[i % 3 !== 0 ? 'border-l border-hairline' : '', i >= 3 ? 'border-t border-hairline' : '']"
      >
        <dt class="order-2 text-meta text-ink-muted">{{ stat.label }}</dt>
        <dd class="order-1 text-title font-medium text-ink tabular-nums">{{ stat.value }}</dd>
      </div>
    </dl>

    <!-- 30-Day Activity -->
    <section class="mb-8">
      <div class="mb-3 flex items-center justify-between gap-3">
        <h3 class="text-caption font-medium text-ink-secondary">{{ t('analytics.activity30') }}</h3>
        <div v-if="hasAnyActivity" class="flex items-center gap-1 text-meta text-ink-muted" aria-hidden="true">
          <span>{{ t('analytics.less') }}</span>
          <span class="size-2.5 rounded-[2px] bg-surface-raised"></span>
          <span class="size-2.5 rounded-[2px] bg-accent/30"></span>
          <span class="size-2.5 rounded-[2px] bg-accent/60"></span>
          <span class="size-2.5 rounded-[2px] bg-accent"></span>
          <span>{{ t('analytics.more') }}</span>
        </div>
      </div>
      <CmStateBlock v-if="!hasAnyActivity" icon="timeline" :title="t('analytics.heatmapEmptyTitle')" :body="t('analytics.heatmapEmpty')" />
      <div v-else class="grid grid-cols-10 gap-1">
        <div
          v-for="day in heatmapData"
          :key="day.date"
          class="aspect-square rounded-[2px]"
          :class="intensityClass(day.level)"
          :title="t('analytics.dayActivity', { date: day.date, count: day.total }, day.total)"
          :aria-label="t('analytics.dayActivity', { date: day.date, count: day.total }, day.total)"
          role="img"
        />
      </div>
    </section>

    <!-- Characters Interacted -->
    <section v-if="Object.keys(progress.characterStats || {}).length > 0">
      <h3 class="mb-2 text-caption font-medium text-ink-secondary">{{ t('analytics.characterInteractions') }}</h3>
      <ul class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
        <li
          v-for="(charStats, charId) in progress.characterStats"
          :key="charId"
          class="flex min-h-14 items-center gap-3 px-4 py-2"
        >
          <CmAvatar :name="characterName(charId)" :size="32" />
          <span class="min-w-0 flex-1 text-body text-ink">{{ characterName(charId) }}</span>
          <span class="shrink-0 text-meta text-ink-muted tabular-nums">{{ t('analytics.messagesCount', { count: charStats.messages }, charStats.messages) }}</span>
        </li>
      </ul>
    </section>
  </CmBottomSheet>
</template>

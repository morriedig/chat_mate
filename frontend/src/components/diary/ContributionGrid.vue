<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toLocalDateKey, LOCALE_MAP } from '../../utils/dateUtils'

const props = defineProps({
  entries: {
    type: Array,
    default: () => [],
  },
})

const { locale } = useI18n()

// Show localized labels for Mon, Wed, Fri only (rows 0, 2, 4)
const dayLabels = computed(() => {
  const intlLocale = LOCALE_MAP[locale.value] || locale.value
  const formatter = new Intl.DateTimeFormat(intlLocale, { weekday: 'narrow' })
  // Jan 5 2026 is a Monday
  return Array.from({ length: 7 }, (_, i) => {
    // Only show Mon (0), Wed (2), Fri (4)
    if (i === 0 || i === 2 || i === 4) {
      const d = new Date(2026, 0, 5 + i)
      return formatter.format(d)
    }
    return ''
  })
})

// Build a map from date string to total word count
const wordCountByDate = computed(() => {
  const map = {}
  for (const e of props.entries) {
    if (!e.createdAt) continue
    const key = toLocalDateKey(e.createdAt)
    if (!key) continue
    map[key] = (map[key] || 0) + (e.wordCount || 0)
  }
  return map
})

// Build 8 weeks grid: columns = weeks, rows = days (Mon=0 .. Sun=6)
const grid = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find the Monday of the current week
  const todayDow = today.getDay() // 0=Sun
  const mondayOffset = todayDow === 0 ? 6 : todayDow - 1
  const currentMonday = new Date(today)
  currentMonday.setDate(today.getDate() - mondayOffset)

  // Go back 7 more weeks to get 8 weeks total
  const startMonday = new Date(currentMonday)
  startMonday.setDate(currentMonday.getDate() - 7 * 7)

  const weeks = []
  for (let w = 0; w < 8; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(startMonday)
      date.setDate(startMonday.getDate() + w * 7 + d)
      const key = toLocalDateKey(date)
      const wc = wordCountByDate.value[key] || 0
      const isFuture = date > today
      week.push({ key, wordCount: wc, isFuture })
    }
    weeks.push(week)
  }
  return weeks
})

function intensityClass(wordCount, isFuture) {
  if (isFuture) return 'bg-slate-50 dark:bg-slate-800/50'
  if (wordCount === 0) return 'bg-slate-100 dark:bg-slate-800'
  if (wordCount <= 50) return 'bg-primary/20'
  if (wordCount <= 100) return 'bg-primary/40'
  if (wordCount <= 200) return 'bg-primary/60'
  return 'bg-primary'
}
</script>

<template>
  <div class="w-full">
    <div class="flex gap-[3px]">
      <!-- Day labels column -->
      <div class="flex flex-col gap-[3px] shrink-0 pr-1">
        <div
          v-for="(label, idx) in dayLabels"
          :key="idx"
          class="flex items-center justify-end h-[14px] w-4"
        >
          <span v-if="label" class="text-[9px] text-text-muted dark:text-slate-500 leading-none">{{ label }}</span>
        </div>
      </div>

      <!-- Grid columns (weeks) -->
      <div class="flex gap-[3px] flex-1 justify-end">
        <div
          v-for="(week, wIdx) in grid"
          :key="wIdx"
          class="flex flex-col gap-[3px]"
        >
          <div
            v-for="(day, dIdx) in week"
            :key="day.key"
            class="w-[14px] h-[14px] rounded-sm transition-colors"
            :class="intensityClass(day.wordCount, day.isFuture)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

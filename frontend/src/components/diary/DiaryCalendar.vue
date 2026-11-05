<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toLocalDateKey, getTodayKey, LOCALE_MAP } from '../../utils/dateUtils'

const props = defineProps({
  entries: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select-date'])

const { t, locale } = useI18n()

const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())

const dayLabels = computed(() => {
  const intlLocale = LOCALE_MAP[locale.value] || locale.value
  const formatter = new Intl.DateTimeFormat(intlLocale, { weekday: 'narrow' })
  // Jan 5 2026 is a Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 0, 5 + i)
    return formatter.format(d)
  })
})

// Reactive today so isToday stays correct across midnight
const todayKey = computed(() => getTodayKey())

const monthLabel = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value, 1)
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
})

// Build a set of date strings that have entries
const entryDateSet = computed(() => {
  const set = new Set()
  for (const e of props.entries) {
    if (!e.createdAt) continue
    const key = toLocalDateKey(e.createdAt)
    if (key) set.add(key)
  }
  return set
})

// Calendar grid: array of weeks, each week is array of day objects (or null for padding)
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // getDay() returns 0=Sun, we want 0=Mon
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days = []

  // Padding before first day
  for (let i = 0; i < startDow; i++) {
    days.push(null)
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = toLocalDateKey(new Date(year, month, d))
    const isToday = dateStr === todayKey.value
    const hasEntry = entryDateSet.value.has(dateStr)
    days.push({ day: d, dateStr, isToday, hasEntry })
  }

  return days
})

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function selectDate(cell) {
  if (cell && cell.hasEntry) {
    emit('select-date', cell.dateStr)
  }
}
</script>

<template>
  <div class="w-full">
    <!-- Month navigation -->
    <div class="mb-2 flex items-center justify-between">
      <button
        type="button"
        @click="prevMonth"
        :aria-label="t('diary.prevMonth')"
        class="inline-flex size-11 items-center justify-center rounded-[10px] text-ink-secondary active:bg-surface-raised"
      >
        <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </button>
      <span class="text-caption font-medium text-ink" aria-live="polite">{{ monthLabel }}</span>
      <button
        type="button"
        @click="nextMonth"
        :aria-label="t('diary.nextMonth')"
        class="inline-flex size-11 items-center justify-center rounded-[10px] text-ink-secondary active:bg-surface-raised"
      >
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </button>
    </div>

    <!-- Day labels -->
    <div class="mb-1 grid grid-cols-7" aria-hidden="true">
      <div
        v-for="(label, idx) in dayLabels"
        :key="idx"
        class="py-1 text-center text-meta text-ink-muted"
      >
        {{ label }}
      </div>
    </div>

    <!-- Day grid -->
    <div class="grid grid-cols-7">
      <div
        v-for="(cell, idx) in calendarDays"
        :key="idx"
        class="flex items-center justify-center"
      >
        <template v-if="cell">
          <button
            type="button"
            @click="selectDate(cell)"
            :disabled="!cell.hasEntry"
            :aria-label="cell.dateStr"
            :aria-current="cell.isToday ? 'date' : undefined"
            class="relative flex h-11 w-full max-w-11 items-center justify-center rounded-[10px] border text-caption tabular-nums disabled:cursor-default"
            :class="[
              cell.isToday ? 'border-accent' : 'border-transparent',
              cell.hasEntry ? 'font-medium text-ink active:bg-accent-soft' : 'text-ink-muted',
            ]"
          >
            {{ cell.day }}
            <!-- Entry indicator -->
            <span
              v-if="cell.hasEntry"
              class="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-[1px] bg-accent"
              aria-hidden="true"
            />
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

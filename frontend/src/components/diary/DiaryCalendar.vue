<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  entries: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select-date'])

const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())

const dayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

// Reactive today so isToday stays correct across midnight
const todayKey = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const monthLabel = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value, 1)
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
})

// Build a set of date strings that have entries
const entryDateSet = computed(() => {
  const set = new Set()
  for (const e of props.entries) {
    if (!e.createdAt) continue
    const d = new Date(e.createdAt)
    if (isNaN(d.getTime())) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    set.add(key)
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
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
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
    <div class="flex items-center justify-between mb-3 px-1">
      <button
        @click="prevMonth"
        class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 transition-colors"
      >
        <span class="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>
      <span class="text-sm font-semibold text-text-main dark:text-white">{{ monthLabel }}</span>
      <button
        @click="nextMonth"
        class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-main dark:text-slate-200 transition-colors"
      >
        <span class="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </div>

    <!-- Day labels -->
    <div class="grid grid-cols-7 gap-0 mb-1">
      <div
        v-for="label in dayLabels"
        :key="label"
        class="text-center text-[10px] font-medium text-text-muted dark:text-slate-500 py-1"
      >
        {{ label }}
      </div>
    </div>

    <!-- Day grid -->
    <div class="grid grid-cols-7 gap-0">
      <div
        v-for="(cell, idx) in calendarDays"
        :key="idx"
        class="flex flex-col items-center justify-center py-1.5"
      >
        <template v-if="cell">
          <button
            @click="selectDate(cell)"
            class="relative flex items-center justify-center w-8 h-8 rounded-full text-xs transition-colors"
            :class="[
              cell.isToday ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-surface-dark' : '',
              cell.hasEntry ? 'text-text-main dark:text-white font-semibold cursor-pointer hover:bg-primary/10' : 'text-slate-400 dark:text-slate-600 cursor-default',
            ]"
          >
            {{ cell.day }}
            <!-- Entry indicator dot -->
            <span
              v-if="cell.hasEntry"
              class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
            />
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CmChip from '../ui/CmChip.vue'

const { t } = useI18n()

const props = defineProps({
  // [{ id, phrase }]
  targets: {
    type: Array,
    required: true
  },
  usedIds: {
    type: Array,
    default: () => []
  },
  // Phrase of the connector just used (shows a short friend-style note)
  justUsed: {
    type: String,
    default: null
  },
  // Task chat: the goal line, and a summary button that opens the summary
  task: {
    type: String,
    default: ''
  },
  canEnd: {
    type: Boolean,
    default: false
  },
  // Opinion chat reuses the strip: its own label, a gloss under the topic, and an end label
  label: {
    type: String,
    default: ''
  },
  gloss: {
    type: String,
    default: ''
  },
  endLabel: {
    type: String,
    default: ''
  },
  showCount: {
    type: Boolean,
    default: true
  },
  // One-row summary (v-model:collapsed); the parent collapses it on short screens
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back', 'end', 'update:collapsed'])

const usedCount = computed(() => props.targets.filter(tg => props.usedIds.includes(tg.id)).length)
const isComplete = computed(() => props.showCount && props.targets.length > 0 && usedCount.value === props.targets.length)
const title = computed(() => props.label || (props.task ? t('taskChat.title') : t('mission.title')))
// Task and opinion chats can end into a summary; a lesson mission goes back to learning
const hasEnd = computed(() => !!(props.task || props.endLabel))
</script>

<template>
  <section class="mission-strip relative shrink-0 border-b border-hairline bg-surface pl-4 pr-2 pt-1 sm:pl-6 sm:pr-4"
    :class="collapsed ? 'pb-1' : 'pb-3'" :aria-label="title">
    <span class="absolute left-0 top-3 w-[3px] rounded-r-[3px] bg-accent" :class="collapsed ? 'h-7' : 'h-10'" aria-hidden="true"></span>

    <div class="flex min-h-11 items-center gap-3">
      <h2 class="min-w-0 flex-1 text-meta font-medium text-ink-secondary">
        <!-- Tapping the title collapses the strip to one row (and expands it again) -->
        <button
          type="button"
          @click="emit('update:collapsed', !collapsed)"
          :aria-expanded="!collapsed"
          class="mission-toggle -ml-1 flex min-h-11 w-full min-w-0 items-center gap-1 rounded-[10px] px-1 text-left"
        >
          <span class="min-w-0 truncate">{{ title }}</span>
          <span class="material-symbols-outlined shrink-0 !text-[18px] text-ink-muted" aria-hidden="true">{{ collapsed ? 'expand_more' : 'expand_less' }}</span>
          <span v-if="collapsed && task" class="min-w-0 flex-1 truncate font-normal text-ink">{{ task }}</span>
        </button>
      </h2>
      <span v-if="showCount" class="mission-count shrink-0 text-meta text-ink-muted tabular-nums">{{ usedCount }} / {{ targets.length }}</span>
      <button
        v-if="hasEnd"
        type="button"
        @click="emit('end')"
        :disabled="!canEnd"
        class="mission-end -my-1 inline-flex min-h-11 shrink-0 items-center rounded-[10px] px-2 text-caption font-medium text-accent disabled:text-ink-muted disabled:opacity-55"
      >{{ endLabel || t('taskChat.seeSummary') }}</button>
    </div>

    <template v-if="!collapsed">
    <p v-if="task" class="mission-goal pr-2 text-body text-ink">{{ task }}</p>
    <p v-if="gloss" class="pr-2 text-caption text-ink-muted">{{ gloss }}</p>

    <!-- Target chips: neutral until used, then success with a check (no pop) -->
    <ul v-if="targets.length" class="no-scrollbar -mr-2 mt-2 flex gap-1.5 overflow-x-auto pr-2" role="list">
      <li v-for="target in targets" :key="target.id" class="shrink-0">
        <CmChip
          :done="usedIds.includes(target.id)"
          class="mission-chip whitespace-nowrap"
          :class="usedIds.includes(target.id) ? 'is-used' : ''"
        >{{ target.phrase }}<span v-if="usedIds.includes(target.id)" class="sr-only">, {{ t('mission.used') }}</span></CmChip>
      </li>
    </ul>

    <!-- One short note -->
    <p v-if="isComplete" class="mt-2 flex flex-wrap items-center gap-x-2 text-caption text-success" role="status">
      <span class="inline-flex items-center gap-1">
        <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">task_alt</span>
        {{ task ? t('taskChat.complete') : t('mission.complete') }}
      </span>
      <button
        v-if="!hasEnd"
        type="button"
        @click="emit('back')"
        class="inline-flex min-h-11 items-center font-medium text-accent"
      >{{ t('mission.backToLearning') }}</button>
    </p>
    <p v-else-if="justUsed" class="mt-2 text-caption text-accent" role="status">
      {{ t('mission.nice', { phrase: justUsed }) }}
    </p>
    </template>
  </section>
</template>

<style scoped>
.no-scrollbar {
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

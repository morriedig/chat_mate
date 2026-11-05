<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScenarioRoleplay } from '../composables/useScenarioRoleplay'
import CmBottomSheet from './ui/CmBottomSheet.vue'
import CmStateBlock from './ui/CmStateBlock.vue'

const { t, locale } = useI18n()
const props = defineProps({
  level: { type: String, default: 'intermediate' },
})
const emit = defineEmits(['select', 'close'])

const { getScenarios, completedCount, getAllScenarioCount } = useScenarioRoleplay()

const scenarios = computed(() => getScenarios(props.level, locale.value))
const totalCount = computed(() => getAllScenarioCount())
</script>

<template>
  <CmBottomSheet
    :title="t('scenarios.title')"
    :description="t('scenarios.subtitle', { done: completedCount, total: totalCount })"
    :close-label="t('common.close')"
    @close="emit('close')"
  >
    <p class="mb-4 text-caption text-ink-secondary">{{ t('scenarios.howItWorks') }}</p>

    <ul v-if="scenarios.length" class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
      <li v-for="scenario in scenarios" :key="scenario.id">
        <button
          type="button"
          @click="emit('select', scenario)"
          class="flex w-full items-start gap-3 px-4 py-3 text-left active:bg-surface-raised"
        >
          <span
            class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[10px]"
            :class="scenario.completed ? 'bg-success-soft text-success' : 'bg-accent-soft text-accent'"
            aria-hidden="true"
          >
            <span class="material-symbols-outlined !text-[18px]">{{ scenario.completed ? 'check' : 'play_arrow' }}</span>
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-body font-medium text-ink">{{ scenario.title }}</span>
            <span v-if="scenario.completed" class="block text-meta text-success">{{ t('scenarios.completed') }}</span>
            <span class="mt-0.5 block text-caption text-ink-secondary">
              <span class="font-medium">{{ t('scenarios.goalLabel') }}</span> {{ scenario.goal }}
            </span>
            <span v-if="scenario.vocab && scenario.vocab.length" class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="v in scenario.vocab.slice(0, 3)"
                :key="v"
                lang="en"
                class="rounded-[6px] border border-hairline bg-surface-raised px-1.5 py-0.5 text-meta text-ink-secondary"
              >{{ v }}</span>
            </span>
          </span>
          <span class="material-symbols-outlined mt-1 shrink-0 text-ink-muted" aria-hidden="true">chevron_right</span>
        </button>
      </li>
    </ul>

    <CmStateBlock v-else icon="theater_comedy" :title="t('scenarios.noneAtLevel')" />
  </CmBottomSheet>
</template>

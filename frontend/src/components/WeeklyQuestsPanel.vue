<script setup>
import { useI18n } from 'vue-i18n'
import { useWeeklyQuests } from '../composables/useWeeklyQuests'
import { useUserProgress } from '../composables/useUserProgress'
import CmBottomSheet from './ui/CmBottomSheet.vue'
import CmProgress from './ui/CmProgress.vue'

const { t } = useI18n()
const emit = defineEmits(['close'])

const { quests, allCompleted, claimReward } = useWeeklyQuests()
const { addXP } = useUserProgress()

function handleClaim(quest) {
  const reward = claimReward(quest.id)
  if (reward > 0) {
    addXP(reward, 'weeklyQuest')
  }
}
</script>

<template>
  <CmBottomSheet
    :title="t('weeklyQuests.title')"
    :description="t('weeklyQuests.description')"
    :close-label="t('common.close')"
    @close="emit('close')"
  >
    <!-- All done -->
    <div v-if="allCompleted" role="status" class="mb-4 flex items-center gap-3 rounded-[14px] border border-success/25 bg-success-soft p-4">
      <span class="material-symbols-outlined shrink-0 text-success" aria-hidden="true">task_alt</span>
      <p class="text-caption font-medium text-ink">{{ t('weeklyQuests.allDone') }}</p>
    </div>

    <!-- Quest list -->
    <ul class="divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline bg-surface">
      <li v-for="quest in quests" :key="quest.id" class="flex min-h-16 items-center gap-3 px-4 py-3">
        <div class="min-w-0 flex-1">
          <p class="flex items-start gap-1.5 text-body text-ink">
            <span v-if="quest.completed" class="material-symbols-outlined mt-0.5 shrink-0 !text-[18px] text-success" :aria-label="t('weeklyQuests.done')">check</span>
            <span class="min-w-0">{{ t(quest.key) }}</span>
          </p>
          <div class="mt-2 flex items-center gap-2">
            <CmProgress class="flex-1" :value="Math.min(quest.progress, quest.target)" :max="quest.target" :label="t(quest.key)" />
            <span class="shrink-0 text-meta text-ink-muted tabular-nums">{{ quest.progress }} / {{ quest.target }}</span>
          </div>
        </div>

        <!-- Reward / Claim -->
        <div class="shrink-0">
          <button
            v-if="quest.completed && !quest.claimed"
            type="button"
            @click="handleClaim(quest)"
            class="min-h-11 rounded-[10px] bg-accent px-3 text-caption font-medium text-on-accent active:bg-accent-pressed"
          >
            {{ t('weeklyQuests.claimReward') }} +{{ quest.reward }}
          </button>
          <span v-else-if="quest.claimed" class="text-meta text-success tabular-nums">
            {{ t('weeklyQuests.claimed') }} +{{ quest.reward }}
          </span>
          <span v-else class="text-meta text-ink-muted tabular-nums">
            +{{ quest.reward }} XP
          </span>
        </div>
      </li>
    </ul>
  </CmBottomSheet>
</template>

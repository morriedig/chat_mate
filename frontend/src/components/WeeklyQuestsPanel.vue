<script setup>
import { useI18n } from 'vue-i18n'
import { useWeeklyQuests } from '../composables/useWeeklyQuests'
import { useUserProgress } from '../composables/useUserProgress'

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
  <Teleport to="body">
    <Transition name="slide-up">
      <div class="fixed inset-0 z-[90] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/40" @click="emit('close')" />
        <div class="relative w-full max-w-lg bg-surface-light dark:bg-surface-dark rounded-t-2xl p-6 pb-8 max-h-[70vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">assignment</span>
              {{ t('weeklyQuests.title') }}
            </h2>
            <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- All done -->
          <div v-if="allCompleted" class="text-center py-6">
            <span class="material-symbols-outlined text-5xl text-green-500 mb-2">celebration</span>
            <p class="text-green-600 dark:text-green-400 font-bold">{{ t('weeklyQuests.allDone') }}</p>
          </div>

          <!-- Quest list -->
          <div class="space-y-3">
            <div
              v-for="quest in quests"
              :key="quest.id"
              class="p-4 rounded-xl border transition-all"
              :class="quest.completed
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex-1">
                  <p class="font-medium text-text-main dark:text-white text-sm">
                    {{ t(quest.key) }}
                  </p>
                  <!-- Progress bar -->
                  <div class="mt-2 flex items-center gap-2">
                    <div class="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all"
                        :class="quest.completed ? 'bg-green-400' : 'bg-primary'"
                        :style="{ width: `${Math.min(quest.progress / quest.target, 1) * 100}%` }"
                      />
                    </div>
                    <span class="text-xs text-text-muted dark:text-slate-400 shrink-0">
                      {{ quest.progress }}/{{ quest.target }}
                    </span>
                  </div>
                </div>

                <!-- Reward / Claim button -->
                <div class="shrink-0">
                  <button
                    v-if="quest.completed && !quest.claimed"
                    @click="handleClaim(quest)"
                    class="px-3 py-1.5 rounded-lg bg-primary text-[#0d171b] text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    {{ t('weeklyQuests.claimReward') }} +{{ quest.reward }}
                  </button>
                  <span v-else-if="quest.claimed" class="text-xs text-green-500 font-medium">
                    {{ t('weeklyQuests.claimed') }} +{{ quest.reward }}
                  </span>
                  <span v-else class="text-xs text-text-muted dark:text-slate-400">
                    +{{ quest.reward }} XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

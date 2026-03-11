<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScenarioRoleplay } from '../composables/useScenarioRoleplay'

const { t, locale } = useI18n()
const props = defineProps({
  level: { type: String, default: 'intermediate' },
})
const emit = defineEmits(['select', 'close'])

const { getScenarios, completedCount } = useScenarioRoleplay()

const scenarios = computed(() => getScenarios(props.level, locale.value))
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div class="fixed inset-0 z-[90] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/40" @click="emit('close')" />
        <div class="relative w-full max-w-lg bg-surface-light dark:bg-surface-dark rounded-t-2xl p-6 pb-8 max-h-[70vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">theater_comedy</span>
                {{ t('scenarios.title') }}
              </h2>
              <p class="text-sm text-text-muted dark:text-slate-400 mt-1">
                {{ t('scenarios.completedCount', { count: completedCount }) }}
              </p>
            </div>
            <button @click="emit('close')" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Scenarios -->
          <div class="space-y-3">
            <div
              v-for="scenario in scenarios"
              :key="scenario.id"
              @click="emit('select', scenario)"
              class="p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary"
              :class="scenario.completed
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'"
            >
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-2xl" :class="scenario.completed ? 'text-green-500' : 'text-primary'">
                  {{ scenario.completed ? 'check_circle' : 'play_circle' }}
                </span>
                <div class="flex-1">
                  <h3 class="font-bold text-text-main dark:text-white">{{ scenario.title }}</h3>
                  <p class="text-sm text-text-muted dark:text-slate-400 mt-0.5">
                    {{ t('scenarios.goal') }}: {{ scenario.goal }}
                  </p>
                </div>
                <span class="material-symbols-outlined text-slate-400">chevron_right</span>
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

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScenarioRoleplay } from '../composables/useScenarioRoleplay'

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
  <Teleport to="body">
    <Transition name="scenario-sheet">
      <div class="fixed inset-0 z-[90] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')" />
        <div class="scenario-sheet relative w-full max-w-lg bg-surface-light dark:bg-surface-dark rounded-t-3xl max-h-[82vh] flex flex-col shadow-2xl">
          <!-- Grab handle -->
          <div class="flex justify-center pt-3 pb-1 shrink-0">
            <div class="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
          </div>

          <!-- Header -->
          <div class="px-6 pt-3 pb-4 shrink-0 border-b border-slate-100 dark:border-slate-700">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 class="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">theater_comedy</span>
                  {{ t('scenarios.title') }}
                </h2>
                <p class="text-xs text-text-muted dark:text-slate-400 mt-0.5">
                  Real-world conversations with hidden objectives · {{ completedCount }}/{{ totalCount }} completed
                </p>
              </div>
              <button
                @click="emit('close')"
                class="shrink-0 p-1 rounded-lg text-text-muted dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <p class="mt-3 text-[11px] text-text-muted dark:text-slate-400 leading-relaxed bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-lg p-2">
              Your character plays a role and tracks hidden objectives. Hit the goal to unlock the scenario.
            </p>
          </div>

          <!-- Scenarios list -->
          <div class="flex-1 overflow-y-auto p-5 space-y-2.5">
            <div
              v-for="scenario in scenarios"
              :key="scenario.id"
              @click="emit('select', scenario)"
              class="group p-4 rounded-2xl border cursor-pointer transition-all"
              :class="scenario.completed
                ? 'border-green-300 dark:border-green-700/60 bg-gradient-to-br from-green-50 to-emerald-50/40 dark:from-green-900/20 dark:to-emerald-900/10'
                : 'border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark hover:border-primary hover:shadow-md'"
            >
              <div class="flex items-start gap-3">
                <div
                  class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                  :class="scenario.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-[#0d171b]'"
                >
                  <span class="material-symbols-outlined text-[22px]">
                    {{ scenario.completed ? 'check' : 'play_arrow' }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-sm text-text-main dark:text-white">{{ scenario.title }}</h3>
                  <p class="text-xs text-text-muted dark:text-slate-400 mt-0.5 leading-relaxed">
                    <span class="font-medium">Goal:</span> {{ scenario.goal }}
                  </p>
                  <div v-if="scenario.vocab && scenario.vocab.length" class="flex flex-wrap gap-1 mt-2">
                    <span
                      v-for="v in scenario.vocab.slice(0, 3)"
                      :key="v"
                      class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-text-muted dark:text-slate-400"
                    >
                      {{ v }}
                    </span>
                  </div>
                </div>
                <span class="material-symbols-outlined shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors mt-1">chevron_right</span>
              </div>
            </div>

            <div v-if="scenarios.length === 0" class="py-10 text-center">
              <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2 block">hourglass_empty</span>
              <p class="text-sm text-text-muted dark:text-slate-400">
                No scenarios at this level yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.scenario-sheet-enter-active,
.scenario-sheet-leave-active {
  transition: opacity 260ms ease;
}
.scenario-sheet-enter-active .scenario-sheet,
.scenario-sheet-leave-active .scenario-sheet {
  transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scenario-sheet-enter-from,
.scenario-sheet-leave-to {
  opacity: 0;
}
.scenario-sheet-enter-from .scenario-sheet,
.scenario-sheet-leave-to .scenario-sheet {
  transform: translateY(100%);
}
</style>

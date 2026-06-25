<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCharacterMemory } from '../../composables/useCharacterMemory'

const { t } = useI18n()

const props = defineProps({
  character: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const { getMemories, getMeta, removeMemory, clearMemories } = useCharacterMemory()

const memories = computed(() => getMemories(props.character.id))
const meta = computed(() => getMeta(props.character.id))

const daysKnown = computed(() => {
  if (!meta.value.firstMet) return 0
  return Math.max(1, Math.floor((Date.now() - meta.value.firstMet) / (24 * 60 * 60 * 1000)))
})

function handleRemove(i) {
  removeMemory(props.character.id, i)
}

function handleClearAll() {
  if (window.confirm(`Forget everything ${props.character.name} remembers about you? This cannot be undone.`)) {
    clearMemories(props.character.id)
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-scale">
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')" />
        <div class="relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="p-5 pb-3 border-b border-slate-200 dark:border-slate-700">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex items-center justify-center rounded-full size-12 shrink-0 shadow-sm bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/40 dark:to-rose-900/40 text-2xl">
                  {{ character.avatar }}
                </div>
                <div class="min-w-0">
                  <h2 class="font-bold text-text-main dark:text-white truncate">
                    What {{ character.name }} remembers
                  </h2>
                  <p class="text-xs text-text-muted dark:text-slate-400">
                    <span v-if="meta.conversationCount">{{ meta.conversationCount }} conversation{{ meta.conversationCount === 1 ? '' : 's' }}</span>
                    <span v-if="daysKnown > 0"> · {{ daysKnown }} day{{ daysKnown === 1 ? '' : 's' }} knowing you</span>
                  </p>
                </div>
              </div>
              <button @click="emit('close')" class="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <!-- Memory list -->
          <div class="flex-1 overflow-y-auto p-5 pt-4">
            <div v-if="memories.length === 0" class="text-center py-10">
              <span class="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-2">psychology</span>
              <p class="text-text-muted dark:text-slate-400 text-sm">
                {{ character.name }} hasn't learned anything about you yet.
              </p>
              <p class="text-text-muted dark:text-slate-500 text-xs mt-2">
                Share a bit about yourself in the chat — your name, where you live, what you do.
                {{ character.name }} will remember.
              </p>
            </div>
            <ul v-else class="space-y-2">
              <li
                v-for="(memory, i) in memories"
                :key="i"
                class="group flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40"
              >
                <span class="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">favorite</span>
                <p class="flex-1 text-sm text-text-main dark:text-slate-200 leading-relaxed">{{ memory.fact }}</p>
                <button
                  @click="handleRemove(i)"
                  class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                  title="Forget this"
                >
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Footer -->
          <div v-if="memories.length > 0" class="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <button
              @click="handleClearAll"
              class="w-full text-xs text-text-muted dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Clear all memories
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../composables/useUserProgress'
import { useShareCard } from '../composables/useShareCard'

const { t } = useI18n()
const emit = defineEmits(['close'])

const { progress, currentRank } = useUserProgress()
const { shareProgress, generateShareImage } = useShareCard()

const cardRef = ref(null)
const isSharing = ref(false)

async function handleShare() {
  if (!cardRef.value || isSharing.value) return
  isSharing.value = true
  try {
    await shareProgress(cardRef.value, t('shareCard.title'))
  } finally {
    isSharing.value = false
  }
}

async function handleDownload() {
  if (!cardRef.value || isSharing.value) return
  isSharing.value = true
  try {
    const dataUrl = await generateShareImage(cardRef.value)
    const link = document.createElement('a')
    link.download = 'chat-mate-progress.png'
    link.href = dataUrl
    link.click()
  } finally {
    isSharing.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div class="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="emit('close')" />
        <div class="relative w-full max-w-sm">
          <!-- Share Card (rendered for capture) -->
          <div ref="cardRef" class="rounded-2xl overflow-hidden shadow-2xl">
            <div class="bg-gradient-to-br from-[#0d171b] via-[#162830] to-[#1a3040] p-6 text-white">
              <!-- Logo -->
              <div class="text-center mb-4">
                <h2 class="text-2xl font-bold">Chat Mate</h2>
                <p class="text-sm text-slate-400">{{ t('shareCard.title') }}</p>
              </div>

              <!-- Stats grid -->
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="bg-white/10 rounded-xl p-3 text-center">
                  <p class="text-2xl font-bold text-primary">{{ progress.totalXP }}</p>
                  <p class="text-xs text-slate-400">XP</p>
                </div>
                <div class="bg-white/10 rounded-xl p-3 text-center">
                  <p class="text-2xl font-bold text-amber-400">{{ progress.currentStreak }}</p>
                  <p class="text-xs text-slate-400">Streak</p>
                </div>
                <div class="bg-white/10 rounded-xl p-3 text-center">
                  <p class="text-2xl font-bold text-green-400">{{ progress.messagesSent }}</p>
                  <p class="text-xs text-slate-400">Messages</p>
                </div>
                <div class="bg-white/10 rounded-xl p-3 text-center">
                  <p class="text-2xl font-bold text-purple-400 capitalize">{{ currentRank?.name || 'Novice' }}</p>
                  <p class="text-xs text-slate-400">Rank</p>
                </div>
              </div>

              <!-- Achievements count -->
              <div class="text-center text-sm text-slate-400">
                {{ (progress.unlockedAchievements || []).length }} achievements unlocked
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-3 mt-4">
            <button
              @click="handleShare"
              :disabled="isSharing"
              class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-[#0d171b] font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span class="material-symbols-outlined text-lg">share</span>
              {{ t('shareCard.share') }}
            </button>
            <button
              @click="handleDownload"
              :disabled="isSharing"
              class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-text-main dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <span class="material-symbols-outlined text-lg">download</span>
            </button>
            <button
              @click="emit('close')"
              class="flex items-center justify-center px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-text-main dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

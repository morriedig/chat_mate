<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProgress } from '../composables/useUserProgress'
import { useShareCard } from '../composables/useShareCard'
import CmBottomSheet from './ui/CmBottomSheet.vue'
import CmButton from './ui/CmButton.vue'

const { t } = useI18n()
const emit = defineEmits(['close'])

const { progress, currentRank } = useUserProgress()
const { shareProgress, generateShareImage } = useShareCard()

const cardRef = ref(null)
const isSharing = ref(false)

// The exported image keeps a fixed paper look in both themes.
// Plain hex in inline styles so html2canvas can read every color.
const paper = {
  card: 'background:#FFFCF6;color:#1B2527;border:1px solid #E4E1DA;border-radius:14px;',
  rule: 'background:#0E6674;',
  cell: 'background:#F6F3EC;border:1px solid #E4E1DA;border-radius:10px;',
  muted: 'color:#63706F;',
  accent: 'color:#0E6674;',
}

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
  <CmBottomSheet
    :title="t('shareCard.share')"
    :description="t('shareCard.description')"
    :close-label="t('common.close')"
    @close="emit('close')"
  >
    <!-- Share Card (rendered for capture) -->
    <div ref="cardRef" class="relative mx-auto max-w-sm overflow-hidden p-5" :style="paper.card">
      <span class="absolute left-0 top-5 h-9 w-[3px]" :style="paper.rule" aria-hidden="true"></span>
      <p class="text-title font-semibold">Chat Mate</p>
      <p class="text-caption" :style="paper.muted">{{ t('shareCard.title') }}</p>

      <dl class="mt-4 grid grid-cols-2 gap-2">
        <div class="p-3" :style="paper.cell">
          <dt class="text-meta" :style="paper.muted">XP</dt>
          <dd class="text-section font-medium tabular-nums" :style="paper.accent">{{ progress.totalXP }}</dd>
        </div>
        <div class="p-3" :style="paper.cell">
          <dt class="text-meta" :style="paper.muted">{{ t('shareCard.streak') }}</dt>
          <dd class="text-section font-medium tabular-nums">{{ progress.currentStreak }}</dd>
        </div>
        <div class="p-3" :style="paper.cell">
          <dt class="text-meta" :style="paper.muted">{{ t('shareCard.messages') }}</dt>
          <dd class="text-section font-medium tabular-nums">{{ progress.messagesSent }}</dd>
        </div>
        <div class="p-3" :style="paper.cell">
          <dt class="text-meta" :style="paper.muted">{{ t('shareCard.rank') }}</dt>
          <dd class="text-section font-medium">{{ t(`ranks.${currentRank.title.toLowerCase()}`, currentRank.title) }}</dd>
        </div>
      </dl>

      <!-- Achievements count -->
      <p class="mt-4 text-caption" :style="paper.muted">
        {{ t('shareCard.achievementsUnlocked', { count: (progress.unlockedAchievements || []).length }, (progress.unlockedAchievements || []).length) }}
      </p>
    </div>

    <template #actions>
      <div class="flex gap-3">
        <CmButton class="flex-1" @click="handleShare" :disabled="isSharing">
          <span class="material-symbols-outlined" aria-hidden="true">share</span>
          {{ t('shareCard.share') }}
        </CmButton>
        <CmButton variant="secondary" @click="handleDownload" :disabled="isSharing" :aria-label="t('shareCard.download')">
          <span class="material-symbols-outlined" aria-hidden="true">download</span>
        </CmButton>
      </div>
    </template>
  </CmBottomSheet>
</template>

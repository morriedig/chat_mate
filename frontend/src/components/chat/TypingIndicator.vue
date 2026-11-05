<script setup>
import { useI18n } from 'vue-i18n'
import CmAvatar from '../ui/CmAvatar.vue'

const { t } = useI18n()
defineProps({
  character: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="typing-indicator flex items-end gap-2" role="status">
    <!-- Static: the friend's name, a short sentence, and two bars shaped like a reply -->
    <CmAvatar :name="character.name" :size="32" />
    <div class="flex min-w-0 flex-col items-start gap-1">
      <span class="ml-1 text-meta text-ink-muted">{{ t('chat.typing', { name: character.name }) }}</span>
      <div class="flex w-36 flex-col gap-2 rounded-[14px] rounded-bl-[6px] border border-hairline bg-surface px-3.5 py-3.5" aria-hidden="true">
        <span class="typing-bar h-2.5 w-full rounded-[3px] bg-accent-soft"></span>
        <span class="typing-bar h-2.5 w-3/5 rounded-[3px] bg-surface-raised"></span>
      </div>
    </div>
  </div>
</template>

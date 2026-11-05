<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCharacterMemory } from '../../composables/useCharacterMemory'
import CmBottomSheet from '../ui/CmBottomSheet.vue'
import CmAvatar from '../ui/CmAvatar.vue'
import CmStateBlock from '../ui/CmStateBlock.vue'

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

const description = computed(() => [
  meta.value.conversationCount ? t('memory.conversations', { count: meta.value.conversationCount }, meta.value.conversationCount) : '',
  daysKnown.value > 0 ? t('memory.daysKnowing', { count: daysKnown.value }, daysKnown.value) : '',
].filter(Boolean).join(' · '))

function handleRemove(i) {
  removeMemory(props.character.id, i)
}

function handleClearAll() {
  if (window.confirm(t('memory.clearConfirm', { name: props.character.name }))) {
    clearMemories(props.character.id)
    emit('close')
  }
}
</script>

<template>
  <CmBottomSheet
    :title="t('memory.title', { name: character.name })"
    :description="description"
    :close-label="t('chat.close')"
    @close="emit('close')"
  >
    <template #leading>
      <CmAvatar :name="character.name" :size="48" />
    </template>

    <CmStateBlock
      v-if="memories.length === 0"
      icon="psychology"
      :title="t('memory.emptyTitle', { name: character.name })"
      :body="t('memory.emptyBody', { name: character.name })"
    />
    <ul v-else class="memory-list divide-y divide-hairline overflow-hidden rounded-[14px] border border-hairline">
      <li
        v-for="(memory, i) in memories"
        :key="i"
        class="flex items-start gap-2 bg-surface py-1 pl-3 pr-1"
      >
        <p class="min-w-0 flex-1 py-2.5 text-body text-ink">{{ memory.fact }}</p>
        <button
          type="button"
          @click="handleRemove(i)"
          :aria-label="t('memory.forget')"
          :title="t('memory.forget')"
          class="flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-muted active:bg-surface-raised"
        >
          <span class="material-symbols-outlined" aria-hidden="true">delete</span>
        </button>
      </li>
    </ul>

    <template v-if="memories.length > 0" #actions>
      <button
        type="button"
        @click="handleClearAll"
        class="memory-clear flex min-h-11 w-full items-center justify-center rounded-[10px] text-body text-error active:bg-surface-raised"
      >
        {{ t('memory.clearAll') }}
      </button>
    </template>
  </CmBottomSheet>
</template>

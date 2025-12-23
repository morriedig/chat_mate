<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'send'])

const inputRef = ref(null)
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  localValue.value = val
})

function handleInput(e) {
  localValue.value = e.target.value
  emit('update:modelValue', e.target.value)
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    emit('send')
  }
}

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="p-4 sm:p-6 bg-surface-light dark:bg-surface-dark border-t border-[#e7eff3] dark:border-slate-800 z-10">
    <div class="flex items-center gap-3 max-w-4xl mx-auto">
      <div class="flex-1 relative">
        <textarea
          ref="inputRef"
          :value="localValue"
          @input="handleInput"
          @keydown="handleKeydown"
          :disabled="disabled"
          class="w-full resize-none rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1e2930] text-text-main dark:text-white px-4 py-3 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary dark:focus:ring-primary placeholder-slate-400 disabled:opacity-50"
          :placeholder="t('chat.typeMessage')"
          rows="1"
          style="min-height: 50px; max-height: 150px;"
        ></textarea>
      </div>
      <button
        @click="emit('send')"
        :disabled="!localValue.trim() || disabled"
        class="shrink-0 flex items-center justify-center size-12 rounded-full bg-primary text-[#0d171b] shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
      >
        <span class="material-symbols-outlined icon-filled text-[24px]">send</span>
      </button>
    </div>
    <div class="text-center mt-2">
      <p class="text-[11px] text-slate-400 dark:text-slate-500">Press Enter to send, Shift+Enter for new line</p>
    </div>
  </div>
</template>

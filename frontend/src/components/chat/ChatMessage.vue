<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  },
  character: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <!-- Bot Message -->
  <div v-if="message.role === 'assistant'" class="flex items-end gap-2 sm:gap-3 max-w-[calc(100%-2.5rem)] sm:max-w-3xl">
    <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl">
      {{ character.avatar }}
    </div>
    <div class="flex flex-col gap-1 items-start min-w-0 overflow-hidden">
      <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium ml-1">{{ character.name }}</span>
      <div class="p-3 sm:p-4 rounded-2xl rounded-bl-none bg-surface-light dark:bg-surface-dark text-text-main dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700">
        <p class="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{{ message.content }}</p>
      </div>
    </div>
  </div>

  <!-- User Message -->
  <div v-else class="flex items-end gap-2 sm:gap-3 justify-end">
    <div class="flex flex-col gap-1 items-end min-w-0 max-w-[80%] sm:max-w-xl">
      <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium mr-1">You</span>
      <div class="p-3 sm:p-4 rounded-2xl rounded-br-none bg-primary text-[#0d171b] shadow-md">
        <p class="text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap break-words">{{ message.content }}</p>
      </div>
    </div>
    <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-primary/20 text-xl sm:text-2xl">
      👤
    </div>
  </div>
</template>

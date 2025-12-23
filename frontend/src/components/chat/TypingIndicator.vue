<script setup>
defineProps({
  character: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="flex items-end gap-2 sm:gap-3 max-w-full sm:max-w-3xl">
    <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl">
      {{ character.avatar }}
    </div>
    <div class="flex flex-col gap-1 items-start">
      <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium ml-1">{{ character.name }}</span>
      <div class="p-3 sm:p-4 rounded-2xl rounded-bl-none bg-surface-light dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex gap-1">
          <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
      </div>
    </div>
  </div>
</template>

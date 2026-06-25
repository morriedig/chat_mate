<script setup>
defineProps({
  character: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="flex items-end gap-2 sm:gap-3 max-w-full sm:max-w-3xl typing-container">
    <div class="flex items-center justify-center rounded-full size-8 sm:size-10 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl sm:text-2xl typing-avatar">
      {{ character.avatar }}
    </div>
    <div class="flex flex-col gap-1 items-start">
      <span class="text-text-muted dark:text-slate-400 text-[13px] font-medium ml-1">
        {{ character.name }}
        <span class="text-text-muted/70 dark:text-slate-500"> is typing…</span>
      </span>
      <div class="px-4 py-3 rounded-2xl rounded-bl-none bg-surface-light dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex gap-1.5 items-center">
          <span class="typing-dot animate-bounce" style="animation-delay: 0ms"></span>
          <span class="typing-dot animate-bounce" style="animation-delay: 150ms"></span>
          <span class="typing-dot animate-bounce" style="animation-delay: 300ms"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.typing-container {
  animation: typing-fade-in 260ms ease-out;
}

@keyframes typing-fade-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.typing-avatar {
  animation: typing-avatar-breathe 2.4s ease-in-out infinite;
}

@keyframes typing-avatar-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

.typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgb(148 163 184), rgb(100 116 139));
}

:global(.dark) .typing-dot {
  background: linear-gradient(135deg, rgb(100 116 139), rgb(71 85 105));
}
</style>

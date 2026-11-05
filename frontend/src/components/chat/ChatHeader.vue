<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDarkMode } from '../../composables/useDarkMode'
import CmAvatar from '../ui/CmAvatar.vue'

const { t } = useI18n()
const { isDark, toggle: toggleDark } = useDarkMode()

const props = defineProps({
  character: {
    type: Object,
    required: true
  },
  level: {
    type: Object,
    required: true
  },
  isArticleMode: {
    type: Boolean,
    default: false
  },
  showArticle: {
    type: Boolean,
    default: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  memoryCount: {
    type: Number,
    default: 0
  },
  conversationCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['back', 'toggle-article', 'renew-chat', 'toggle-vocab-bank', 'show-memories', 'show-achievements'])

// Second line: level, then article mode or which conversation this is
const subtitle = computed(() => {
  const parts = [t(`levels.${props.level.id}.name`)]
  if (props.isArticleMode) parts.push(t('chat.articleMode'))
  else if (props.conversationCount > 1) parts.push(t('chat.conversationNumber', { n: props.conversationCount }))
  return parts.join(' · ')
})

// Everything except back and the friend lives in one overflow menu
const menuOpen = ref(false)
const menuRef = ref(null)
const triggerRef = ref(null)

function onKeydown(e) {
  if (e.key === 'Escape') closeMenu()
}

async function openMenu() {
  menuOpen.value = true
  document.addEventListener('keydown', onKeydown)
  await nextTick()
  menuRef.value?.querySelector('button')?.focus()
}

function closeMenu(returnFocus = true) {
  if (!menuOpen.value) return
  menuOpen.value = false
  document.removeEventListener('keydown', onKeydown)
  if (returnFocus) triggerRef.value?.focus()
}

function toggleMenu() {
  menuOpen.value ? closeMenu() : openMenu()
}

function pick(action) {
  closeMenu(false)
  action()
}

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

const rowClass = 'flex min-h-11 w-full items-center gap-3 px-4 text-left active:bg-surface-raised'
</script>

<template>
  <header class="safe-area-top relative z-20 shrink-0 border-b border-hairline bg-surface">
    <div class="flex min-h-14 items-center gap-1 px-1 sm:px-3">
      <button
        type="button"
        @click="emit('back')"
        :aria-label="t('chat.back')"
        class="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink active:bg-surface-raised"
      >
        <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
      </button>
      <CmAvatar :name="character.name" :size="40" />
      <div class="min-w-0 flex-1 px-2">
        <h1 class="truncate text-title font-medium text-ink">{{ character.name }}</h1>
        <p class="truncate text-meta text-ink-muted tabular-nums">{{ subtitle }}</p>
      </div>
      <button
        ref="triggerRef"
        type="button"
        @click="toggleMenu"
        class="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-secondary active:bg-surface-raised"
        :class="menuOpen ? 'bg-surface-raised' : ''"
        :aria-label="t('chat.menu')"
        aria-haspopup="menu"
        :aria-expanded="menuOpen"
      >
        <span class="material-symbols-outlined" aria-hidden="true">more_vert</span>
      </button>
    </div>

    <template v-if="menuOpen">
      <div class="fixed inset-0 z-40" @click="closeMenu()" aria-hidden="true"></div>
      <div
        ref="menuRef"
        role="menu"
        :aria-label="t('chat.menu')"
        class="chat-menu absolute right-2 top-full z-50 mt-1 w-56 max-w-[calc(100vw-1rem)] rounded-[10px] border border-hairline bg-surface py-2 text-body text-ink shadow-[var(--cm-shadow-float)]"
      >
        <button role="menuitem" type="button" @click="pick(() => emit('toggle-vocab-bank'))" :class="rowClass">
          <span class="material-symbols-outlined text-ink-muted" aria-hidden="true">bookmarks</span>{{ t('chat.vocabBank') }}
        </button>
        <button v-if="memoryCount > 0" role="menuitem" type="button" @click="pick(() => emit('show-memories'))" :class="rowClass">
          <span class="material-symbols-outlined text-ink-muted" aria-hidden="true">psychology</span>
          <span class="min-w-0 flex-1 truncate">{{ t('chat.memories', { name: character.name }) }}</span>
          <span class="text-meta text-ink-muted tabular-nums">{{ memoryCount }}</span>
        </button>
        <button v-if="isArticleMode" role="menuitem" type="button" @click="pick(() => emit('toggle-article'))" :class="rowClass">
          <span class="material-symbols-outlined text-ink-muted" aria-hidden="true">article</span>{{ showArticle ? t('chat.hideArticle') : t('chat.showArticle') }}
        </button>
        <button role="menuitem" type="button" @click="pick(() => emit('show-achievements'))" :class="rowClass">
          <span class="material-symbols-outlined text-ink-muted" aria-hidden="true">military_tech</span>{{ t('chat.achievements') }}
        </button>
        <button role="menuitem" type="button" @click="pick(toggleDark)" :class="rowClass">
          <span class="material-symbols-outlined text-ink-muted" aria-hidden="true">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>{{ isDark ? t('chat.lightMode') : t('chat.darkMode') }}
        </button>
        <div class="my-2 border-t border-hairline" role="separator"></div>
        <button role="menuitem" type="button" :disabled="isLoading" @click="pick(() => emit('renew-chat'))" :class="[rowClass, 'disabled:opacity-55']">
          <span class="material-symbols-outlined text-ink-muted" aria-hidden="true">refresh</span>{{ t('chat.newChat') }}
        </button>
      </div>
    </template>
  </header>
</template>

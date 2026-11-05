<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { playTTS, stopTTS } from '../../utils/tts'
import { shuffleArray } from '../../utils/shuffle'
import { diffWords } from '../../utils/wordDiff'

const { t } = useI18n()

const props = defineProps({
  // { id, mode: 'choose' | 'dictation', en, zh, options? }
  item: { type: Object, required: true },
})
const emit = defineEmits(['done'])

const picked = ref(null)
const typed = ref('')
const checked = ref(false)
const options = ref([])

function play(speed = 'normal') {
  playTTS(props.item.en, 'en', speed)
}

watch(() => props.item.id, () => {
  picked.value = null
  typed.value = ''
  checked.value = false
  options.value = props.item.mode === 'choose' ? shuffleArray([...props.item.options]) : []
  play()
}, { immediate: true })

const diff = computed(() => diffWords(typed.value, props.item.en))
const answered = computed(() => props.item.mode === 'choose' ? picked.value !== null : checked.value)
const correct = computed(() => props.item.mode === 'choose' ? picked.value === props.item.en : diff.value.matches)

function finish() {
  emit('done', { correct: correct.value, confidence: correct.value ? 4 : 2 })
}

onBeforeUnmount(stopTTS)
</script>

<template>
  <div class="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
    <div>
      <p class="text-xs font-semibold text-primary">{{ t('listening.label') }}</p>
      <p class="mt-1 text-base font-semibold text-text-main dark:text-white">
        {{ item.mode === 'choose' ? t('listening.chooseTitle') : t('listening.dictationTitle') }}
      </p>
    </div>

    <div class="flex gap-2">
      <button @click="play('normal')" class="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-white font-semibold">
        <span class="material-symbols-outlined">volume_up</span>{{ t('listening.play') }}
      </button>
      <button @click="play('slow')" class="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200 font-semibold">
        <span class="material-symbols-outlined">slow_motion_video</span>{{ t('listening.slow') }}
      </button>
    </div>

    <!-- Which sentence did you hear? -->
    <div v-if="item.mode === 'choose'" class="space-y-2">
      <button
        v-for="option in options"
        :key="option"
        @click="picked === null && (picked = option)"
        class="w-full text-left px-4 py-3 rounded-xl border text-sm leading-relaxed transition-colors"
        :class="picked === null
          ? 'border-slate-200 dark:border-slate-700 text-text-main dark:text-slate-200'
          : option === item.en
            ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-text-main dark:text-white'
            : option === picked
              ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-text-main dark:text-white'
              : 'border-slate-200 dark:border-slate-700 text-text-muted dark:text-slate-500'"
      >{{ option }}</button>
    </div>

    <!-- Dictation -->
    <div v-else class="space-y-2">
      <textarea
        v-model="typed"
        :disabled="checked"
        rows="2"
        autocapitalize="sentences"
        :placeholder="t('listening.typeWhatYouHear')"
        class="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark text-text-main dark:text-white px-3 py-2.5 text-base focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-70"
      ></textarea>
      <button
        v-if="!checked"
        @click="checked = true"
        :disabled="!typed.trim()"
        class="w-full py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50"
      >{{ t('listening.check') }}</button>
    </div>

    <div v-if="answered" class="rounded-xl p-4 space-y-1.5" :class="correct ? 'bg-green-50 dark:bg-green-900/20' : 'bg-primary/5 dark:bg-primary/10'">
      <p class="text-sm font-semibold" :class="correct ? 'text-green-700 dark:text-green-300' : 'text-text-main dark:text-slate-200'">
        {{ correct ? t('listening.correct') : t('listening.answerWas') }}
      </p>
      <p class="text-base leading-relaxed text-text-main dark:text-white">
        <template v-if="item.mode === 'dictation'"><template v-for="(part, i) in diff.parts" :key="i"><span :class="part.same ? '' : 'font-semibold text-amber-600 dark:text-amber-400 underline decoration-2 underline-offset-2'">{{ part.text }}</span>{{ ' ' }}</template></template>
        <template v-else>{{ item.en }}</template>
      </p>
      <p v-if="item.zh" class="text-sm text-text-muted dark:text-slate-400">{{ item.zh }}</p>
      <p v-if="item.mode === 'dictation' && !correct" class="text-xs text-text-muted dark:text-slate-400">{{ t('listening.missedWords') }}</p>
    </div>

    <button v-if="answered" @click="finish" class="w-full py-3 rounded-xl bg-primary text-white font-semibold">{{ t('dailyPractice.next') }}</button>
  </div>
</template>

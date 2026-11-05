<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  level: { type: String, default: 'intermediate' },
  language: { type: String, default: 'en' },
})

const emit = defineEmits(['use-prompt', 'dismiss'])

// Observation-focused daily prompts by level
const PROMPTS = {
  beginner: [
    { en: 'What can you see from your window right now?', ja: '今、窓から何が見える？', zh: '你現在從窗戶看到什麼？' },
    { en: 'Describe what you are eating or drinking.', ja: '今食べているものを説明して。', zh: '描述你正在吃或喝的東西。' },
    { en: 'What is the weather like right now?', ja: '今の天気はどう？', zh: '現在天氣怎麼樣？' },
    { en: 'Describe the room you are in.', ja: '今いる部屋を説明して。', zh: '描述你現在待的房間。' },
    { en: 'What color clothes are you wearing today?', ja: '今日何色の服を着てる？', zh: '你今天穿什麼顏色的衣服？' },
    { en: 'What sounds can you hear right now?', ja: '今どんな音が聞こえる？', zh: '你現在聽到什麼聲音？' },
    { en: 'Describe something on your desk.', ja: '机の上にあるものを一つ説明して。', zh: '描述你桌上的一樣東西。' },
  ],
  intermediate: [
    { en: 'Describe the most interesting thing you saw today.', ja: '今日見た一番面白いものを話して。', zh: '描述你今天看到最有趣的東西。' },
    { en: 'What does the street outside look like right now?', ja: '今、外の通りはどんな感じ？', zh: '現在外面的街道看起來怎麼樣？' },
    { en: 'Describe someone you saw today without saying their name.', ja: '今日見かけた人を名前を言わずに描写して。', zh: '描述你今天看到的一個人，不要說名字。' },
    { en: 'What smells are around you right now?', ja: '今、周りにどんな匂いがする？', zh: '你現在聞到什麼味道？' },
    { en: "Tell me about something that caught your eye today.", ja: '今日、目に留まったものを教えて。', zh: '跟我說說今天吸引你目光的東西。' },
    { en: 'Describe the view from where you are sitting.', ja: '今座っている場所からの景色を描写して。', zh: '描述你坐的地方看到的景色。' },
    { en: 'What is happening around you right now?', ja: '今、周りで何が起きてる？', zh: '你現在周圍正在發生什麼事？' },
  ],
  advanced: [
    { en: 'Describe the atmosphere of where you are right now.', ja: '今いる場所の雰囲気を描写して。', zh: '描述你現在所在的地方的氛圍。' },
    { en: 'What details do people usually overlook in your daily commute?', ja: '通勤中、みんなが見落としがちなものは？', zh: '你每天通勤時，大家通常忽略什麼細節？' },
    { en: 'Describe a stranger you noticed today and imagine their story.', ja: '今日見かけた人を描写して、その人の物語を想像して。', zh: '描述你今天注意到的陌生人，想像他們的故事。' },
    { en: "What would a photographer find interesting about where you are?", ja: '写真家が今いる場所で面白いと思うものは？', zh: '攝影師會覺得你現在的地方哪裡有趣？' },
    { en: 'Compare how this place feels now vs. at a different time of day.', ja: 'この場所の今と、違う時間帯の雰囲気を比べて。', zh: '比較這個地方現在和不同時段的感覺。' },
    { en: 'Describe something ordinary you saw today in an extraordinary way.', ja: '今日見た普通のものを特別な表現で描写して。', zh: '用不平凡的方式描述你今天看到的平凡事物。' },
    { en: 'What subtle changes have you noticed in your surroundings recently?', ja: '最近、身の回りで気づいた小さな変化は？', zh: '你最近注意到周圍有什麼細微的變化？' },
  ],
}

const todayPrompt = computed(() => {
  const levelId = props.level || 'intermediate'
  const prompts = PROMPTS[levelId] || PROMPTS.intermediate
  const date = new Date()
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000)
  const prompt = prompts[dayOfYear % prompts.length]
  return prompt[props.language] || prompt.en
})
</script>

<template>
  <div class="daily-prompt mx-auto w-full max-w-md">
    <!-- Shown once inside the message stream, before the first user turn -->
    <div class="relative rounded-[14px] border border-hairline bg-surface py-3 pl-4 pr-1 shadow-[var(--cm-shadow-small)]">
      <span class="absolute left-0 top-3.5 h-9 w-[3px] rounded-r-[3px] bg-accent" aria-hidden="true"></span>
      <div class="flex items-start gap-2">
        <div class="min-w-0 flex-1 pt-0.5">
          <p class="text-meta font-medium text-ink-secondary">{{ t('dailyPrompt.label') }}</p>
          <p class="mt-1 text-body text-ink">{{ todayPrompt }}</p>
        </div>
        <button
          type="button"
          @click="emit('dismiss')"
          class="-mt-1 flex size-11 shrink-0 items-center justify-center rounded-[10px] text-ink-muted active:bg-surface-raised"
          :aria-label="t('common.dismissPrompt')"
        >
          <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">close</span>
        </button>
      </div>

      <div class="mt-1 flex flex-wrap items-center gap-x-4">
        <button
          type="button"
          @click="emit('use-prompt', todayPrompt)"
          class="-ml-1 inline-flex min-h-11 items-center gap-1 rounded-[10px] px-1 text-caption font-medium text-accent"
        >
          <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">edit</span>
          {{ t('dailyPrompt.tryIt') }}
        </button>
        <button
          type="button"
          @click="router.push({ path: '/diary', query: { prompt: todayPrompt } })"
          class="inline-flex min-h-11 items-center gap-1 rounded-[10px] px-1 text-caption font-medium text-accent"
        >
          <span class="material-symbols-outlined !text-[18px]" aria-hidden="true">menu_book</span>
          {{ t('diary.writeInDiary') }}
        </button>
      </div>
    </div>
  </div>
</template>

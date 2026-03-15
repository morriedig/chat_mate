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
  <div class="mx-auto max-w-md w-full">
    <div class="relative bg-gradient-to-r from-primary/10 to-sky-400/10 dark:from-primary/20 dark:to-sky-400/20 border border-primary/20 dark:border-primary/30 rounded-2xl p-4">
      <!-- Dismiss -->
      <button
        @click="emit('dismiss')"
        class="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        aria-label="Dismiss prompt"
      >
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>

      <!-- Icon + Label -->
      <div class="flex items-center gap-2 mb-2">
        <span class="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
        <span class="text-xs font-semibold text-primary uppercase tracking-wider">{{ t('dailyPrompt.label') }}</span>
      </div>

      <!-- Prompt Text -->
      <p class="text-sm text-text-main dark:text-white font-medium mb-3 pr-6">{{ todayPrompt }}</p>

      <!-- Action Buttons -->
      <div class="flex items-center gap-4">
        <button
          @click="emit('use-prompt', todayPrompt)"
          class="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-[16px]">edit</span>
          {{ t('dailyPrompt.tryIt') }}
        </button>
        <button
          @click="router.push({ path: '/diary', query: { prompt: todayPrompt } })"
          class="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-[16px]">menu_book</span>
          {{ t('diary.writeInDiary') }}
        </button>
      </div>
    </div>
  </div>
</template>

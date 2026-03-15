import { ref, computed } from 'vue'

const STORAGE_KEY = 'chatmate_weeklyQuests'

const QUEST_POOL = [
  { id: 'chat_5', target: 5, reward: 50, key: 'weeklyQuests.quests.chat5' },
  { id: 'chat_10', target: 10, reward: 80, key: 'weeklyQuests.quests.chat10' },
  { id: 'vocab_10', target: 10, reward: 40, key: 'weeklyQuests.quests.vocab10' },
  { id: 'vocab_20', target: 20, reward: 60, key: 'weeklyQuests.quests.vocab20' },
  { id: 'quiz_3', target: 3, reward: 30, key: 'weeklyQuests.quests.quiz3' },
  { id: 'quiz_perfect', target: 1, reward: 50, key: 'weeklyQuests.quests.quizPerfect' },
  { id: 'streak_5', target: 5, reward: 60, key: 'weeklyQuests.quests.streak5' },
  { id: 'streak_7', target: 7, reward: 100, key: 'weeklyQuests.quests.streak7' },
  { id: 'minutes_30', target: 30, reward: 40, key: 'weeklyQuests.quests.minutes30' },
  { id: 'challenge_3', target: 3, reward: 50, key: 'weeklyQuests.quests.challenge3' },
  { id: 'diary_entries_3', target: 3, reward: 30, key: 'weeklyQuests.quests.diaryEntries3' },
  { id: 'diary_entries_5', target: 5, reward: 50, key: 'weeklyQuests.quests.diaryEntries5' },
  { id: 'diary_vocab_use_5', target: 5, reward: 25, key: 'weeklyQuests.quests.diaryVocabUse5' },
  { id: 'diary_vocab_use_10', target: 10, reward: 40, key: 'weeklyQuests.quests.diaryVocabUse10' },
  { id: 'diary_word_count_150', target: 150, reward: 25, key: 'weeklyQuests.quests.diaryWordCount150' },
  { id: 'diary_word_count_300', target: 300, reward: 40, key: 'weeklyQuests.quests.diaryWordCount300' },
]

function getWeekId() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${week}`
}

function loadQuestData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveQuestData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage unavailable
  }
}

function selectQuests(count = 3) {
  // Deterministic selection based on week
  const weekId = getWeekId()
  let seed = 0
  for (let i = 0; i < weekId.length; i++) seed += weekId.charCodeAt(i)

  const shuffled = [...QUEST_POOL]
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 31 + 17) & 0x7fffffff
    const j = seed % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

// Singleton state
const questData = ref(null)

function initQuests() {
  const saved = loadQuestData()
  const currentWeek = getWeekId()

  if (saved && saved.weekId === currentWeek) {
    questData.value = saved
  } else {
    const selectedQuests = selectQuests(3)
    questData.value = {
      weekId: currentWeek,
      quests: selectedQuests.map(q => ({
        ...q,
        progress: 0,
        completed: false,
        claimed: false,
      })),
    }
    saveQuestData(questData.value)
  }
}

initQuests()

export function useWeeklyQuests() {
  const quests = computed(() => questData.value?.quests || [])
  const allCompleted = computed(() => quests.value.every(q => q.completed))

  function updateQuestProgress(questId, amount = 1) {
    if (!questData.value) return false
    const quest = questData.value.quests.find(q => q.id === questId)
    if (!quest || quest.completed) return false

    quest.progress = Math.min(quest.progress + amount, quest.target)
    if (quest.progress >= quest.target) {
      quest.completed = true
    }
    saveQuestData(questData.value)
    return quest.completed
  }

  function claimReward(questId) {
    if (!questData.value) return 0
    const quest = questData.value.quests.find(q => q.id === questId)
    if (!quest || !quest.completed || quest.claimed) return 0

    quest.claimed = true
    saveQuestData(questData.value)
    return quest.reward
  }

  // Track various activities
  function onChatMessage() {
    updateQuestProgress('chat_5')
    updateQuestProgress('chat_10')
  }

  function onWordLearned() {
    updateQuestProgress('vocab_10')
    updateQuestProgress('vocab_20')
  }

  function onQuizCompleted(isPerfect) {
    updateQuestProgress('quiz_3')
    if (isPerfect) updateQuestProgress('quiz_perfect')
  }

  function onStreakUpdate(currentStreak) {
    const s5 = questData.value?.quests.find(q => q.id === 'streak_5')
    if (s5 && !s5.completed) {
      s5.progress = Math.min(currentStreak, s5.target)
      if (s5.progress >= s5.target) s5.completed = true
    }
    const s7 = questData.value?.quests.find(q => q.id === 'streak_7')
    if (s7 && !s7.completed) {
      s7.progress = Math.min(currentStreak, s7.target)
      if (s7.progress >= s7.target) s7.completed = true
    }
    saveQuestData(questData.value)
  }

  function onMinutesSpent(minutes) {
    updateQuestProgress('minutes_30', minutes)
  }

  function onChallengeCompleted() {
    updateQuestProgress('challenge_3')
  }

  function onDiaryEntry() {
    updateQuestProgress('diary_entries_3')
    updateQuestProgress('diary_entries_5')
  }

  function onDiaryVocabUsed(count) {
    updateQuestProgress('diary_vocab_use_5', count)
    updateQuestProgress('diary_vocab_use_10', count)
  }

  function onDiaryWordCount(count) {
    updateQuestProgress('diary_word_count_150', count)
    updateQuestProgress('diary_word_count_300', count)
  }

  return {
    quests,
    allCompleted,
    updateQuestProgress,
    claimReward,
    onChatMessage,
    onWordLearned,
    onQuizCompleted,
    onStreakUpdate,
    onMinutesSpent,
    onChallengeCompleted,
    onDiaryEntry,
    onDiaryVocabUsed,
    onDiaryWordCount,
  }
}

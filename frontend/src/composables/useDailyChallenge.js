import { ref, computed } from 'vue'

const STORAGE_KEY = 'chatmate_dailyChallenge'

const TOPICS = {
  beginner: [
    { en: 'Describe your favorite food', ja: '好きな食べ物を説明して', zh: '描述你最喜歡的食物' },
    { en: 'Talk about your morning routine', ja: '朝のルーティンについて話そう', zh: '說說你的早晨日常' },
    { en: 'What did you do yesterday?', ja: '昨日何をした？', zh: '你昨天做了什麼？' },
    { en: 'Describe your family', ja: '家族について話そう', zh: '介紹你的家人' },
    { en: 'Talk about the weather today', ja: '今日の天気について話そう', zh: '聊聊今天的天氣' },
    { en: 'What do you like to do on weekends?', ja: '週末に何をするのが好き？', zh: '你週末喜歡做什麼？' },
    { en: 'Describe your home', ja: '自分の家について話そう', zh: '描述你的家' },
  ],
  intermediate: [
    { en: 'Discuss a movie you watched recently', ja: '最近見た映画について話そう', zh: '聊聊你最近看的電影' },
    { en: 'Share your travel plans', ja: '旅行の計画を共有しよう', zh: '分享你的旅行計畫' },
    { en: 'Talk about a hobby you want to start', ja: '始めたい趣味について話そう', zh: '聊聊你想開始的嗜好' },
    { en: 'Describe your ideal weekend', ja: '理想の週末を話そう', zh: '描述你理想的週末' },
    { en: 'Share a funny story', ja: '面白い話を共有しよう', zh: '分享一個有趣的故事' },
    { en: 'Talk about your dream job', ja: '夢の仕事について話そう', zh: '聊聊你的夢想工作' },
    { en: 'Discuss a book or show you recommend', ja: 'おすすめの本やドラマについて話そう', zh: '推薦一本書或一部劇' },
  ],
  advanced: [
    { en: 'Debate: Is social media good for society?', ja: 'SNSは社会にとって良いか？', zh: '辯論：社群媒體對社會是好是壞？' },
    { en: 'Discuss the pros and cons of remote work', ja: 'リモートワークのメリットとデメリット', zh: '討論遠端工作的優缺點' },
    { en: 'Share your thoughts on AI and the future', ja: 'AIと未来について考えを共有しよう', zh: '分享你對AI和未來的看法' },
    { en: 'Talk about a cultural difference you find interesting', ja: '面白いと思う文化の違いについて話そう', zh: '聊聊你覺得有趣的文化差異' },
    { en: 'Discuss your views on work-life balance', ja: 'ワークライフバランスについて', zh: '討論你對工作與生活平衡的看法' },
    { en: 'Share an unpopular opinion you have', ja: '世間と違う自分の意見を話そう', zh: '分享一個你不同於大眾的觀點' },
    { en: 'Talk about a problem you wish someone would solve', ja: '誰かに解決してほしい問題について', zh: '聊聊你希望有人能解決的問題' },
  ],
}

function loadChallengeData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveChallengeData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage unavailable
  }
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getDailyTopicIndex(level) {
  const topics = TOPICS[level] || TOPICS.intermediate
  // Use date as seed for deterministic daily rotation
  const date = new Date()
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000)
  return dayOfYear % topics.length
}

// Singleton state
const challengeData = ref(loadChallengeData() || {})

export function useDailyChallenge() {
  function getTodayTopic(level, language) {
    const topics = TOPICS[level] || TOPICS.intermediate
    const index = getDailyTopicIndex(level)
    const topic = topics[index]
    return topic[language] || topic.en
  }

  const isChallengeCompleted = computed(() => {
    return challengeData.value.completedDate === getToday()
  })

  const challengeMessageCount = computed(() => {
    if (challengeData.value.date !== getToday()) return 0
    return challengeData.value.messageCount || 0
  })

  function startChallenge(level, language) {
    challengeData.value = {
      date: getToday(),
      topic: getTodayTopic(level, language),
      level,
      language,
      messageCount: 0,
      completedDate: null,
    }
    saveChallengeData(challengeData.value)
  }

  function trackChallengeMessage() {
    if (challengeData.value.date !== getToday()) return false
    if (challengeData.value.completedDate) return false

    challengeData.value.messageCount = (challengeData.value.messageCount || 0) + 1
    const completed = challengeData.value.messageCount >= 5

    if (completed) {
      challengeData.value.completedDate = getToday()
    }

    saveChallengeData(challengeData.value)
    return completed // Returns true when challenge just completed
  }

  function getChallengeContext() {
    if (challengeData.value.date !== getToday() || !challengeData.value.topic) return null
    return challengeData.value.topic
  }

  return {
    getTodayTopic,
    isChallengeCompleted,
    challengeMessageCount,
    startChallenge,
    trackChallengeMessage,
    getChallengeContext,
    challengeData,
  }
}

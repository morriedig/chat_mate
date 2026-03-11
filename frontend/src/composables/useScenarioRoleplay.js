import { ref, computed } from 'vue'

const STORAGE_KEY = 'chatmate_scenarios'

const SCENARIOS = {
  beginner: [
    {
      id: 'cafe_order',
      en: { title: 'Order at a Cafe', goal: 'Successfully order a drink and snack' },
      ja: { title: 'カフェで注文', goal: '飲み物とおやつを注文する' },
      zh: { title: '在咖啡廳點餐', goal: '成功點一杯飲料和點心' },
    },
    {
      id: 'introduce_self',
      en: { title: 'Introduce Yourself', goal: 'Share your name, where you\'re from, and a hobby' },
      ja: { title: '自己紹介', goal: '名前、出身地、趣味を伝える' },
      zh: { title: '自我介紹', goal: '分享你的名字、來自哪裡和一個興趣' },
    },
    {
      id: 'ask_directions',
      en: { title: 'Ask for Directions', goal: 'Find your way to the train station' },
      ja: { title: '道を聞く', goal: '駅までの道を聞く' },
      zh: { title: '問路', goal: '找到去車站的路' },
    },
  ],
  intermediate: [
    {
      id: 'hotel_checkin',
      en: { title: 'Hotel Check-in Problem', goal: 'Resolve a booking issue at the hotel' },
      ja: { title: 'ホテルチェックインのトラブル', goal: '予約の問題を解決する' },
      zh: { title: '飯店入住問題', goal: '解決訂房問題' },
    },
    {
      id: 'job_interview',
      en: { title: 'Job Interview', goal: 'Impress the interviewer with your experience' },
      ja: { title: '面接', goal: '面接官に経験をアピールする' },
      zh: { title: '工作面試', goal: '用你的經驗讓面試官印象深刻' },
    },
    {
      id: 'restaurant_complaint',
      en: { title: 'Restaurant Complaint', goal: 'Politely handle a wrong order' },
      ja: { title: 'レストランでのクレーム', goal: '注文間違いを丁寧に伝える' },
      zh: { title: '餐廳投訴', goal: '禮貌地處理送錯的餐點' },
    },
  ],
  advanced: [
    {
      id: 'business_negotiation',
      en: { title: 'Business Negotiation', goal: 'Negotiate a fair deal for both sides' },
      ja: { title: 'ビジネス交渉', goal: '双方にとって公平な取引を交渉する' },
      zh: { title: '商業談判', goal: '為雙方談出公平的交易' },
    },
    {
      id: 'debate_ai',
      en: { title: 'Debate: AI in Education', goal: 'Make a compelling argument with evidence' },
      ja: { title: 'ディベート: 教育とAI', goal: '根拠のある説得力ある議論をする' },
      zh: { title: '辯論：AI與教育', goal: '提出有根據的有力論點' },
    },
    {
      id: 'medical_visit',
      en: { title: 'Doctor Visit', goal: 'Describe symptoms and understand the diagnosis' },
      ja: { title: '病院受診', goal: '症状を説明し、診断を理解する' },
      zh: { title: '看醫生', goal: '描述症狀並理解診斷結果' },
    },
  ],
}

function loadScenarioData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { completed: [] }
  } catch {
    return { completed: [] }
  }
}

function saveScenarioData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage unavailable
  }
}

const scenarioData = ref(loadScenarioData())

export function useScenarioRoleplay() {
  function getScenarios(level, language) {
    const scenarios = SCENARIOS[level] || SCENARIOS.intermediate
    return scenarios.map(s => ({
      id: s.id,
      title: (s[language] || s.en).title,
      goal: (s[language] || s.en).goal,
      completed: scenarioData.value.completed.includes(s.id),
    }))
  }

  function buildScenarioPrompt(scenarioId, level, language) {
    const scenarios = SCENARIOS[level] || SCENARIOS.intermediate
    const scenario = scenarios.find(s => s.id === scenarioId)
    if (!scenario) return null

    const localized = scenario[language] || scenario.en
    return `[System: You are now in a role-play scenario. Title: "${localized.title}". The user's goal: "${localized.goal}". Stay in character and play out the scenario. Guide the conversation naturally toward the goal. When the user achieves the goal, acknowledge it naturally.]`
  }

  function completeScenario(scenarioId) {
    if (!scenarioData.value.completed.includes(scenarioId)) {
      scenarioData.value.completed.push(scenarioId)
      saveScenarioData(scenarioData.value)
    }
  }

  const completedCount = computed(() => scenarioData.value.completed.length)

  return {
    getScenarios,
    buildScenarioPrompt,
    completeScenario,
    completedCount,
  }
}

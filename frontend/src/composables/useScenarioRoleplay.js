import { ref, computed } from 'vue'

const STORAGE_KEY = 'chatmate_scenarios'

// Richer scenario library. Each scenario has:
// - multilingual title and goal
// - contextSetup (the situation text injected into AI prompt)
// - steps (hidden objectives the AI tracks)
// - vocabulary (hints surfaced to the user during the chat)
// Expanded across all 3 levels. Harder scenarios bias toward workplace,
// conflict, and nuanced social situations that generic LLM wrappers can't
// easily replicate without this curated content.
const SCENARIOS = {
  beginner: [
    {
      id: 'cafe_order',
      en: { title: 'Order at a Cafe', goal: 'Order a drink and a snack' },
      ja: { title: 'カフェで注文', goal: '飲み物とおやつを注文する' },
      zh: { title: '在咖啡廳點餐', goal: '成功點一杯飲料和點心' },
      context: 'The user just walked up to the counter of a busy cafe. You are the barista. A short line is forming behind them. Greet them and take their order.',
      steps: ['greets user', 'takes drink order', 'takes snack order', 'totals price'],
      vocab: ['latte', 'croissant', 'for here / to go', 'cash / card'],
    },
    {
      id: 'introduce_self',
      en: { title: 'Introduce Yourself', goal: 'Share your name, where you are from, and a hobby' },
      ja: { title: '自己紹介', goal: '名前、出身地、趣味を伝える' },
      zh: { title: '自我介紹', goal: '分享你的名字、來自哪裡和一個興趣' },
      context: 'You and the user just met at a community language meetup. Neither of you has spoken yet. Start by introducing yourself briefly, then ask about them — keep it genuinely friendly.',
      steps: ['gives own introduction', 'asks user name', 'asks where from', 'asks hobby'],
      vocab: ['nice to meet you', 'I am from', 'I like to', 'actually'],
    },
    {
      id: 'ask_directions',
      en: { title: 'Ask for Directions', goal: 'Get directions to the train station' },
      ja: { title: '道を聞く', goal: '駅までの道を聞く' },
      zh: { title: '問路', goal: '找到去車站的路' },
      context: 'You are a local stopped by the user on the street. They are clearly a traveler with a suitcase. Help them get to the nearest train station — be specific with turns and landmarks.',
      steps: ['confirms destination', 'describes turn(s)', 'names a landmark', 'estimates walking time'],
      vocab: ['turn left', 'go straight', 'on your right', 'about 10 minutes'],
    },
    {
      id: 'buy_groceries',
      en: { title: 'Grocery Shopping', goal: 'Buy 3 items and ask about freshness' },
      ja: { title: '買い物', goal: '3つの商品を買い、新鮮さを聞く' },
      zh: { title: '買菜', goal: '買三樣東西並詢問新鮮度' },
      context: 'You work at the neighborhood market. The user is choosing produce. Help them pick what is freshest today and let them know about any specials.',
      steps: ['greets user', 'confirms items', 'answers freshness question', 'totals or bags items'],
      vocab: ['fresh', 'on sale', 'per pound', 'bag or cart'],
    },
    {
      id: 'small_talk_weather',
      en: { title: 'Elevator Small Talk', goal: 'Have a 2-minute friendly exchange' },
      ja: { title: 'エレベーターでの雑談', goal: '2分間の友好的な会話をする' },
      zh: { title: '電梯閒聊', goal: '進行2分鐘的友好對話' },
      context: 'You are in the elevator with the user — a neighbor you vaguely recognize but do not know well. Light, friendly small talk until one of you reaches the floor. Keep it natural.',
      steps: ['initiates greeting', 'comments on weather or weekend', 'asks a brief follow-up', 'friendly closer'],
      vocab: ['by the way', 'kind of', 'have a good one', 'see you around'],
    },
  ],
  intermediate: [
    {
      id: 'hotel_checkin',
      en: { title: 'Hotel Check-in Problem', goal: 'Resolve a missing reservation' },
      ja: { title: 'ホテルチェックインのトラブル', goal: '予約の問題を解決する' },
      zh: { title: '飯店入住問題', goal: '解決訂房問題' },
      context: 'You are the front-desk clerk. The user arrives at 7pm with a printed booking, but the system shows nothing under their name. Be professional, apologetic, and work toward a solution (find the booking, offer an alternative, escalate to manager).',
      steps: ['confirms identity', 'explains the system issue', 'proposes a solution', 'confirms outcome'],
      vocab: ['I apologize', 'let me check', 'is it possible', 'complimentary upgrade'],
    },
    {
      id: 'job_interview',
      en: { title: 'Job Interview', goal: 'Convince the interviewer you are the right fit' },
      ja: { title: '面接', goal: '面接官に自分が適任だと納得させる' },
      zh: { title: '工作面試', goal: '讓面試官相信你是合適人選' },
      context: 'You are the hiring manager for a marketing coordinator role. Start with a warm opener, then ask about their experience, a difficult project, and why they want this role. Probe naturally, not like a robot.',
      steps: ['warm opener', 'asks about experience', 'probes a specific example', 'gives user chance to ask a question'],
      vocab: ['could you tell me about', 'what excites you', 'walk me through', 'follow up on that'],
    },
    {
      id: 'restaurant_complaint',
      en: { title: 'Restaurant Wrong Order', goal: 'Politely handle an incorrect dish' },
      ja: { title: 'レストランで注文違い', goal: '注文間違いを丁寧に伝える' },
      zh: { title: '餐廳送錯餐', goal: '禮貌地處理送錯的餐點' },
      context: 'You are the server. The user flagged you over — their food is not what they ordered. Apologize genuinely, fix it quickly, and consider offering something small to make up for it.',
      steps: ['listens and apologizes', 'confirms the correct order', 'promises a timeline', 'offers a gesture'],
      vocab: ['I am so sorry', 'that is on us', 'right away', 'on the house'],
    },
    {
      id: 'doctor_appointment',
      en: { title: 'Doctor Appointment', goal: 'Describe symptoms and understand next steps' },
      ja: { title: '病院の予約', goal: '症状を説明し、次のステップを理解する' },
      zh: { title: '看醫生', goal: '描述症狀並理解後續步驟' },
      context: 'You are a general practitioner. The user sat down looking a bit anxious. Take a friendly history, ask clarifying questions about duration, severity, and triggers. Close with clear next steps.',
      steps: ['warm greeting', 'asks about symptoms', 'asks about duration and severity', 'outlines next steps'],
      vocab: ['how long has this been', 'on a scale of', 'I would recommend', 'prescription'],
    },
    {
      id: 'apartment_viewing',
      en: { title: 'Apartment Viewing', goal: 'Ask about key details before deciding' },
      ja: { title: '部屋の内見', goal: '決める前に重要な点を確認する' },
      zh: { title: '看房', goal: '在決定前詢問關鍵細節' },
      context: 'You are a landlord showing a one-bedroom apartment. The user is mid-viewing. Answer questions honestly, highlight good things, and be upfront about any quirks (noise, old appliances, utilities).',
      steps: ['welcomes the user', 'describes layout', 'covers utilities and rent', 'answers quirks question honestly'],
      vocab: ['utilities included', 'move-in date', 'security deposit', 'is there any flexibility'],
    },
    {
      id: 'lost_item_airport',
      en: { title: 'Lost Item at the Airport', goal: 'File a report calmly under pressure' },
      ja: { title: '空港での遺失物', goal: 'プレッシャーの中で冷静に届け出る' },
      zh: { title: '機場遺失物品', goal: '在壓力下冷靜地報失' },
      context: 'You are the airport help desk. The user lost their backpack — passport inside. Their flight boards in 40 minutes. Keep them calm, get the info you need, give realistic next steps.',
      steps: ['de-escalates stress', 'collects key details', 'explains realistic timeline', 'gives fallback plan'],
      vocab: ['take a deep breath', 'was there anything else', 'in the meantime', 'worst case'],
    },
  ],
  advanced: [
    {
      id: 'business_negotiation',
      en: { title: 'Contract Negotiation', goal: 'Negotiate a deal that works for both sides' },
      ja: { title: '契約交渉', goal: '双方にとって公平な取引を交渉する' },
      zh: { title: '合約談判', goal: '為雙方談出公平的交易' },
      context: 'You are a supplier negotiating with the user, a procurement lead at a mid-size company. They want 30% off list price and 60-day payment terms. Your floor: 12% off, 30 days. Push back warmly, find creative trade-offs (volume, exclusivity, longer contract).',
      steps: ['acknowledges their ask', 'pushes back with rationale', 'proposes a trade-off', 'lands on terms'],
      vocab: ['that is a stretch for us', 'we could meet you halfway', 'in exchange for', 'long-term partnership'],
    },
    {
      id: 'debate_ai',
      en: { title: 'Debate: AI in Education', goal: 'Make a compelling, evidence-backed case' },
      ja: { title: 'ディベート: 教育とAI', goal: '根拠のある説得力ある議論をする' },
      zh: { title: '辯論：AI與教育', goal: '提出有根據的有力論點' },
      context: 'You are a thoughtful skeptic who believes AI should play a limited role in K-12 education. Push back on the user\'s arguments with specific concerns (equity, over-reliance, evaluation), but stay open to a nuanced view.',
      steps: ['states a clear position', 'raises a specific concern', 'engages a counter-argument', 'acknowledges any shared ground'],
      vocab: ['the evidence suggests', 'I would push back on', 'that said', 'a more nuanced view'],
    },
    {
      id: 'difficult_feedback',
      en: { title: 'Giving Difficult Feedback', goal: 'Give honest feedback without damaging the relationship' },
      ja: { title: '難しいフィードバック', goal: '関係を壊さずに正直なフィードバックを伝える' },
      zh: { title: '給予困難的反饋', goal: '在不傷害關係的情況下給予誠實反饋' },
      context: 'You are a colleague who reports to the user (their direct report). They called this 1:1 because you have been missing deadlines. Listen actively, take responsibility where appropriate, but advocate for what\'s making it hard. The user leads the conversation.',
      steps: ['listens without defensiveness', 'takes appropriate responsibility', 'surfaces the root cause', 'agrees on a specific next step'],
      vocab: ['I appreciate you being direct', 'you are right that', 'what has been happening', 'to fix this I will'],
    },
    {
      id: 'breakup_conversation',
      en: { title: 'Ending a Friendship Gracefully', goal: 'Have a hard conversation with kindness and clarity' },
      ja: { title: '友人関係の整理', goal: '優しさと明確さを持って難しい会話をする' },
      zh: { title: '結束一段友誼', goal: '用善意和清晰進行困難的對話' },
      context: 'You are a close friend who drifted apart from the user due to life changes and some unresolved friction. They reached out to talk. Be emotionally honest, avoid blame, and leave space for the relationship to change form rather than simply end.',
      steps: ['acknowledges the distance', 'names one specific feeling', 'listens without defending', 'proposes a new shape for the relationship'],
      vocab: ['I have been thinking about', 'what stayed with me', 'I am not sure I can', 'maybe what we need is'],
    },
    {
      id: 'startup_pitch',
      en: { title: 'Startup Investor Pitch', goal: 'Pitch with confidence and handle tough questions' },
      ja: { title: 'スタートアップの投資家向けピッチ', goal: '自信を持って売り込み、厳しい質問にも対応する' },
      zh: { title: '向投資人推銷新創', goal: '自信地推銷並應對尖銳的問題' },
      context: 'You are a skeptical seed investor. The user is pitching a B2B SaaS idea. Ask sharp questions about TAM, competitive moats, go-to-market, and unit economics. Be rigorous but not cruel — you want to find reasons to say yes.',
      steps: ['lets pitch finish', 'asks about market size', 'probes the moat', 'asks about distribution'],
      vocab: ['walk me through the numbers', 'why now', 'what is defensible here', 'if this works, what breaks'],
    },
    {
      id: 'philosophical_dinner',
      en: { title: 'Dinner Party Philosophical Debate', goal: 'Hold your ground in a lively, playful debate' },
      ja: { title: 'ディナーパーティーでの哲学的な議論', goal: '活発で遊び心のある議論で自分の立場を保つ' },
      zh: { title: '晚宴上的哲學辯論', goal: '在熱烈而輕鬆的辯論中堅持立場' },
      context: 'Dinner party, 3 drinks in. You are another guest. The topic is whether money can buy happiness. You hold a contrarian but defensible position. Be playful, throw in references, push the user\'s reasoning, but keep it fun — not lecture-y.',
      steps: ['takes a contrarian stance', 'uses a concrete example', 'responds to a counter', 'concedes one specific point'],
      vocab: ['I will die on this hill', 'okay but hear me out', 'that is a fair point', 'you lost me at'],
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
      vocab: s.vocab || [],
      completed: scenarioData.value.completed.includes(s.id),
    }))
  }

  function buildScenarioPrompt(scenarioId, level, language) {
    const scenarios = SCENARIOS[level] || SCENARIOS.intermediate
    const scenario = scenarios.find(s => s.id === scenarioId)
    if (!scenario) return null

    const localized = scenario[language] || scenario.en
    const stepsText = (scenario.steps || []).map((s, i) => `${i + 1}. ${s}`).join('; ')
    const vocabText = (scenario.vocab || []).join(', ')

    return `[System: You are now in a role-play scenario — fully inhabit the situation.

Title: "${localized.title}"
User's goal: "${localized.goal}"

Setting & your role: ${scenario.context || 'Play out the scenario naturally.'}

Objectives you should steer the conversation toward (do NOT list them — track silently): ${stepsText}.

Suggest these phrases to the user via hints where natural: ${vocabText}.

Stay in character. Guide naturally toward the goal. When the user clearly achieves the goal, acknowledge it naturally and wrap up warmly.]`
  }

  function completeScenario(scenarioId) {
    if (!scenarioData.value.completed.includes(scenarioId)) {
      scenarioData.value.completed.push(scenarioId)
      saveScenarioData(scenarioData.value)
    }
  }

  const completedCount = computed(() => scenarioData.value.completed.length)

  function getAllScenarioCount() {
    return Object.values(SCENARIOS).reduce((sum, arr) => sum + arr.length, 0)
  }

  return {
    getScenarios,
    buildScenarioPrompt,
    completeScenario,
    completedCount,
    getAllScenarioCount,
  }
}

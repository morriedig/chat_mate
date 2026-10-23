// Daily Opinion drill ("今日觀點") content.
// Questions are answered in English; translations are a gloss in the
// learner's mother tongue. Mix of everyday and work topics on purpose.

export const OPINION_QUESTIONS = [
  { id: 'wfh', en: 'Is working from home better than working in the office?', ja: '在宅勤務はオフィス勤務より良いと思う？', zh: '在家工作比進辦公室好嗎？' },
  { id: 'city-country', en: 'Would you rather live in a big city or a small town?', ja: '大都市と小さな町、どちらに住みたい？', zh: '你比較想住在大城市還是小鎮？' },
  { id: 'meetings', en: 'Should most meetings be emails instead?', ja: 'ほとんどの会議はメールで済ませるべき？', zh: '大部分的會議是不是改成寄 email 就好？' },
  { id: 'phone-dinner', en: 'Is it rude to check your phone during dinner with friends?', ja: '友達との食事中にスマホを見るのは失礼？', zh: '跟朋友吃飯時滑手機很沒禮貌嗎？' },
  { id: 'four-day-week', en: 'Should companies switch to a four-day work week?', ja: '会社は週4日勤務にするべき？', zh: '公司應該改成一週上班四天嗎？' },
  { id: 'cook-eat-out', en: 'Is it better to cook at home or eat out?', ja: '自炊と外食、どちらがいい？', zh: '自己煮跟外食，哪個比較好？' },
  { id: 'job-hopping', en: 'Is changing jobs every two years a good idea?', ja: '2年ごとに転職するのは良い考え？', zh: '每兩年換一次工作是好主意嗎？' },
  { id: 'travel-solo', en: 'Is traveling alone better than traveling with friends?', ja: '一人旅は友達との旅行より良い？', zh: '一個人旅行比跟朋友一起去好嗎？' },
  { id: 'ai-at-work', en: 'Should we use AI tools for most of our work?', ja: '仕事のほとんどにAIツールを使うべき？', zh: '我們應該把大部分工作交給 AI 工具嗎？' },
  { id: 'open-office', en: 'Are open-plan offices a good idea?', ja: 'オープンオフィスは良いアイデア？', zh: '開放式辦公室是好主意嗎？' },
  { id: 'kids-phones', en: 'Should children have their own smartphones?', ja: '子どもに自分のスマホを持たせるべき？', zh: '小孩應該擁有自己的智慧型手機嗎？' },
  { id: 'books-movies', en: 'Is reading the book better than watching the movie?', ja: '映画を観るより原作を読むほうがいい？', zh: '看原著小說比看電影版好嗎？' },
  { id: 'salary-passion', en: 'Is a high salary more important than a job you enjoy?', ja: '好きな仕事より高い給料のほうが大事？', zh: '高薪比做自己喜歡的工作更重要嗎？' },
  { id: 'early-bird', en: 'Is it better to be a morning person or a night owl?', ja: '朝型と夜型、どちらがいい？', zh: '早起型跟夜貓子，哪個比較好？' },
  { id: 'cash-free', en: 'Should we stop using cash completely?', ja: '現金を完全にやめるべき？', zh: '我們應該完全不用現金嗎？' },
  { id: 'english-meetings', en: 'Should international teams hold all meetings in English?', ja: '多国籍チームの会議はすべて英語でやるべき？', zh: '跨國團隊的會議應該全部用英文開嗎？' },
  { id: 'side-project', en: 'Is it worth having a side project outside your main job?', ja: '本業以外にサイドプロジェクトを持つ価値はある？', zh: '在正職之外經營 side project 值得嗎？' },
  { id: 'social-media', en: 'Does social media make people less happy?', ja: 'SNSは人を不幸にする？', zh: '社群媒體會讓人比較不快樂嗎？' },
  { id: 'feedback-public', en: 'Should managers give feedback in public or only in private?', ja: '上司のフィードバックは人前でするべき？それとも個別に？', zh: '主管應該當眾給回饋，還是只能私下講？' },
  { id: 'gym-outdoor', en: 'Is working out at a gym better than exercising outdoors?', ja: 'ジムで運動するのは屋外で運動するより良い？', zh: '去健身房運動比在戶外運動好嗎？' },
  { id: 'learn-online', en: 'Can you learn a language well with apps only?', ja: 'アプリだけで語学はしっかり身につく？', zh: '只用 app 能把語言學好嗎？' },
]

// Connector ids from 09-giving-reasons.yml that rotate as "today's connectors".
// Excludes the structure card and 'to-purpose' (not reliably detectable —
// see utils/connectorDetect.js).
export const ROTATING_CONNECTOR_IDS = [
  'because', 'since', 'due-to', 'because-of', 'as', 'so', 'which-is-why',
  'in-order-to', 'so-that', 'another-reason-is', 'plus', 'also',
  'on-top-of-that', 'whats-your-take',
]

export const GIVING_REASONS_CHAPTER_ID = 'giving-reasons'

// 3-step scaffold hints, shown in the learner's mother tongue
export const SCAFFOLD_STEPS = [
  {
    key: 'opinion',
    icon: 'record_voice_over',
    label: { en: 'Opinion', ja: '意見', zh: '看法' },
    hint: {
      en: 'Say where you stand in one sentence.',
      ja: 'まず自分の立場を一文で言おう。',
      zh: '先用一句話說出你的立場。',
    },
    starter: 'I think…',
  },
  {
    key: 'reason',
    icon: 'lightbulb',
    label: { en: 'Reason', ja: '理由', zh: '理由' },
    hint: {
      en: "Explain why — try today's connectors here.",
      ja: 'なぜそう思うかを説明。今日のつなぎ言葉をここで使ってみよう。',
      zh: '說明為什麼，試著在這裡用上今天的連接詞。',
    },
    starter: 'because… / On top of that, …',
  },
  {
    key: 'wrapUp',
    icon: 'forum',
    label: { en: 'Wrap-up', ja: 'まとめ', zh: '收尾' },
    hint: {
      en: 'Close your point or ask the other person back.',
      ja: 'まとめるか、相手に聞き返そう。',
      zh: '收個尾，或反問對方的想法。',
    },
    starter: "What's your take?",
  },
]

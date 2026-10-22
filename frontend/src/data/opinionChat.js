// Opinion chat ("跟朋友聊聊你的看法") — data shared by the chat-first prototype.
// Connector ids match the word ids in chapters/en/intermediate/09-giving-reasons.yml.

import { GIVING_REASONS_TARGETS } from '../utils/connectorDetect'

export const OPINION_CHAPTER_ID = 'giving-reasons'

/**
 * Detection targets for detectConnectors(). The phrases and the disambiguation
 * rules ("so" / "since" / "as") live in utils/connectorDetect.js so the opinion
 * chat, the connector mission and the daily drill all count connectors the same way.
 * 'to (purpose)' is left out — plain "to" is far too common to detect reliably.
 */
export const CONNECTOR_TARGETS = GIVING_REASONS_TARGETS

// Text inserted into the input when a hint chip is tapped
export const CONNECTOR_INSERT_TEXT = {
  'because': 'because',
  'because-of': 'because of',
  'since': 'since',
  'due-to': 'due to',
  'as': 'as',
  'so': 'so',
  'which-is-why': 'which is why',
  'in-order-to': 'in order to',
  'so-that': 'so that',
  'another-reason-is': 'another reason is',
  'plus': 'plus',
  'also': 'also',
  'on-top-of-that': 'on top of that',
  'whats-your-take': "What's your take?",
}

// Ordered so that each window of 4 mixes cause / result / purpose / adding
export const HINT_POOL = [
  'because', 'so-that', 'since', 'on-top-of-that',
  'because-of', 'which-is-why', 'another-reason-is', 'so',
  'due-to', 'in-order-to', 'plus', 'whats-your-take',
  'as', 'also',
]

// Suggestion priority for "try next time" in the summary
export const TRY_NEXT_ORDER = [
  'because', 'since', 'so-that', 'on-top-of-that', 'which-is-why',
  'another-reason-is', 'because-of', 'due-to', 'so', 'plus',
  'in-order-to', 'whats-your-take', 'as', 'also',
]

// Light opinion questions (everyday + work). `en` seeds the AI's opener.
export const OPINION_TOPICS = [
  {
    id: 'wfh',
    kind: 'work',
    en: 'Working from home vs. working at the office — which is better?',
    ja: '在宅勤務とオフィス勤務、どっちがいい？',
    zh: '在家工作和進辦公室，哪個比較好？',
  },
  {
    id: 'breakfast',
    kind: 'everyday',
    en: 'Is breakfast really the most important meal of the day?',
    ja: '朝ごはんは本当に一日で一番大事な食事？',
    zh: '早餐真的是一天中最重要的一餐嗎？',
  },
  {
    id: 'meetings',
    kind: 'work',
    en: 'Are most meetings a waste of time?',
    ja: 'ほとんどの会議は時間のムダ？',
    zh: '大部分的會議都是浪費時間嗎？',
  },
  {
    id: 'city-countryside',
    kind: 'everyday',
    en: 'Would you rather live in a big city or in the countryside?',
    ja: '大都市と田舎、住むならどっち？',
    zh: '你比較想住在大城市還是鄉下？',
  },
  {
    id: 'job-hopping',
    kind: 'work',
    en: 'Is it a good idea to change jobs every two or three years?',
    ja: '2〜3年ごとに転職するのはいい考え？',
    zh: '每兩三年換一次工作是好主意嗎？',
  },
  {
    id: 'travel-style',
    kind: 'everyday',
    en: 'Planned trips or spontaneous trips — which do you prefer?',
    ja: '計画した旅行と思いつきの旅行、どっちが好き？',
    zh: '你喜歡事先規劃的旅行，還是說走就走？',
  },
  {
    id: 'four-day-week',
    kind: 'work',
    en: 'Should companies switch to a four-day work week?',
    ja: '会社は週休3日制にするべき？',
    zh: '公司應該改成一週上班四天嗎？',
  },
  {
    id: 'phones-dinner',
    kind: 'everyday',
    en: 'Is it rude to check your phone during dinner with friends?',
    ja: '友だちとの食事中にスマホを見るのは失礼？',
    zh: '跟朋友吃飯時滑手機很沒禮貌嗎？',
  },
  {
    id: 'ai-at-work',
    kind: 'work',
    en: 'Does using AI tools at work make people better or lazier?',
    ja: '仕事でAIツールを使うと、人は成長する？それとも怠ける？',
    zh: '在工作上用 AI 工具，會讓人變更強還是變懶？',
  },
  {
    id: 'pets',
    kind: 'everyday',
    en: 'Cats or dogs — which make better pets?',
    ja: '猫と犬、ペットにするならどっち？',
    zh: '貓和狗，哪個比較適合當寵物？',
  },
]

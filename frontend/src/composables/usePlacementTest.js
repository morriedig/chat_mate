import { ref } from 'vue'

const STORAGE_KEY = 'chatmate_placementResult'

const QUESTIONS = {
  en: [
    { q: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], answer: 1, level: 'beginner' },
    { q: 'I ___ pizza last night.', options: ['eat', 'eated', 'ate', 'eating'], answer: 2, level: 'beginner' },
    { q: 'If I ___ rich, I would travel the world.', options: ['am', 'was', 'were', 'be'], answer: 2, level: 'intermediate' },
    { q: 'By tomorrow, I ___ the book.', options: ['finish', 'finished', 'will have finished', 'am finishing'], answer: 2, level: 'intermediate' },
    { q: 'He speaks as though he ___ everything.', options: ['knows', 'knew', 'known', 'know'], answer: 1, level: 'intermediate' },
    { q: 'The proposal was ___ by the committee.', options: ['turned down', 'turned off', 'turned up', 'turned in'], answer: 0, level: 'intermediate' },
    { q: 'Not only ___ the test, but she also got the highest score.', options: ['she passed', 'did she pass', 'she did pass', 'passed she'], answer: 1, level: 'advanced' },
    { q: '"It\'s raining cats and dogs" means:', options: ['Animals are falling', 'It\'s raining heavily', 'The weather is nice', 'Pets are outside'], answer: 1, level: 'beginner' },
    { q: 'The CEO\'s speech was so ___ that everyone was moved.', options: ['mundane', 'eloquent', 'verbose', 'trite'], answer: 1, level: 'advanced' },
    { q: 'Had I known about the traffic, I ___ earlier.', options: ['would leave', 'would have left', 'had left', 'will leave'], answer: 1, level: 'advanced' },
  ],
  ja: [
    { q: '私は毎日学校___ 行きます。', options: ['を', 'に', 'で', 'が'], answer: 1, level: 'beginner' },
    { q: 'この映画は___見ました。', options: ['もう', 'まだ', 'ぜんぜん', 'たぶん'], answer: 0, level: 'beginner' },
    { q: '明日雨が___、ピクニックは中止です。', options: ['降ると', '降れば', '降ったら', '降るなら'], answer: 2, level: 'intermediate' },
    { q: '彼女は日本語が話せる___です。', options: ['よう', 'そう', 'らしい', 'みたい'], answer: 1, level: 'intermediate' },
    { q: '忙しい___、手伝ってくれた。', options: ['のに', 'から', 'ので', 'けど'], answer: 0, level: 'intermediate' },
    { q: '彼の提案は___に値する。', options: ['検討', '検査', '検索', '検品'], answer: 0, level: 'advanced' },
    { q: '___ことなく努力を続けた。', options: ['たゆむ', 'たゆまぬ', 'たゆみ', 'たゆまない'], answer: 0, level: 'advanced' },
    { q: 'この本を___いただけませんか。', options: ['貸して', 'お貸し', 'お貸しして', '貸されて'], answer: 1, level: 'intermediate' },
    { q: '彼は成功する___、もっと努力すべきだ。', options: ['ために', 'ように', 'ことに', 'ものに'], answer: 0, level: 'intermediate' },
    { q: '社会___的に考える必要がある。', options: ['通念', '構造', '一般', '常識'], answer: 1, level: 'advanced' },
  ],
  zh: [
    { q: '我每天___上學。', options: ['都', '很', '是', '有'], answer: 0, level: 'beginner' },
    { q: '她___去過日本。', options: ['沒', '不', '別', '無'], answer: 0, level: 'beginner' },
    { q: '___你有空，我們去看電影吧。', options: ['因為', '如果', '雖然', '所以'], answer: 1, level: 'intermediate' },
    { q: '這個問題___解決。', options: ['難以', '難的', '很難得', '難道'], answer: 0, level: 'intermediate' },
    { q: '他___跑___喊。', options: ['一邊...一邊', '又...又', '不是...就是', '既...也'], answer: 0, level: 'intermediate' },
    { q: '這件事___而易見。', options: ['顯', '明', '清', '易'], answer: 0, level: 'advanced' },
    { q: '他的言行___一。', options: ['如', '合', '統', '不'], answer: 0, level: 'advanced' },
    { q: '___困難再大，我們也不會放棄。', options: ['儘管', '即使', '雖然', '因為'], answer: 1, level: 'intermediate' },
    { q: '他說話很___，讓人聽了很舒服。', options: ['得體', '結實', '乾脆', '講究'], answer: 0, level: 'advanced' },
    { q: '這個方案___可行性。', options: ['具有', '擁有', '持有', '佔有'], answer: 0, level: 'advanced' },
  ],
}

function loadResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveResult(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage unavailable
  }
}

export function usePlacementTest() {
  const result = ref(loadResult())

  function getQuestions(language) {
    return QUESTIONS[language] || QUESTIONS.en
  }

  function calculateLevel(answers, language) {
    const questions = getQuestions(language)
    let beginnerCorrect = 0, beginnerTotal = 0
    let intermediateCorrect = 0, intermediateTotal = 0
    let advancedCorrect = 0, advancedTotal = 0

    answers.forEach((answer, i) => {
      const q = questions[i]
      if (!q) return
      const correct = answer === q.answer
      if (q.level === 'beginner') { beginnerTotal++; if (correct) beginnerCorrect++ }
      if (q.level === 'intermediate') { intermediateTotal++; if (correct) intermediateCorrect++ }
      if (q.level === 'advanced') { advancedTotal++; if (correct) advancedCorrect++ }
    })

    const totalCorrect = beginnerCorrect + intermediateCorrect + advancedCorrect
    const totalQuestions = questions.length
    const percentage = totalCorrect / totalQuestions

    let level = 'beginner'
    if (percentage >= 0.8) level = 'advanced'
    else if (percentage >= 0.5) level = 'intermediate'

    const data = {
      level,
      score: Math.round(percentage * 100),
      totalCorrect,
      totalQuestions,
      language,
      completedAt: new Date().toISOString(),
    }

    result.value = data
    saveResult(data)
    return data
  }

  function resetResult() {
    result.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    result,
    getQuestions,
    calculateLevel,
    resetResult,
  }
}

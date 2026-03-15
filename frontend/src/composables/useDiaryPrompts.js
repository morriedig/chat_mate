const PROMPTS = {
  beginner: [
    { en: 'What did you eat today?', ja: '今日は何を食べた？', zh: '你今天吃了什麼？' },
    { en: 'Describe the weather right now', ja: '今の天気を描写してみよう', zh: '描述一下現在的天氣' },
    { en: 'What can you see from your window?', ja: '窓から何が見える？', zh: '你從窗戶能看到什麼？' },
    { en: 'What did you drink this morning?', ja: '今朝何を飲んだ？', zh: '你今天早上喝了什麼？' },
    { en: 'Describe what you are wearing today', ja: '今日着ている服を描写してみよう', zh: '描述一下你今天穿了什麼' },
    { en: 'What sounds can you hear right now?', ja: '今どんな音が聞こえる？', zh: '你現在能聽到什麼聲音？' },
    { en: 'What was the first thing you did today?', ja: '今日最初にしたことは？', zh: '你今天做的第一件事是什麼？' },
    { en: 'Describe your favorite spot at home', ja: '家のお気に入りの場所を描写してみよう', zh: '描述一下你家裡最喜歡的地方' },
    { en: 'What color do you see the most around you?', ja: '周りで一番多い色は何？', zh: '你周圍最多的顏色是什麼？' },
    { en: 'What did you have for lunch?', ja: '昼ごはんは何だった？', zh: '你午餐吃了什麼？' },
    { en: 'Describe something on your desk', ja: '机の上にあるものを描写してみよう', zh: '描述一下你桌上的東西' },
  ],
  intermediate: [
    { en: 'What was the most interesting thing you saw today?', ja: '今日見た一番面白いものは何だった？', zh: '你今天看到最有趣的事是什麼？' },
    { en: 'Describe someone you met recently', ja: '最近会った人について描写してみよう', zh: '描述一下你最近遇到的人' },
    { en: 'What made you smile today?', ja: '今日何で笑った？', zh: '今天什麼事讓你笑了？' },
    { en: 'Describe a meal you really enjoyed recently', ja: '最近美味しかった食事について書こう', zh: '描述一下你最近很享受的一頓飯' },
    { en: 'What is something new you tried this week?', ja: '今週新しく挑戦したことは？', zh: '你這週嘗試了什麼新事物？' },
    { en: 'Describe how your neighborhood looks today', ja: '今日の近所の様子を描写してみよう', zh: '描述一下你今天的社區看起來怎麼樣' },
    { en: 'What song or sound has been stuck in your head?', ja: '頭に残っている曲や音は？', zh: '有什麼歌或聲音一直在你腦海中？' },
    { en: 'Describe the busiest moment of your day', ja: '今日一番忙しかった瞬間を描写してみよう', zh: '描述一下你今天最忙碌的時刻' },
    { en: 'What is something you noticed on your way home?', ja: '帰り道で気づいたことは？', zh: '你回家路上注意到了什麼？' },
    { en: 'Describe the view from where you are sitting', ja: '今座っている場所からの景色を描写してみよう', zh: '描述一下你坐的地方看到的景色' },
    { en: 'What conversation do you remember from today?', ja: '今日覚えている会話は？', zh: '你記得今天的什麼對話？' },
  ],
  advanced: [
    { en: 'What would a photographer find interesting about where you are?', ja: '写真家があなたのいる場所で面白いと思うものは？', zh: '攝影師會覺得你所在的地方有什麼有趣的？' },
    { en: 'Compare how this place feels now vs. at a different time', ja: 'この場所の今と別の時間帯の雰囲気を比較してみよう', zh: '比較一下這個地方現在和不同時間的感覺' },
    { en: 'Describe an ordinary moment that felt meaningful today', ja: '今日意味を感じた何気ない瞬間を描写してみよう', zh: '描述一下今天一個平凡但有意義的時刻' },
    { en: 'What small detail about your day would make a good short story?', ja: '今日のどんな小さなディテールが短編小説になりそう？', zh: '你今天的什麼小細節可以寫成短篇故事？' },
    { en: 'Describe the atmosphere of a place you visited today', ja: '今日訪れた場所の雰囲気を描写してみよう', zh: '描述一下你今天去過的地方的氛圍' },
    { en: 'How did the light change throughout your day?', ja: '一日を通して光はどう変わった？', zh: '一整天光線是怎麼變化的？' },
    { en: 'What emotion best describes your day, and why?', ja: '今日を一番よく表す感情は何？その理由は？', zh: '什麼情緒最能描述你的一天？為什麼？' },
    { en: 'Describe a stranger you noticed today without judging them', ja: '今日気になった知らない人を判断せずに描写してみよう', zh: '不帶評判地描述一下你今天注意到的陌生人' },
    { en: 'What texture, smell, or taste stood out to you today?', ja: '今日印象的だった触感、匂い、味は？', zh: '今天什麼質感、氣味或味道讓你印象深刻？' },
    { en: 'If you wrote a letter to today, what would you say?', ja: 'もし今日に手紙を書くなら、何と書く？', zh: '如果你寫一封信給今天，你會說什麼？' },
    { en: 'Describe the transition between two parts of your day', ja: '一日の中の二つの場面の移り変わりを描写してみよう', zh: '描述一下你一天中兩個部分之間的過渡' },
  ],
}

function getDayOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now - start
  return Math.floor(diff / 86400000)
}

export function useDiaryPrompts() {
  function getTodayPrompt(level, locale) {
    const pool = PROMPTS[level] || PROMPTS.intermediate
    const index = getDayOfYear() % pool.length
    const prompt = pool[index]
    return prompt[locale] || prompt.en
  }

  function getRandomPrompt(level, locale) {
    const pool = PROMPTS[level] || PROMPTS.intermediate
    const index = Math.floor(Math.random() * pool.length)
    const prompt = pool[index]
    return prompt[locale] || prompt.en
  }

  return {
    getTodayPrompt,
    getRandomPrompt,
  }
}

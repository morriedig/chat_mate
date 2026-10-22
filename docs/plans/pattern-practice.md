# 常用句型與高頻練習設計

> 2026-10-22。依據：Speak Confident English（17 支）、Business English Pod（4 支）、English with Lucy（3 支）、Speak English with Vanessa（4 支），共 28 支影片的字幕整理。
> 句型本身是常用語，不受版權保護；app 內所有例句、對話一律自己寫，不照搬影片原文。

## 1. 句型清單（依溝通功能分組，括號內為出現在幾支影片 / 幾個頻道）

### 共同骨架（4 個頻道都教）
看法 → 理由 → 把話丟回去：`I'd say X, because Y. What's your take?`（6 / 3）

| 功能包 | 句型 | 次數 |
|---|---|---|
| **A. 說看法＋理由**（已做成章節 09） | I think / I believe / I'd say + 句子 | 5 / 3 |
| | In my opinion / If you ask me / Based on my experience | 3 / 2 |
| | Honestly / To be honest + 看法 | 4 / 2 |
| | I could be wrong, but… | 2 / 2 |
| | because / since + 句子；due to / because of + 名詞 | 3 |
| | One advantage / downside of X is that… | 3 / 2 |
| | Another reason is / Plus / On top of that / For example | 2 |
| | 問對方：What do you think / What's your take on / How does that sound? | 6 / 3 |
| **B. 禮貌地不同意**（教最多的功能） | 先承認：I see what you're saying, but… / I understand where you're coming from | 5 / 3 |
| | 軟性否定：I'm not sure that's the best option | 5 / 3 |
| | I'm afraid I don't quite agree | 3 / 3 |
| | 說出顧慮：My main concern is… / I have some reservations about… | 3 / 3 |
| | 不同意＋替代方案：What if we…? / How about…? / Have you thought about…? | 4 / 2 |
| | I'm not saying X; what I'm saying is Y | 2 / 2 |
| | Let's agree to disagree / That's one way of looking at it | 2 / 2 |
| **C. 提建議** | What if we / How about + V-ing / Why don't we / One option would be to | 5 / 2 |
| | 先預告：Here's what I've been thinking / I'd like to bring up… | 3 / 3 |
| **D. 同意與接話** | That's a fair point / That makes sense / That could work | 3 / 2 |
| | 接同事的話：I liked [Name]'s point about X, because… | 3 |
| **E. 釐清** | 換句話說：What I mean is / In other words / Let me put it this way | 4 / 2 |
| | 確認理解：So what you're saying is…, right? | 2–3 |
| **F. 開會** | 插話：Sorry to interrupt, but… / Can I jump in here? | 2 / 2 |
| | 進度報告：先講結論（We're on track / a week behind because of…）→ So far we've… → The main challenge is… → Our next step is… | 2 |
| | 職場片語：follow up on, look into, run into, push back, get back to you | 2 / 2 |
| **G. 閒聊** | 開放式 wh- 問題 → 追問一個細節 → 下次：Last time you mentioned X, how did it go? | 3 / 2 |

## 2. 中文母語者常見錯誤（「找錯」題庫的來源）

| # | 錯誤 | 正確 | 為什麼中文母語者會錯 |
|---|---|---|---|
| 1 | improve my ~~confident~~、speak ~~fluency~~ | confidence / fluently | 中文詞性不變形；判斷法：「我是在命名還是在形容？」 |
| 2 | ~~due to it was raining~~ | because it was raining / due to the rain | 「因為」後面接什麼都可以 |
| 3 | ~~Although~~ it's expensive, ~~but~~ I like it | 只留一個 | 中文「雖然…但是…」、「因為…所以…」成對出現 *（影片沒教，我們自己補）* |
| 4 | If it ~~will~~ rain tomorrow… | If it rains | 「如果明天會下雨」直譯 |
| 5 | I ~~will~~ visit my parents this weekend（已排好的計畫） | I'm visiting / I'm going to visit | 「會」直接對應 will |
| 6 | I ~~have been~~ there last week | I went there last week | 有明確過去時間要用過去式 |
| 7 | ~~yesterday night~~、~~remember me~~ to call | last night、remind me | 逐字翻譯 |
| 8 | ~~We have to~~ change the plan（其實只是建議） | What if we changed…? / We could… | 語氣太強，聽起來像命令 |

## 3. 讓用戶「頻繁」練習的設計

### 核心：每個句型都是一張 SRS 卡，「在任何地方用出來」就算一次複習
- 沿用 `useSRS.js`（SM-2，以 id 記錄）。句型卡 id 例：`pattern:disagree-acknowledge`。
- 用戶在**聊天、每日觀點、日記**中被偵測到用了某個句型 → `recordReview(id, true)`。
- 練習題答錯 → `recordReview(id, false)`，它就會更快再出現。
- 結果：不用另外做「複習頁」，複習自然發生在對話裡。

### 每天的節奏：「今天 3 個句型」
影片的共同建議是「一次只學 1–2 個新的」，所以：
- 每天自動挑 **2 個到期複習 + 1 個新的**，顯示在首頁卡片上。
- 這 3 個句型同時是今天聊天的目標（原型 A 的任務列）、每日觀點的目標（原型 C）、聊天時的提示（原型 B）。
- 三個入口共用同一份「今天 3 個」，練哪裡都算。

### 練習題型（由淺到深，每種 30 秒到 3 分鐘）

| 題型 | 來源 | 做法 | 練到 |
|---|---|---|---|
| ① 3 秒選擇 | Vanessa | 給一個情境，3 秒內選最自然的說法 | 反應速度 |
| ② 找錯 | Lucy | 一句有錯的話（上面第 2 節），點出錯在哪、選正確版 | 中文母語者的錯誤 |
| ③ 輪到你說 | Business English Pod | 章節對話中把「你」的台詞遮掉，自己說或打出來，再看示範 | 臨場說出口 |
| ④ 語氣階梯 | Lucy / BEP | 給一句太直接的話（We have to…），改成禮貌版 | 語氣分寸 |
| ⑤ 用在聊天裡 | 原型 A / B | 今天 3 個句型當聊天目標，用到就打勾 | 真的用出來 |

③ 成本最低：直接用每章已有的 `chat.conversations`，把 `role: user` 的台詞遮住即可，**所有既有章節立刻都有這種練習**。

### 單元結構（照影片的教法）
情境（常見的卡住場面）→ 骨架 → 生活＋職場各一個例句 → 題型 ①② → 題型 ③④ → 挑戰（題型 ⑤ 進聊天）

## 4. 建議順序

1. **句型 SRS 引擎＋「今天 3 個」**：先做，沒有這個，內容再多也不會被頻繁練到。
2. **功能包 B：禮貌地不同意**：出現最多次、職場最需要，接在章節 09 後面做成章節 10。
3. **題型 ②找錯、③輪到你說**：②用第 2 節的錯誤清單；③不用新內容。
4. 之後再做 C 提建議、F 開會、E 釐清。

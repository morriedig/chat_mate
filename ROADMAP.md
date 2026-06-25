# Chat Mate Roadmap

> 基於現有功能盤點、競品分析（Duolingo / HelloTalk / Busuu / Babbel / LingQ / Talkpal）與 UX 審查後整理的完整開發路線圖。

---

## 目前已完成的功能

| 類別 | 功能 | 狀態 |
|------|------|------|
| 聊天模式 | 5 個 AI 角色、3 個 CEFR 等級、自由對話 + 文章討論 | ✅ |
| 學習模式 | 單字列表 / 閃卡 / 測驗 / 對話練習，YAML 章節系統（27 章） | ✅ |
| 遊戲化 | XP 系統、10 級排名、連續天數、12 個成就徽章 | ✅ |
| 多語言 | UI 三語（en/ja/zh）、目標語言 en/ja/zh | ✅ |
| 語音 | Web Speech API TTS，3 種速度（普通/慢速/逐字） | ✅ |
| PWA | Service Worker、離線快取、安裝提示、更新 toast | ✅ |
| 深色模式 | 系統偵測 + 手動切換 | ✅ |
| 部署 | GitHub Actions → GitHub Pages 自動部署 | ✅ |
| 後端 | Node.js Express + Google Apps Script（雙版本）、Gemini API、API key 輪替 | ✅ |

---

## Phase 1：核心學習體驗強化

> 目標：讓學習效果更好、使用者黏著度更高。不需要後端改動，純前端即可完成。

### 1.1 間隔重複系統（SRS）
**難度：小 ｜ 影響：極高**

最有科學實證的記憶法。在現有閃卡基礎上加入 SM-2 或 FSRS 演算法。

**實作內容：**
- 新增 `useSRS.js` composable
- 追蹤每個單字的：見過次數、正確次數、下次複習時間、難度係數
- 答錯的單字更快出現，答對的間隔拉長
- 在章節選擇頁顯示「待複習」數量徽章
- 新增「每日複習」入口，跨章節聚合需複習的單字

**資料結構：**
```javascript
{
  wordId: {
    easeFactor: 2.5,      // SM-2 難度係數
    interval: 1,           // 目前間隔天數
    repetitions: 0,        // 連續正確次數
    nextReview: '2026-03-12',
    lastScore: 3           // 0-5 評分
  }
}
```

---

### 1.2 聊天即時文法反饋
**難度：中 ｜ 影響：高**

使用者每次發訊息後，AI 除了回覆對話，同時提供文法 / 詞彙 / 自然度的結構化反饋。

**實作內容：**
- 修改 `server.js` / `Code.gs` 的 prompt，要求 AI 回傳 JSON 結構化反饋
- 新增 `FeedbackPanel.vue`，顯示在聊天訊息下方（可收合）
- 反饋包含：文法評分、錯誤標示、修正建議、替代說法
**AI 回傳結構：**
```json
{
  "reply": "對話回覆",
  "hints": ["詞彙提示"],
  "feedback": {
    "grammar": { "score": 85, "issues": ["..."], "corrections": ["..."] },
    "vocabulary": { "score": 90, "suggestions": ["word -> better word"] },
    "naturalness": { "score": 75, "tips": ["native speaker 會說..."] }
  }
}
```

---

### 1.3 「為什麼這樣說」按鈕
**難度：小 ｜ 影響：高**

在每則使用者訊息旁邊加一個「💡 Explain」按鈕，點擊後 AI 解釋該句的文法結構、用詞選擇、以及更好的表達方式。

**實作內容：**
- 在 `ChatMessage.vue` 新增 explain 按鈕（僅使用者訊息顯示）
- 點擊後發送一個 explain prompt 給 AI
- 回覆顯示在訊息下方的可收合面板
- 純 prompt engineering，不需要改後端結構

---

### 1.4 個人單字本
**難度：中 ｜ 影響：高**

使用者可以在聊天中點擊任何單字加入個人單字本，連同出現的句子上下文一起儲存。單字本接入 SRS 系統。

**實作內容：**
- 新增 `useVocabularyBank.js` composable
- 聊天訊息中的單字可點擊，彈出「加入單字本」選項
- 單字本頁面：搜尋、篩選、複習模式
- 整合 SRS：單字本中的詞彙自動排入複習排程
- localStorage 持久化

**資料結構：**
```javascript
{
  wordId: {
    word: 'sustainable',
    translation: '永續的',
    context: 'We need more sustainable energy solutions.',
    source: 'chat',           // 'chat' | 'learning' | 'article'
    addedAt: '2026-03-11',
    srsData: { ... }          // 連結 SRS
  }
}
```

---

### 1.5 替代說法建議
**難度：小 ｜ 影響：中**

使用者每次發訊息後，顯示 1-2 種 native speaker 可能會用的不同表達方式。

**實作內容：**
- 在 AI prompt 中新增指令：回傳 `alternatives` 陣列
- 在使用者訊息下方顯示折疊的「💬 Native speakers might say...」區塊
- 點擊替代說法可加入單字本

---

## Phase 2：參與度與留存機制

> 目標：讓使用者每天都想打開 app。

### 2.1 每日目標系統
**難度：小 ｜ 影響：高**

讓使用者設定每日學習目標：5 分鐘 / 10 分鐘 / 15 分鐘。顯示今日進度環。

**實作內容：**
- 新增 `useDailyGoal.js` composable
- SetupScreen 或設定頁選擇每日目標
- 頂部顯示進度環（圓形進度條）
- 達成目標時觸發慶祝動畫 + 額外 XP
- 追蹤 session 時間（前台活躍時間）

---

### 2.2 連續天數保護（Streak Freeze）
**難度：小 ｜ 影響：高**

Duolingo 證實此功能大幅降低流失率。使用者每週可免費獲得 1 次 streak freeze，斷連時自動使用。

**實作內容：**
- 在 `useStreakTracker.js` 新增 `streakFreezes` 狀態
- 每週一自動補充 1 個 freeze（最多持有 2 個）
- 斷連時自動消耗 freeze 而非歸零
- UI：在 RankBadge 區域顯示 freeze 數量（🛡️ x2）

---

### 2.3 每日挑戰 / 今日話題
**難度：中 ｜ 影響：高**

每天提供一個特定話題（如「聊聊你的週末計畫」），給 AI 一個對話引導，完成可獲得額外 XP。

**實作內容：**
- 新增 `useDailyChallenge.js`
- 預定義話題庫（按等級分類，每日輪替）
- SetupScreen 顯示「今日挑戰」卡片
- 聊天時注入話題 context 到 AI prompt
- 完成條件：至少交換 5 輪對話
- 獎勵：+20 XP bonus

**話題範例：**
```javascript
const topics = {
  beginner: [
    { en: 'Describe your favorite food', ja: '好きな食べ物を説明して' },
    { en: 'Talk about your morning routine', ja: '朝のルーティンについて話そう' }
  ],
  intermediate: [
    { en: 'Discuss a movie you watched recently', ja: '最近見た映画について話そう' },
    { en: 'Share your travel plans', ja: '旅行の計画を共有しよう' }
  ]
}
```

---

### 2.4 每週任務系統
**難度：中 ｜ 影響：中**

每週提供 3-5 個具體任務（完成 5 次對話、學 20 個新單字、使用 3 個慣用語等），完成可得額外 XP 或 streak freeze。

**實作內容：**
- 新增 `useWeeklyQuests.js`
- 任務池隨機抽取，依等級調整難度
- 進度條顯示完成度
- 週末結算獎勵

**任務範例：**
```javascript
const questPool = [
  { id: 'chat_5', description: 'Complete 5 conversations', target: 5, reward: 50 },
  { id: 'vocab_20', description: 'Learn 20 new words', target: 20, reward: 40 },
  { id: 'quiz_perfect', description: 'Get a perfect quiz score', target: 1, reward: 30 },
  { id: 'streak_7', description: 'Maintain a 7-day streak', target: 7, reward: 100 }
]
```

---

### 2.5 微獎勵動畫
**難度：小 ｜ 影響：中**

在現有大型慶祝（升級、成就）之外，增加小型獎勵動畫：測驗全對時的星星動畫、完成對話的打勾動畫、音效回饋。

**實作內容：**
- CSS 動畫（confetti、bounce、sparkle）
- 可選的音效（使用已有的 audio 快取機制）
- 手機震動回饋 `navigator.vibrate()`

---

## Phase 3：語音與發音

> 目標：從純文字升級到語音互動，更接近真實對話場景。

### 3.1 語音輸入（Speech-to-Text）
**難度：大 ｜ 影響：極高**

這是與所有對話型競品（Speak、Talkpal、Gliglish）最大的差距。使用 Web Speech API 的 `SpeechRecognition` 實現語音輸入。

**實作內容：**
- 在 `ChatInput.vue` 新增麥克風按鈕
- 使用 `webkitSpeechRecognition` / `SpeechRecognition`
- 支援語言：en-US, ja-JP, zh-CN（與 TTS 對齊）
- 即時轉錄顯示在輸入框
- 長按說話 / 點擊切換模式
- 瀏覽器不支援時隱藏按鈕（優雅降級）

**注意事項：**
- Chrome/Edge 支援良好，Safari 支援有限，Firefox 不支援
- 需要 HTTPS（PWA 已滿足）
- 考慮隱私提示（首次使用時請求麥克風權限）

---

### 3.2 發音檢查
**難度：大 ｜ 影響：中**

在學習模式中，使用者可以錄音並與目標發音比較。

**實作內容：**
- 新增 `usePronunciationCheck.js`
- 學習模式每個單字旁新增「🎙️ 試試看」按鈕
- 使用 SpeechRecognition 辨識使用者的發音
- 與目標文字比較（Levenshtein 距離）
- 顯示匹配度分數（0-100%）和視覺回饋

---

## Phase 4：導航與使用體驗

> 目標：修復現有 UX 問題，提升整體使用品質。

### 4.1 Vue Router 導航
**難度：中 ｜ 影響：高**

目前用 `v-if` 切畫面，不支援瀏覽器返回鍵和深層連結。

**實作內容：**
- 安裝 `vue-router`
- 路由：`/`（setup）、`/chat`、`/articles`、`/learning`、`/learning/:chapterId`
- 支援瀏覽器返回鍵
- 支援 deep linking 和書籤
- 保留 GitHub Pages 的 base path 設定

---

### 4.2 記住使用者選擇
**難度：小 ｜ 影響：高**

目前每次回到 SetupScreen 都要重新選角色、等級、語言。應該持久化上次的選擇。

**實作內容：**
- 在 `useUserProgress.js` 或新增 `useLastSession.js` 儲存：
  - 上次選的角色、等級、語言、模式
  - 上次在學習模式中的章節
- SetupScreen 載入時自動恢復

---

### 4.3 懶載入畫面組件
**難度：小 ｜ 影響：中**

所有畫面組件目前都是 eager import，改用 `defineAsyncComponent()` 減少初始載入。

**實作內容：**
```javascript
const ChatScreen = defineAsyncComponent(() => import('./components/ChatScreen.vue'))
const LearningScreen = defineAsyncComponent(() => import('./components/LearningScreen.vue'))
const ArticleScreen = defineAsyncComponent(() => import('./components/ArticleScreen.vue'))
```
- i18n locale 也改為按需載入

---

### 4.4 無障礙修復
**難度：小 ｜ 影響：中**

**需修復：**
- 互動式 `<div>` 缺少 `role="button"`、`tabindex="0"`、鍵盤事件
- 圖示按鈕缺少 `aria-label`（深色模式切換、返回、播放音檔等）
- 硬編碼字串未翻譯："Today"、"Online"、"You"、"New Chat"、"Hide"/"Show"
- `#2badee` 在淺色背景上的對比度可能不符合 WCAG AA
- 缺少 `aria-live` 區域（XP 變化、錯誤訊息、打字指示器）

---

### 4.5 手機體驗優化
**難度：小 ｜ 影響：中**

**需修復：**
- 閃卡加入滑動手勢（左右滑切換）
- Safe area insets 適配（`env(safe-area-inset-*)`）for iPhone 瀏海/底部
- 動態 `theme-color`：深色模式時切換為 `#101c22`
- 隱藏「Press Enter to send」提示（手機上無意義）
- `RankBadge.vue` 的 hover tooltip 改為 click/tap 觸發
- 觸控目標最小 44x44px

---

### 4.6 全域錯誤處理 + 離線提示
**難度：小 ｜ 影響：中**

**實作內容：**
- `main.js` 加入 `app.config.errorHandler`
- 新增離線偵測：監聽 `online`/`offline` 事件
- 離線時顯示 banner：「目前離線，部分功能受限」
- 「New Chat」和「Reset Progress」加入確認彈窗

---

### 4.7 設定頁面
**難度：中 ｜ 影響：中**

目前沒有集中的設定頁面。

**實作內容：**
- 新增 `SettingsScreen.vue`
- 設定項目：UI 語言、深色模式、每日目標、通知偏好、音量
- 資料管理：匯出進度 JSON、匯入進度、重置（含確認）
- 關於：版本號、隱私政策連結、意見回饋連結

---

## Phase 5：內容與社群

> 目標：擴充學習內容、增加社交元素。需要部分後端改動。

### 5.1 等級測試（Placement Test）
**難度：小 ｜ 影響：中**

首次使用時，提供 10-15 題的快速測驗，自動判定使用者的 CEFR 等級。

**實作內容：**
- 新增 `PlacementTest.vue`
- 題目庫覆蓋 A1-C1 難度
- 根據答對率自動推薦等級
- 結果儲存到 userProgress
- 可在設定頁重新測試

---

### 5.2 AI 情境角色扮演
**難度：中 ｜ 影響：高**

AI 動態生成角色扮演情境（如「你在飯店 check-in，但訂房出了問題」）。Duolingo 最受歡迎的 AI 功能。

**實作內容：**
- 新增情境選擇器（依等級、主題分類）
- AI 生成情境描述和任務目標
- 聊天中注入情境 context
- 完成條件由 AI 判斷（如成功完成 check-in）
- 完成獎勵 XP

---

### 5.3 進度分享卡片
**難度：小 ｜ 影響：低**

生成一張精美的學習成果圖片，可分享到社群媒體。

**實作內容：**
- 新增 `ShareCard.vue`（漸層背景、排名、XP、連續天數、成就）
- 使用 `html2canvas` 匯出為圖片
- 分享按鈕（Web Share API）

---

### 5.4 排行榜 + 聯賽系統
**難度：大 ｜ 影響：高（需後端）**

Duolingo 的聯賽系統（銅 → 銀 → 金 → 鑽石）能提升 15% 的課程完成率。

**實作內容：**
- 需要後端資料庫（Firebase / Supabase）
- 週榜：每週 XP 排名，前 10 名晉升，後 3 名降級
- 匿名排行（不需帳號系統，用裝置 ID）
- 後續可擴展為好友系統

---

### 5.5 學習數據分析儀表板
**難度：大 ｜ 影響：中**

視覺化呈現學習數據：每日活動、詞彙掌握度、文法弱項。

**實作內容：**
- 新增 `AnalyticsDashboard.vue`
- 圖表：30 天活動熱力圖、詞彙掌握度分布、每週 XP 趨勢
- 自動偵測弱項並推薦練習內容
- 可用輕量圖表庫（Chart.js 或純 SVG）

---

## Phase 6：進階功能

> 長遠目標，需要較大的工程投入。

### 6.1 AI 動畫角色對話
**難度：極大 ｜ 影響：極高**

類似 Duolingo Video Call，提供帶有表情和口型動畫的 AI 角色視訊對話。

**實作方向：**
- 2D CSS/SVG 動畫角色（非 3D，降低複雜度）
- 搭配語音輸入 + TTS 輸出
- 角色表情隨對話情緒變化

### 6.2 個人化學習計畫
**難度：大 ｜ 影響：高**

AI 分析使用者的對話記錄、測驗成績、單字本，生成每週學習計畫。

---

## 技術債務清單

| 項目 | 嚴重度 | 說明 |
|------|--------|------|
| `useChatStorage.js` 的 base64「壓縮」 | 低 | `btoa(encodeURIComponent())` 實際上讓資料變大 33%，應移除或用真正的壓縮 |
| 聊天訊息 `v-for` 用 index 作 key | 低 | 應改用唯一 ID，避免不必要的 re-render |
| `useChatApi.js` 重複的 fetch 邏輯 | 低 | 初始請求和 token retry 的程式碼重複，應抽取共用函式 |
| `useChatApi.js` 的 `Content-Type: text/plain` | 低 | 為了繞過 GAS CORS 限制，但應加註解說明 |
| `useChatApi.js` 的 `init()` 從未被呼叫 | 低 | 死程式碼，應移除 |
| `RankBadge.vue` 用原生 CSS 而非 Tailwind | 低 | 與其他組件風格不一致 |
| `FlashcardMode.vue` 的包裝函式 | 低 | `handleFlipCard()` 只是呼叫 `flipCard()`，可直接在 template 使用 |
| 多個 composable 的 module-level 單例 | 中 | 散落的全域狀態，考慮用 Pinia 統一管理 |
| `saveProgress()` 被多次重複呼叫 | 低 | `addXP` 內部已呼叫 save，外部又再呼叫一次 |
| PWA manifest 缺少 `orientation` 和 `screenshots` | 低 | 加入 `"orientation": "portrait"` 和截圖可提升安裝體驗 |

---

## 建議實作順序

### 第一波（1-2 週）— Quick Wins
1. ✅ 每日目標 + 連續天數保護（2.1 + 2.2）
2. ✅ 記住使用者選擇（4.2）
3. ✅ 「為什麼這樣說」按鈕（1.3）
4. ✅ 替代說法建議（1.5）
5. ✅ 無障礙修復 + 硬編碼翻譯（4.4）
6. ✅ 手機體驗優化（4.5）

### 第二波（2-3 週）— 核心學習
7. ✅ 間隔重複系統 SRS（1.1）
8. ✅ 個人單字本（1.4）
9. ✅ 聊天即時文法反饋（1.2）
10. ✅ 每日挑戰（2.3）

### 第三波（2-3 週）— 進階功能
11. ✅ 語音輸入（3.1）
12. ✅ Vue Router 導航（4.1）
13. ✅ 設定頁面（4.7）
14. ✅ 等級測試（5.1）
15. ✅ 懶載入 + 技術債清理（4.3 + 技術債）

### 第四波（3-4 週）— 擴展
16. ✅ AI 情境角色扮演（5.2）
17. ✅ 每週任務系統（2.4）
18. ✅ 進度分享卡片（5.3）
19. ✅ 發音檢查（3.2）

### 長期
20. 學習數據分析儀表板（5.5）
21. 排行榜 + 聯賽（5.4）
22. AI 動畫角色（6.1）
23. 個人化學習計畫（6.2）

---

## 參考資料

- [Duolingo Gamification Strategy](https://www.sifars.com/en/blog/duolingo-gamification-strategy-ai-language-learning/)
- [Duolingo Video Call Feature](https://blog.duolingo.com/video-call/)
- [Duolingo Duocon 2025 Product Updates](https://investors.duolingo.com/news-releases/news-release-details/duolingo-unveils-major-product-updates-turn-learning-real-world)
- [Best SRS Language Learning Apps 2025](https://www.taalhammer.com/best-language-learning-apps-with-spaced-repetition-srs-and-ai-in-2025-taalhammer-vs-11-other-apps/)
- [Gamification in Learning 2025](https://elearningindustry.com/gamification-in-learning-enhancing-engagement-and-retention-in-2025)


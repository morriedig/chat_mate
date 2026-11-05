# 下一批功能：與 Codex 的討論（2026-11-06）

Claude（實作）先提 7 個候選，Codex（產品夥伴）逐項評、補充、排序；第二輪收斂成規格。原文附在後面。

## 結論

**這批（Build 5）**
1. 完整備份／還原：現在的匯出用錯 key（`chatmate_srs`，實際是 `chatmate_srsProgress`），還漏了錯誤卡、日記、聊天、每日計畫；「清除所有紀錄」也漏清 SRS。改成白名單＋版本號的完整備份，iOS 用分享面板存到「檔案／iCloud Drive」，還原前先預覽差異。需要新增 `@capacitor/filesystem`、`@capacitor/share`（要新 build）。
2. 核心 3 分鐘＋明日重說：今日練習先只有三步（改一個舊錯 → 回想一個句型 → 說或寫一句），完成就算今天完成；其餘變成「再練一些」。聊天小結挑一句「明天再說」，隔天當第三步。
3. 語音「我卡住了」救援鍵：給開頭（2～5 字）／用中文說意思換成英文片段／句型骨架；AI 不能替使用者講完整句。新後端 action `speech-rescue`（Haiku，計入每日上限）。
4. 弱化遊戲化：XP、等級、成就、每週任務、分享卡收進「更多 → 進度與成就」，不再跳全螢幕慶祝視窗；資料保留。

**下一批（先看第一批的使用數據）**
5. 個人情境句型包＋三階進階（三個練習日，不要求連續）。
6. 合併今日觀點、觀點聊天、同題講三次成一條口說流程。

**這次不做**：發音分數（iOS 辨識信心值不等於發音，競品最大抱怨就是誤判）、推播（等核心流程夠短再說）、跟讀。

## 雙方仍有的分歧
- 打字完成第三步：Claude 想算「開口」；Codex 認為可以算完成，但介面要寫「說出或寫出一句」，數據分開記 voice／text。→ 採用 Codex 的做法。
- 三日進階：Codex 反對「連續三個自然日」，改成三個練習日。→ 採用。
- 一次上線：Codex 建議 1～4 先上，5～6 看數據再做。→ 採用。

---

## 第一輪：Codex 的評估

先反駁一個前提：Build 4 剛把核心循環接起來，下一批不該再平行加 7 個入口。應先修資料安全、縮短每日流程，再強化「卡住時怎麼說」與「隔天真的說得出來」。

工作量：S＝1～3 天、M＝4～8 天、L＝2 週以上，不含 TestFlight 審核等待。

## A. 候選清單

1. **雲端備份與換機：改｜M；Apple 同步為 L**

   - 現有匯出不是完整備份：只含 4 類資料，還把實際的 `chatmate_srsProgress` 寫成 `chatmate_srs`，所以 SRS 無法正確還原。
   - 錯誤卡、每日計畫、日記、聊天、角色記憶、Retell 等也都漏掉。
   - 先做「有版本號的完整備份＋iOS 分享到檔案／iCloud Drive＋匯入預覽」，排除 `clientId`。
   - 暫不做 Sign in with Apple：會連帶需要帳號、資料庫、同步衝突、刪帳與隱私處理，現階段過重。

2. **發音回饋：砍現案｜可靠替代方案 L**

   - iOS ASR confidence 不是發音分數，受口音、噪音及語言模型影響；競品「講錯高分、講對低分」正是主要抱怨。
   - 現有 `usePronunciationCheck` 也只是比較目標文字與辨識文字的編輯距離，不是真正的發音分析。
   - 自由對話沒有目標句，更無法可靠判斷「哪兩個字唸錯」。
   - 若之後做，改成提示短語的「是否容易被辨識／是否需要重說」，不顯示百分比分數；真正逐音素分析再另案處理。

3. **Shadowing：留，但縮成每日 1 句｜M**

   - 社群常推薦錄音回聽；研究則主要支持中低程度，證據弱於提取練習與同題重講。
   - 併入現有 ListeningCard：「先聽、不看字→跟讀→回放自己→再唸一次」，不要新增獨立首頁入口，也不要自動評分。
   - 只用合成 TTS 有上限，重點應是節奏與自我察覺。

4. **每日推播＋streak 保護：改｜M**

   - 保留選時段、本機通知，但通知應直接帶回「昨天卡住的那一句」，而不是泛用「今天還沒打卡」。
   - Streak 對學習效果證據弱，而且現有程式已經每週補 1 次、最多 2 次自動保護，不必再做一套。
   - 尚未安裝 Local Notifications plugin，會需要原生變更與新 TestFlight。
   - 每日最多一次、預設關閉，先讓使用者體驗到價值再詢問權限。

5. **個人情境句型包：留、縮小範圍｜M**

   - 最符合台灣使用者「需求其實很窄」的研究，也同時利用任務型互動與 chunks。
   - 不要一次生成一大包。先問一個真實情境，產出 5～8 個可編輯句型、3 個逐漸變難的任務。
   - 必須接入今日練習、任務聊天及 SRS；若只是生成一頁清單，幾天後仍會被遺忘。
   - 第一版只做英文工作情境，避免生成器／編輯器範圍失控。

6. **每週回顧：改成每週 checkpoint｜M**

   - 「AI 寫一篇本週摘要」是被動閱讀，學習價值有限。
   - 改為：最常見 3 類錯誤、3 句先自己重說、下週只選一個重點。AI 只負責挑選與簡短說明。
   - 錯誤已有 type 與建立時間，但目前 activity log 主要只記訊息、XP、日記，需補核心流程事件。

7. **語音對話改說法：改｜M**

   - 研究支持回饋，但「先提示、讓使用者自改」優於直接 recast；也不應每句打斷。
   - 朋友先正常回應後，最多顯示一個輕提示：「這句可以更自然，要重說嗎？」使用者先重說，再顯示示範。
   - 只在明顯不自然或影響理解時觸發，並可關閉。
   - 現在已有逐句「解釋」與聊完小結，不要再做第三套完整回饋面板。

## B. 我會新增的功能

1. **3 分鐘核心模式｜M**

   - 現在每日最多可能有 3 錯誤＋3 句型＋5 單字＋3 收藏字＋2 聽力＝16 項，提醒使用者回來只會像催作業。
   - 核心只做「1 個舊錯＋1 個個人句型＋1 次開口」，完成後才顯示「再練一些」。
   - 撐過新鮮感靠低啟動成本，不靠更多 XP。

2. **語音「我卡住了」救援鍵｜S～M**

   - 提供「給我開頭 3～5 個字」「我用中文說意思」「給一個可套用句型」。
   - AI 不直接完成整句；使用者仍須自己把句子說完。
   - 這比發音打分更直接處理「知道意思但組不出句子」。

3. **明日重說｜M**

   - 聊天小結選出今天最值得修的一句，隔天成為第一個口說題：先說，再看提示。
   - 接回現有錯誤卡與 SRS，形成「今天卡住→今天修→明天說出來」。
   - 同時提供具體的每日回來理由。

4. **同情境三日進階｜M**

   - 第一天照準備內容說；第二天換對方問題；第三天加入反對或突發狀況。
   - 重複同一批 chunks，但不是重播完全相同內容，兼顧提取與遷移。
   - 可作為個人情境句型包的主要使用方式。

5. **看得見的口說進步｜M～L**

   - 保留第一次與第三次 Retell 的錄音或至少逐字稿、WPM，讓使用者直接比較。
   - 現在 Retell 最後只存字數、秒數與 WPM，連逐字稿都丟掉；很難產生「我真的變順了」的回饋。
   - 若存音檔應用 IndexedDB／檔案系統，不要塞 localStorage。

## C. 前 5 名

1. **完整備份／還原**：現有 UI 給人已備份的錯覺，實際卻漏資料且 SRS key 錯誤，屬 P0。
2. **3 分鐘核心模式**：16 項每日清單是留存最大風險；先讓每天開始與完成都容易。
3. **個人情境句型包＋三日進階**：最貼近「多益不差，但工作時組不出句子」的核心需求。
4. **語音卡住救援鍵**：在困難發生的當下提供最小支架，比事後評分更直接。
5. **提示→立即重說→明日再說**：合併候選 7 與「明日重說」，同時利用 prompt、自我修正及間隔提取。

Shadowing 排下一批；通知應等核心流程夠短再加；發音打分暫緩。

## D. 該砍或合併的現有功能

- **合併 Daily Opinion、Opinion Chat、Retell**：現在首頁有 Daily Opinion，More 裡又有 Opinion Chat，而 Retell 也取自同一組觀點題庫。整合為「準備→對話／表達→同題重說」一條口說流程。
- **Learning 的每日 SRS 與 Daily Practice 合併**：只留一個每日複習佇列；Learning Hub 回歸內容瀏覽，不再有第二套 daily review。
- **弱化 XP、Rank、Achievements、Weekly Quests、Share Card**：研究不支持它們能帶來長期學習，目前又佔據大量 UI。保留活動紀錄與 streak 即可，其餘先藏起來驗證使用率。
- **回饋入口收斂**：保留聊完小結及特定訊息的按需解釋；「自然說法」只能作為輕提示＋重說，不再新增一套分數／面板。
- **首頁仍未真正只有一條路**：目前三步流程下面還有獨立 Daily Opinion，More 裡又有重複口說入口。先完成收斂，再加新功能。

---

## 第二輪：收斂後的規格

## 1. 本批項目與順序

### 1. 完整備份／還原｜M

- 使用者看到：

  - 設定頁「備份所有資料」：產生 JSON，iOS 開分享面板，可存到「檔案／iCloud Drive」。
  - 「從檔案還原」：選檔後先顯示備份日期、資料類別、將新增／覆蓋／移除的 key 數量。
  - 確認後採「完整取代」，不做資料級合併。
  - 明示備份含聊天、日記等私人內容，檔案未加密。

- 資料格式：

```json
{
  "format": "chatmate-backup",
  "schemaVersion": 1,
  "exportedAt": "2026-11-06T12:00:00.000Z",
  "appVersion": "build-5",
  "entries": {
    "chatmate_userProgress": "{...}",
    "chatmate_srsProgress": "{...}"
  }
}
```

- 白名單：

  - 固定 key：目前所有有效進度、設定、日記索引、SRS、錯誤、每日練習，以及本批新增的：

    - `chatmate_speaking_queue`
    - `chatmate_personal_scenarios`
    - `chatmate_speaking_sessions`
    - `chatmate_rescue_stats`

  - 動態 prefix／格式：

    - `chatmate_diary_entry_*`
    - `chatmate_memory_{characterId}`
    - 符合聊天紀錄格式的 `chatmate_{language}_{character}_{level}_*`

  - 明確排除：

    - `chatmate_clientId`
    - `chatmate_allow_web`
    - 錯誤舊 key `chatmate_srs`
    - 暫時性 `chatmate_placement_result`
    - token（目前也不在 localStorage）

- 還原流程：

  1. 驗證格式、版本、白名單、每個 JSON key 的內容。
  2. 預覽差異。
  3. 在記憶體保留目前白名單快照。
  4. 移除目前白名單資料並寫入備份。
  5. 任一步失敗就 rollback；成功後 reload。

- 後端：不需要。

- iOS：

  - 新增 `@capacitor/filesystem`、`@capacitor/share`，先寫入 Cache、取得 URI，再以 `files` 開分享面板；需要 `cap sync ios` 與新 TestFlight。官方 Share API 支援 iOS 分享本機檔案。[Capacitor Share](https://capacitorjs.com/docs/apis/share)、[Filesystem](https://next.capacitorjs.com/docs/apis/filesystem)
  - Web 保留下載 `<a download>` fallback；匯入沿用 file input。

- 驗收：

  - 匯出檔含 `chatmate_srsProgress`，不含 `chatmate_srs`、`clientId`。
  - 清空 App 後還原，錯誤卡、SRS、日記、聊天、角色記憶與每日計畫都存在。
  - 未知 key 不寫入，並在預覽列為「忽略」。
  - 損壞或不支援版本的檔案不改動現有資料。
  - iPhone 分享面板可實際存入 iCloud Drive，再選檔還原。

---

### 2. 核心 3 分鐘＋明日重說｜L

- 使用者看到：

  - 今日練習先只顯示三步：

    1. 改一個舊錯。
    2. 回想一個句型。
    3. 說出一句話。

  - 三步完成後立即顯示「今天完成」，計入 streak。
  - 下方出現「再練一些（剩餘 N 項）」；原本最多 16 項都保留，只移除已在核心完成的錯誤卡與句型。
  - 第三步優先使用「明日重說」；沒有時使用今天句型的 `task`。

- `chatmate_daily_practice` 升為 version 2：

```js
{
  version: 2,
  level,
  plans: {
    "2026-11-06": {
      // 原有 patternIds、wordIds、mistakeIds、bankIds、listening、done
      core: {
        errorKey: "mistake:abc",
        errorSource: "personal", // personal | builtin
        patternId: "if-you-ask-me",
        speakingSource: "queue", // queue | pattern
        speakingItemId: "speak_xyz",
        fallbackPrompt: null,
        speakingCompletedAt: null,
        completedAt: null
      }
    }
  }
}
```

- 新增 `chatmate_speaking_queue`：

```js
{
  version: 1,
  items: [{
    id: "speak_xyz",
    source: "chat-summary", // chat-summary | pattern-fallback | personal-scenario
    sourceId: "task_...",
    original: "Yesterday I go...",
    target: "Yesterday I went...",
    cue: "說說你昨天去了辦公室",
    hint: "注意昨天發生的事",
    patternId: "",
    scheduledFor: "2026-11-07",
    createdAt: "...",
    attempts: [{
      at: "...",
      mode: "voice",       // voice | text
      text: "...",
      selfRating: "again"  // again | got-it
    }],
    completedAt: null
  }]
}
```

- `chat-summary` schema 新增：

```js
repeatTomorrow: {
  enabled: boolean,
  original: string,
  target: string,
  cue: string,
  hint: string,
  patternId: string
}
```

- AI 規則：

  - 優先選會影響理解、重複犯、或很值得變成可重用 chunk 的一句。
  - `target` 必須來自使用者原句，僅做必要修改，不得另造無關範例。
  - `cue`、`hint` 使用母語，不能洩漏完整 target。
  - 若沒有錯，可挑一個自然、值得再熟練的使用者原句，`original === target`。
  - 每個 `scheduledFor` 最多一筆；當天後續 summary 只能由使用者主動選擇替換。

- Streak：

  - 新增 `markPracticeDay('core-practice')`，抽出目前 `updateStreak` 的每日活動邏輯。
  - `onMessageSent` 與核心完成都呼叫它；同一天必須 idempotent。
  - `activityLog[date].corePractice = 1`。
  - 打字完成也可算 streak，但另存 `mode`，不可顯示成「已完成口說」。

- 後端：

  - 修改 GAS `action: chat-summary` 與 Node `/chat-summary`。
  - 不新增第三步的即時批改 API；避免時間與 AI 次數失控。

- 驗收：

  - 新舊使用者每天都能產生可完成的核心流程。
  - 完成核心後，即使額外項目沒做，首頁也顯示今天完成並更新 streak。
  - 中途離開後回來，精確回到未完成步驟。
  - 任務聊天結束後，明日重說會在下一個本地日期出現。
  - 完成核心項目後，它們不會在「再練一些」重複出現。

---

### 3. 卡住救援鍵｜M

- 使用者看到：

  - ChatInput 與 VoiceConversationBar 都有「我卡住了」。
  - 點開底部選單：

    1. 給我一個開頭
    2. 我用中文說意思
    3. 給我句型骨架

  - 支援內容顯示在輸入區上方，不加入聊天紀錄，也不算一個對話 turn。
  - 使用者仍須自己說出／打出完整句子。

- 資料：

  - 支援內容只存在目前 component state。
  - 新增 `chatmate_rescue_stats`，只記使用量，不記中文意圖或 AI 內容：

```js
{
  version: 1,
  counts: { starter: 4, intent: 2, frame: 3 },
  events: [{
    at: "...",
    mode: "starter",
    sessionType: "pattern-task"
  }]
}
```

  - 最多保留最近 30 筆事件。

- 後端：新增 GAS `action: speech-rescue`，Node 同步新增 `/speech-rescue`；使用 Haiku、low effort。

- 驗收：

  - 救援結果不會出現在 AI／使用者訊息 bubble。
  - 不會讓任務句型偵測誤判為使用者已使用。
  - 三種模式都無法回傳完整答案句。
  - 同一 turn、同一模式重開時使用快取，不重複耗一次 AI。
  - 429、離線或格式不合時顯示簡短 fallback，不中斷聊天。

---

### 4. 個人情境句型包＋三階段任務聊天｜L

- 使用者看到：

  - 「更多」中提供「建立我的工作情境」bottom sheet，不新增 route。
  - 輸入一個情境，例如「工程師每天站會，要解釋進度與 blocker」。
  - 產生 5～8 個可編輯句型與三個階段。
  - 同時間只能有一個 active 情境。
  - Active 時首頁原本的 TaskChatCard 顯示：

    - Day 1：照準備內容說。
    - Day 2：對方換一個問題。
    - Day 3：對方提出反對或追問。

  - 全部沿用現有 ChatScreen、任務列、句型偵測與小結。

- 資料：`chatmate_personal_scenarios`

```js
{
  version: 1,
  scenarios: [{
    id: "ps_...",
    title: "工程站會",
    description: "...",
    level: "intermediate",
    patterns: [{
      id: "status-update",
      pattern: "I've finished ..., and I'm currently working on ...",
      meaning: "...",
      match: ["finished", "currently working on"],
      example: "..."
    }],
    stages: [{
      day: 1,
      title: "...",
      goal: "...",
      friendRole: "...",
      instruction: "...",
      targetPatternIds: ["status-update"]
    }],
    currentStage: 1,
    stageRecords: {
      "1": {
        unlockedAt: "...",
        startedAt: "...",
        completedAt: "...",
        usedPatternIds: []
      }
    },
    active: true,
    createdAt: "...",
    updatedAt: "..."
  }]
}
```

- SRS ID：`personal:<scenarioId>:<patternId>`。

- 排程：

  - Active 情境的今日目標句型優先成為核心 3 分鐘的句型。
  - 每個 stage 最快一天完成一階。
  - 漏一天不重置；下一個實際練習日繼續下一階。
  - 每階只帶 2～3 個 target patterns 進任務聊天。

- 後端：

  - 新增 GAS `action: scenario-pack`，Node `/scenario-pack`。
  - 使用 Sonnet low effort，一個情境只呼叫一次。
  - Request：

```js
{
  description,
  level,
  language: "en",
  nativeLanguage,
  clientId,
  origin,
  authToken
}
```

  - Response：

```js
{
  scenario: {
    title,
    patterns: [/* 5-8 */],
    stages: [/* day 1, 2, 3 exactly */]
  }
}
```

- 驗收：

  - 可建立、編輯、啟用、封存情境；建立新的 active 情境會封存舊的。
  - 三階段 prompt 確實分別為預期問題、變化問題、反對／追問。
  - 三階段都使用同一批句型，但每日只目標 2～3 個。
  - 聊天小結能正確偵測個人句型並排入明日重說。
  - 不新增頁面，聊天紀錄按 scenario＋stage 分開保存。

---

### 5. 合併 Opinion 三入口｜L

- 使用者看到：

  - 首頁／更多只留一個「今日口說題」入口。
  - 固定流程：

    1. 顯示題目與兩個 connectors，30 秒準備。
    2. 第一次回答，語音優先、可打字。
    3. 朋友追問，進行 2～3 個 user turns。
    4. 結束後用同題再說一次，限時 45 秒。
    5. 顯示兩次逐字稿、字數／WPM、connector 使用差異。

  - 移除獨立 Opinion Chat 入口與 Retell 卡。
  - `/retell` 導向合併後流程；`/daily-opinion` 可沿用為新容器。

- 資料：新增 `chatmate_speaking_sessions`

```js
{
  version: 1,
  days: {
    "2026-11-06": {
      topicId: "...",
      connectorIds: [],
      notes: "",
      firstAttempt: { text: "", seconds: 0, wpm: 0, mode: "voice" },
      chatSessionTag: "opinion_2026-11-06",
      userTurns: 3,
      usedConnectorIds: [],
      repeatAttempt: { text: "", seconds: 0, wpm: 0, mode: "voice" },
      completedAt: null
    }
  }
}
```

- 舊資料：

  - 不刪除 `chatmate_daily_opinion`、`chatmate_opinionChat`、`chatmate_retell`。
  - 新流程停止寫入舊 key；它們仍納入備份。

- 後端：

  - 沿用 chat 與修改後的 `chat-summary`。
  - 不新增 opinion 專用端點。

- 驗收：

  - App 中只剩一個 opinion 入口。
  - 準備、聊天與重說使用同一天的同一題。
  - 中途離開可恢復目前階段。
  - 完成必須有第一次輸出及重說；只有聊天則顯示進行中。
  - 舊 Opinion／Retell 資料不被清除。

---

### 6. 弱化遊戲化｜S

- 使用者看到：

  - 首頁只保留精簡 streak 與核心練習狀態。
  - XP、Rank、Achievements、Weekly Quests、Daily Goal、Analytics、Share Card 收進「更多 → 進度與成就」。
  - 不再自動顯示 Level Up、Achievement、Streak Milestone 全螢幕 modal。
  - 資料仍持續累積，使用者主動進入時看得到。

- 資料：

  - 沿用 `chatmate_userProgress`、`chatmate_weeklyQuests`、`chatmate_dailyGoal`。
  - 不刪除、不 migration、不重算既有 XP。

- 後端：不需要。

- 驗收：

  - 首頁不顯示 XP／Rank／Weekly Quest 等入口。
  - 升級或解鎖不會打斷核心練習。
  - 「更多」仍能看到所有既有數值與徽章。
  - Build 更新前後 XP、streak、achievement 資料一致。

---

## 2. 核心 3 分鐘完整流程

### 建立當日核心內容

1. 舊錯：

   - 優先：已到期的 `chatmate_mistakes`。
   - 次之：尚未複習過的最近錯誤。
   - 完全沒有個人錯誤：使用今日句型的 `mistake.wrong/right` 當「常見錯誤」卡。

2. 句型：

   - 有 active 個人情境時，優先取該 stage 的 target pattern。
   - 否則取今日 `patternIds` 第一個到期項目，再取新項目。

3. 一次輸出：

   - 優先取 `scheduledFor <= today` 最早的 speaking queue item。
   - 沒有時使用今日核心句型的 `task`、`pattern` 與 `meaning` 建立本地 fallback，不呼叫 AI。

### 三步互動

1. 改舊錯：

   - 顯示原句，使用者先輸入修正。
   - 比對後才顯示答案與解釋。
   - 完成即同步標記原 Daily Practice item，避免在額外段重複。

2. 回想句型：

   - 新句型：先看／聽一個例句，再做選擇題。
   - 複習句型：直接做選擇題。
   - 正確自動記 SM-2 quality 4；錯誤記 2。
   - 不再加一次造句，因為第三步負責產出。

3. 說出一句話：

   - 明日重說：只顯示 `cue` 與 `hint`，target 隱藏。
   - Pattern fallback：顯示題目與句型骨架。
   - 語音用現有 `listenOnce()`；無法使用麥克風時可打字。
   - 提交後才顯示 target／是否用到 pattern。
   - 使用者選：

     - 「還會卡」：核心仍完成，但排到下一天再說。
     - 「說得出來」：queue item 完成。

### 完成判定

- 三個 slot 都完成後：

  - 寫入 `core.completedAt`。
  - 呼叫 `markPracticeDay('core-practice')`。
  - 首頁顯示「今天完成」。
  - Task ChatCard 變成推薦下一步。
  - 顯示「再練一些」。

- 判定的是「有完成提取／輸出嘗試」，不是答對率。

- 語音必須取得非空 transcript；打字必須有至少 2 個英文詞。ASR 失敗可切換打字。

- 使用者打字仍可完成核心與 streak，但紀錄為 `mode: text`，不計入「口說完成次數」。

---

## 3. 救援鍵 AI 規則與端點

### 選項一：給我一個開頭

- 回傳一個符合情境的英文開頭，2～5 個詞。
- 必須是未完成語意，例如：

  - `I think we should`
  - `The main reason is`
  - `What I mean is`

- 禁止：

  - 完整主張或答案。
  - 句尾 `.?!`
  - 第二句、例句、文法解釋。

### 選項二：我用中文說意思

- 使用者輸入或說中文意圖。
- 回傳 2～3 個獨立英文片段，每個最多 5 詞：

  - 動作／立場片段。
  - 關鍵名詞或形容詞。
  - 可選 connector。

- 例：中文「我明天不能開會，因為要看醫生」只能回：

  - `can't make the meeting`
  - `doctor's appointment`
  - `because`

- 禁止把片段排列成可直接照讀的完整句子。

### 選項三：給我句型骨架

- 優先從目前 task 的 target patterns 選一個。
- 必須包含至少一個未填 slot：

  - `I'd say [your choice], because [your reason]`
  - `One downside of [thing] is that [problem]`

- 不得填入使用者實際內容，不附完整 example。

### 新端點

GAS：

```js
action: "speech-rescue"
```

Node 同步：

```text
POST /speech-rescue
```

Request：

```js
{
  action: "speech-rescue",
  mode: "starter", // starter | intent | frame
  intent: "",      // intent mode only, max 300 chars
  messages: [
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ],               // last 8, total max 4000 chars
  taskContext: {
    title: "",
    goal: ""
  },
  targetPatterns: [{
    id: "",
    pattern: "",
    meaning: ""
  }],               // max 3
  level: "intermediate",
  language: "en",
  nativeLanguage: "zh",
  clientId,
  origin,
  authToken
}
```

Response：

```js
{
  success: true,
  rescue: {
    mode: "intent",
    pieces: [
      "can't make the meeting",
      "doctor's appointment",
      "because"
    ],
    frame: ""
  }
}
```

- `starter`：`pieces` 必須剛好一個。
- `intent`：`pieces` 2～3 個。
- `frame`：`pieces` 空陣列，`frame` 必須含 `[slot]`。
- 不設 `answer`、`example`、`fullSentence` 欄位。

### 伺服器防線

- Schema 後再做程式驗證：

  - 每個 piece 最多 5 個英文詞。
  - 禁止終止標點。
  - frame 必須包含 slot，且長度限制。
  - 不合格結果不回前端。

- Fallback：

  - Starter：使用固定開頭庫。
  - Frame：使用目前 target pattern 在前端產生骨架。
  - Intent：保留中文輸入並顯示「換個說法／再試一次」，不做整句翻譯 fallback。

- 此 action：

  - 使用 Haiku。
  - 計入每日 150 次限制。
  - 沿用 token、origin、每秒 rate limit。
  - 不抽取角色記憶、不產生朋友回覆、不寫入 messages。

---

## 4. 仍反對的地方

- **不應把打字稱為「一次開口」**：可以讓它完成核心與 streak，避免權限／環境阻塞，但 UI 應叫「說出或寫出一句」，數據也要區分 voice／text。
- **三日進階不應要求連續三個自然日**：漏一天若重置或失效，會把練習變成懲罰。應是三個練習日、最快一天一階。
- **備份不能用廣義 `chatmate_*` 全收**：即使名稱相同，也可能包含裝置識別、暫時狀態或未來敏感資料；必須是固定 key＋嚴格 dynamic regex。
- **核心完成不能依賴 AI 判定正確**：streak 應獎勵真實提取與輸出嘗試，否則 429、離線或誤判都會讓使用者無法完成。
- **不建議六項一次上同一個 TestFlight**：先上 1、2、3、6；確認核心完成率、voice/text 比例、救援使用率後，再上個人情境與 Opinion 合併。後兩項都是 L，和前四項一起發會很難判斷是哪個改動影響留存。

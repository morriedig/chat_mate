# 中文版計畫：外國人學台灣華語（2026-11-14，第 6 版）

## 一句話

用同一套程式，做出另一個 App「Chat Mate 華語」（暫名）：給住在台灣或想來台灣的外國人，用英文介面學**台灣華語、繁體字**，對話和單字都附拼音。

## 已決定

- 2026-11-14 使用者：中文版是**另一個獨立 App**，與英文版分開上架；**現在開工**。
- 計畫自己的假設（使用者未明說，開工後如要改再調）：學的人是外國人、介面英文。

## 為什麼是這個切法

- 學中文的 App 多數教簡體、教中國用語；台灣華語＋繁體是空出來的位置。
- 可沿用的骨架：`chapterLoader` 依路徑分語言載章節；`chapters/zh/foundation` 有三章拼音課（簡體，要改）；後端 `VALID_LANGUAGES` 含 `zh`；`dailyLoader` 的函式已收 `targetLanguage`；辨識已是 zh-TW；「我卡住了」本來就只在英文對話出現。
- 要從零寫的：後端所有「學中文」的 prompt、課程內容、拼音顯示。

## 做法總則

- 版本設定集中在新 `src/edition.js`，由建置參數 `VITE_EDITION`（`en` 預設／`zh`）決定。所有分支都用 `import.meta.env.VITE_EDITION === 'zh'` 這種**建置時就決定**的條件，英文版建置時中文專屬程式（含拼音套件）會被整段刪掉。
- 「學習語言」不再寫死 `'en'`：新增 `targetLang()`（英文版 en、中文版 zh），**只替換目前寫死 `'en'` 的地方**（朗讀、辨識、聽寫比對、例句欄位、API 請求）；`LearningScreen`、`ChatScreen` 已經用使用者選的語言，維持原樣（英文版學中文時仍是 zh）。
- 版本判斷集中在 `edition.js`，各處只 import 它匯出的常數（不直接寫 `import.meta.env`）；單元測試 mock `edition.js` 測中文分支，另外 CI 外再跑一次 `VITE_EDITION=zh vitest run` 確認建置常數下也綠。

## 做完的樣子（第一版 MVP）

### 1. 網址與部署
- 中文版 App 在 `/chat_mate/zh/app/`；中文版著陸頁在 `/chat_mate/zh/`（`frontend/landing-zh/`，發佈時複製到 `site/zh/`，與 App 的 `site/zh/app/` 不重疊）。英文版的 `/chat_mate/` 與 `/chat_mate/app/` 不變。
- `vite.config.js`：`base`、PWA manifest（名稱、圖示路徑）依 edition；用 `define` 給 `VITE_EDITION` 預設 `'en'`，確保英文版建置把中文分支當常數刪掉。`index.html` 的 title、meta description、apple-touch-icon 依 edition，用 `transformIndexHtml` 替換（`define` 對 HTML 不起作用）。
- `main.js` 的著陸頁導向：`new URL('..')` 在兩版都剛好導到各自的著陸頁（`/chat_mate/app/`→`/chat_mate/`、`/chat_mate/zh/app/`→`/chat_mate/zh/`），加測試守住。
- 中文版圖示等靜態檔用另一個 `publicDir`（`public-zh/`），英文版的 `public/` 不變。
- `.github/workflows/deploy.yml`：先建英文版並複製到 `site/app/`，再建 `VITE_EDITION=zh`（同樣帶 `GITHUB_PAGES`、`VITE_API_URL`）到另一個輸出資料夾 `dist-zh/`（加進 `.gitignore`）並複製到 `site/zh/app/`。
- `landing-zh/` 不放 `sw.js`（`landing/sw.js` 一啟動會刪掉整個網域的快取）。

### 2. 首頁與每個入口（中文版）
| 入口 | 中文版 | 備註 |
|---|---|---|
| 任務對話 | 保留 | 語言改 `targetLang()`；角色取支援 zh 的角色；`usePatternTask.js` 另寫一組初級中文情境題（點餐、問路、買東西等） |
| 每日練習 | 保留 | 見第 3 項 |
| 學習章節 | 保留 | 只顯示 zh 的入門＋初級 |
| 自由聊天 | 保留 | `SetupScreen` 的 `CHAT_LANGUAGE` 改 `targetLang()`；`useNavState` 預設語言改 `targetLang()` |
| 語音模式 | 保留 | 辨識與朗讀語言跟著 `targetLang()` |
| 角色扮演情境 | 隱藏 | 情境內容是英文 |
| 觀點聊天、今日觀點 | 隱藏 | 英文連接詞練習 |
| 日記 | 隱藏 | 初級寫日記太難，第二版再開 |
| 每日挑戰卡 | 隱藏 | 英文題目 |
| 說三遍 | 隱藏 | 字數與 WPM 只算英文字；首頁「今日路線」因此只剩 2 步 |
| 文章 | 隱藏 | 沒有中文文章 |
| 等級測驗、歡迎導覽裡的「做測驗」 | 隱藏 | 只開初級 |
| 每週英文章節 | 隱藏 | |
| 首頁的母語選單、設定頁的語言區塊 | 隱藏 | 中文版母語固定 en、介面固定英文：`useMotherTongue` 在中文版固定回傳 `en`、`setMotherTongue` 不作用；`SettingsScreen.vue` 隱藏語言區塊 |
| 自由聊天的等級 | 只留 beginner | 中文 prompt 只做初級 |
| 學習頁開的聊天 | 保留 | `LearningScreen.vue:276` 的 `characters[0]` 改成取支援學習語言的角色；中文時目標打勾改用子字串比對（`useConnectorMission` 的 `getUsedTargetIds` 依語言：中文不用 `detectConnectors` 的詞界正規式，實測「請問這個多少錢？」標不到） |
| 每日練習完成畫面的「Write opinion」 | 隱藏 | `DailyPracticeScreen.vue:398` |
| 自由聊天每日題目卡的寫日記按鈕 | 隱藏 | `chat/DailyPromptCard.vue:88` |
| 自由聊天的角色清單 | 只列支援學習語言的角色 | `SetupScreen.vue:377` 依 `characters.js` 的 `languages` 過濾；新角色 id 要加進後端 `VALID_CHARACTERS` |
| 每週任務、成就 | 保留 | 中文版排除日記、每日挑戰、文章相關的任務與成就，以及需要 3 個角色的 polyglot（`useWeeklyQuests.js`、`useAchievements.js`） |
| 「我卡住了」 | 不出現 | 本來就只在英文對話出現 |
- router：被隱藏的頁面在中文版導回首頁。

### 3. 每日練習改成依語言
- 等級：`useDailyPractice` 的 `defaultLevel()`、`LEVELS`，`useTaskChatLauncher` 的預設等級，都從 edition 取（中文版只有 beginner）。
- 載入：`getDailyPatterns`／`getDailyVocab` 帶 `targetLang()`（含 `DailyPracticeScreen.vue:119` 單字測驗干擾選項）。
- 中文 `patterns.yml` 欄位與英文版相同（`choice`、`examples`、`match`、`task`、`mistake.wrong/right/why`），檢查腳本一併檢查。
- 例句欄位**由版本決定，不接母語**：英文版學習語言 `en`、翻譯 `zh`（與現在相同）；中文版學習語言 `zh`、翻譯 `en`、另有 `pinyin`。新增 `targetField()`／`translationField()`。要改的地方：`useDailyPractice.js` 的 `buildListening`（目前只收有 `ex.en` 的例句，產出的 `en`／`zh` 欄位）、`DailyPracticeScreen.vue` 第 430、438、441、442、566、569、570 行、`ListeningCard.vue` 第 117 行。
- 拼音顯示：中文版在句型卡、單字卡、聽力題答案的學習語言那行下方顯示 `pinyin`。
- 朗讀：`DailyPracticeScreen.vue`（`speak()`）、`ListeningCard.vue`、`BankWordCard.vue`、`MistakeCard.vue`、`CoreSpeakingCard.vue` 的固定 `'en'` 改 `targetLang()`。
- 聽寫比對：`utils/wordDiff.js` 對中文改以「字」為單位比對、忽略標點（目前中文整句會被清成空字串，`diffWords('隨便打', '我要一杯珍奶').matches === true`，2026-11-14 實測）。`ListeningCard.vue` 讀 `item.en` 的地方改讀學習語言欄位。
- 第 3 步打字門檻：中文至少 2 個漢字（`useDailyPractice` 的 `isValidCoreAnswer` 與 `CoreSpeakingCard.vue:38` 的按鈕門檻都改）。`CoreSpeakingCard` 的辨識語言用 `targetLang()`。

### 4. 內容
- 入門：三章拼音課改繁體、台灣讀音。
- 初級 8 章台灣生活情境：自我介紹、點餐與飲料客製、搭捷運公車、便利商店、問路、租屋看房、看醫生、跟同事聊週末。每章單字（附拼音）、3 段對話、填空。
- 每日練習：`data/daily/zh/beginner/patterns.yml`、`vocab.yml`。
- `characters.js`：至少 2 個角色支援 zh。
- `scripts/check-chapter.mjs` 支援 zh（檢查繁體、拼音欄位）。

### 5. 拼音與點字
- 對話訊息可切換顯示拼音（開關放在 `ChatScreen.vue`）：先用 `opencc-js` **字級**轉換（不用 `twp` 這類詞彙轉換，會改字數，例如「計程車→出租车」）轉簡體，再用 `pinyin-pro` 標注，加「轉換前後字數相同」的測試（2026-11-14 實測：直接標繁體會錯，例如「怎麼 zěn mó」「銀行 yín xíng」「還沒 huán méi」；轉簡體後都對）。兩個套件壓縮後約 206 KB，只在中文版用動態 import 載入，並以建置時條件包住，英文版建置不產生這個 chunk。
- 轉簡體後仍會錯的多音字（如「長得」cháng dé）與台灣讀音（如「垃圾 lèsè」「和 hàn」）用 `customPinyin` 補；只放不會誤傷其他詞的項目（實測「東西→dōng xi」會把「東西南北」也改錯），每一項都有測試。
- 章節與每日練習的拼音寫在 YAML 裡；自動標注只用在 AI 的聊天回覆。`chapterLoader` 把 zh 的 `pinyin` 欄位傳給單字卡與章節對話 `getChapterConversations`（目前只傳 en 的 phonetic、ja 的 reading）。
- 中文內容（對話、例句、單字）加 `lang="zh-Hant-TW"`，讓繁體字形正確；`style.css` 的中文排版規則目前只看 `<html lang>`，元素上的 `[lang|=zh]` 只加字型特性與行高（不設 font-size，避免壓過 Tailwind 字級）。只在中文版的學習語言內容上加 lang，英文版的 `ex.zh` 翻譯行不動。
- 介面固定英文：中文版 `i18n/index.js` 忽略 `chatmate_locale`，固定 `en`。
- 聊天點字：中文用 `Intl.Segmenter('zh-TW', { granularity: 'word' })` 取整個詞（目前只取一個字）；拼音若用 ruby 顯示，點字取詞要照樣正常（加測試）。
- 任務對話的句型標示（`connectorDetect.js`）對中文句中的句型標不到；第一版接受（打勾用的是子字串比對，不受影響），第二版再改。

### 6. 朗讀
- `utils/tts.js` 的 zh 改 `zh-TW`。

### 7. 後端（server.js 與 Code.gs 同步）
- 新增選填請求欄位 `language`（預設 `en`）給 `/sentence-check`、`/chat-summary`；`/chat`、`/feedback`、`/diary-feedback` 已有 language。
- 前端呼叫端在中文版送 `language: 'zh'`：`useSentenceCheck.js`、`useChatSummary.js`、`ChatSummaryPanel.vue`。
- 中文 prompt（台灣華語、繁體、初級）：`/chat` 的角色、等級說明、每日情境、填充詞與轉場句；`/feedback`（聊天訊息批改）；`/sentence-check`；`/chat-summary`；`/diary-feedback` 的中文規則簡體範例改繁體。
- 錯誤類型依語言分開：英文維持現在 7 種；中文 `measure-word`、`aspect`（了／過／著）、`word-order`、`de-particle`（的／得／地）、`word-choice`、`other`。各端點 JSON schema 的 enum 依語言選；前端 `useMistakes` 的 `MISTAKE_TYPES` 加入中文類型；`normalizeSentence` 保留漢字、去掉中文標點（目前會把中文清成空字串，`addMistake` 因此把所有中文錯題當成「沒改」丟掉，`mistakeId` 也會撞號），英文的結果不變，中英各加測試。中文 `/feedback` prompt 沿用現有的 `"<original>" → "<corrected>"` 引號格式（`parseCorrectionText` 不認「」）。
- `sanitizeRepeatTomorrow` 的 `normalizeForCompare` 依語言：中文保留漢字（目前會把中文清成空字串，兩項檢查一律通過），加後端測試。
- 每日用量上限沿用共用計數。

### 8. i18n
- 中文版用 edition 覆寫字串，涵蓋 `en.json` 裡寫死 English 的字串：副標題、「Your English level」、「English speaking practice」、每日練習的「Write one sentence in English」「At least 2 English words」等（開工時用 grep `English` 全部列出）。

### 9. iOS
- Capacitor CLI 只讀固定檔名的設定（`capacitor.config.ts`／`.js`／`.json`），無法指定第二份。做法：把現有 `capacitor.config.json` 換成 `capacitor.config.ts`，並加 `typescript` devDependency（CLI 讀 `.ts` 需要它，目前專案沒裝）。依環境變數 `CHATMATE_EDITION` 輸出設定；**不帶變數時輸出與現在的 JSON 完全相同**：除了單元測試，兩種環境變數各實跑一次 `npx cap config` 比對，英文版再跑一次 `npx cap sync ios` 確認成功。中文版：另一個 appId、appName、`server.url` 指 `/chat_mate/zh/app/`、`ios.path` 指 `ios-zh/`。
- `ios-zh/`：複製 `ios/` 後改 bundle ID（`project.pbxproj` 的 `PRODUCT_BUNDLE_IDENTIFIER`）與顯示名稱；上傳前檢查 archive 的 bundle ID，避免傳到英文版的 App 記錄。Info.plist 顯示名稱與麥克風、語音辨識說明改中文版用語；與英文版相同的只支援 iPhone（`TARGETED_DEVICE_FAMILY = 1`）、直式；新 bundle ID 用 API 註冊；圖示另做（交給 Codex 畫）。
- `docs/ios.md` 補中文版的 build 段。

## 英文版會跟著變的地方（接受）

英文版本來就能學中文（母語選 English 時學習語言是 zh，學習頁會載入 zh 章節，也能從學習頁開中文聊天）。以下改動會讓這條路徑也跟著變，屬於改善，接受：拼音課改繁體、多出 8 章初級中文、朗讀 zh-TW、中文聊天與批改改用新的台灣華語 prompt。

## 不做（第一版）

- 聲調評分、手寫、注音輸入。
- 中級以上內容、每週自動加章。
- 簡體版、中國用語。
- 同一個 App 裡切換英文版／中文版。
- 第 2 項表中標「隱藏」的入口。
- 中文句型標示、分開計算兩版的每日上限。

## 不能變的規則

- 不帶 `VITE_EDITION` 建置時，英文版的畫面、行為、localStorage key、網址、英文的 API 請求都不變（例外只有上一段列的「英文版學中文」路徑）；英文版測試全綠。
- 後端新增的 `language` 欄位選填、預設 `en`；英文的錯誤類型 enum 與 prompt 不變；每日上限的計數 key 不變。
- 不帶 `CHATMATE_EDITION` 時 Capacitor 設定與現在相同。
- **兩版的資料只在 iOS 上分開**。網頁版同一網域、localStorage 共用；網頁只供開發測試，接受。

## 會改到的地方

| 範圍 | 檔案 |
|---|---|
| 版本設定 | 新 `src/edition.js` |
| 建置／部署 | `vite.config.js`、`index.html`、`main.js`、`.github/workflows/deploy.yml`、`.gitignore`、新 `landing-zh/` |
| 入口 | `SetupScreen.vue`、`SettingsScreen.vue`、`ChatScreen.vue`、`chat/DailyPromptCard.vue`、`useConnectorMission.js`、`style.css`、`LearningScreen.vue`、`WelcomeOnboarding`、`useNavState.js`、`useMotherTongue.js`、`useTaskChatLauncher.js`、`usePatternTask.js`、`useWeeklyQuests.js`、`useAchievements.js`、`characters.js`（等級）、`router.js` |
| 每日練習 | `useDailyPractice.js`、`DailyPracticeScreen.vue`、`ListeningCard.vue`、`BankWordCard.vue`、`MistakeCard.vue`、`CoreSpeakingCard.vue`、`utils/wordDiff.js` |
| 拼音與點字 | 新 `utils/pinyin.js`、`ChatMessage.vue`、`chapterLoader.js`、單字卡元件、`package.json`（`pinyin-pro`、`opencc-js`） |
| 朗讀 | `utils/tts.js` |
| 批改與小結 | `useSentenceCheck.js`、`useChatSummary.js`、`ChatSummaryPanel.vue`、`useMistakes.js` |
| i18n | `i18n/locales/en.json`、edition 覆寫檔、`i18n/index.js` |
| 內容 | `data/chapters/zh/`、`data/daily/zh/beginner/`、`characters.js`、`scripts/check-chapter.mjs` |
| 後端 | `backend/Code.gs`、`backend/server.js`、新 `backend/lib/rules.js`、新 `backend/test/` |
| iOS | `capacitor.config.json` → `capacitor.config.ts`、`package.json`（`typescript`）、新 `ios-zh/` |
| 文件 | `CLAUDE.md`（edition、API 的 `language` 欄位、中文錯誤類型）、`docs/ios.md` |

## 驗證

- 單元測試：edition 設定、`targetLang()`、拼音標注（含台灣讀音對照）、中文聽寫比對、每日練習載入 zh 與中文作答門檻、預設等級、錯誤類型依語言、`main.js` 導向、Capacitor 設定（不帶變數時與現在相同）。
- 後端測試：把純函式（`normalizeForCompare`、`sanitizeRepeatTomorrow`、錯誤類型選擇、`language` 驗證）抽到新的 ESM 模組 `backend/lib/rules.js`，`server.js` import 它（`backend/package.json` 是 `type: module`，不能用 `require.main`；`server.js` 最外層有 `setInterval`，測試不能 import `server.js`）。用 `node --test backend/test/` 測（`backend/package.json` 加 `test` script）；Code.gs 同步同一份邏輯（GAS 不能 import，內容照抄並加註「與 backend/lib/rules.js 同步」）。
- **不帶 `VITE_EDITION` 建置的 dist 與改動前比對**：檔案清單（忽略檔名 hash）與 precache 數量相同、沒有拼音 chunk。章節與每日練習 YAML 是 eager glob，新中文內容會讓英文版 JS 變大，屬預期。
- 章節檢查腳本跑過所有 zh 章節。
- Playwright 冒煙測試中文版主要流程（含確認 `/sentence-check`、`/chat-summary` 送出 `language: 'zh'`）；320／390 寬度巡檢中文版各畫面。
- 後端實打：中文的對話、訊息批改、句子檢查、小結各一次，確認回繁體、錯誤類型在中文清單內；英文版同樣各打一次確認沒變。
- TestFlight 內部測試。

## 上線順序

1. 後端先部署（新欄位選填，英文版不受影響）：clasp 設定在 repo 外（session 暫存區 `gas-push/`），部署到現有 production deployment，部署前確認 id 非空。
2. 前端合併，workflow 同時發佈英文版與中文版。
3. 中文版 iOS 建置上傳 TestFlight。

## 要你做的事

1. App 名稱（暫名「Chat Mate 華語」／英文 "Chat Mate Mandarin"）。
2. 在 App Store Connect 網站建新 App 記錄（API 不能建）。

## 粗估

- 程式：約 3～4 天的 agent 工作量。
- 內容（3 章入門改寫＋8 章初級＋每日句型單字）：分批寫，每批檢查。

## 檢查後改了什麼

- 第 1 輪（6 個 critical）：localStorage 共用改為明寫接受；首頁英文專用功能處理；每日練習依語言載入；朗讀改 zh-TW；`/sentence-check`、`/chat-summary` 加 `language`；錯誤類型依語言分開。另採納粗估、iOS、PWA、i18n、拼音套件驗證等建議。
- 第 2 輪（8 個 critical）：
  - 網址撞路徑：App 改 `/chat_mate/zh/app/`、著陸頁 `/chat_mate/zh/`。
  - 每日練習寫死英文的地方全部列出，中文聽寫改以字比對。
  - 預設等級與可選等級從 edition 取。
  - 送 `language: 'zh'` 的三個前端呼叫端列入。
  - 首頁每個入口都列進保留或隱藏表。
  - 「英文版不會朗讀中文」不成立：改為明寫接受英文版學中文路徑跟著變。
  - Capacitor 改用單一 `capacitor.config.ts` 依環境變數切換。
  - `sanitizeRepeatTomorrow` 依語言正規化。
  - 另採納：拼音 chunk 用建置時條件包住、`/feedback` 與 `/diary-feedback` 寫出、母語選單隱藏、假設列進「已決定」、句型標示接受、i18n 全列、clasp 位置。
- 第 3 輪（3 個 critical）：
  - 例句翻譯欄位改由版本決定、不接母語（避免英文版預設母語 en 時翻譯變成英文），補上漏列的 442、570 行與 `buildListening`、`ListeningCard`。
  - 中文版固定母語與介面：補 `SettingsScreen.vue`、`useMotherTongue.js`。
  - Capacitor `.ts` 設定需要 TypeScript：加 devDependency，驗證改成實跑 `npx cap config`／`cap sync`。
  - 另採納：聊天等級只留初級、學習頁聊天角色、初級中文任務題、每週任務與成就過濾、`lang="zh-Hant-TW"`、iOS 裝置與方向、後端測試做法、`define` 預設值、`index.html` 圖示與描述、每日練習拼音顯示與按鈕門檻、英文版連帶變化補聊天 prompt。
- 第 4 輪（3 個 critical）：
  - 後端測試改為抽出 `backend/lib/rules.js`（ESM，不能用 `require.main`；`server.js` 有最外層 `setInterval`）。
  - 學習頁中文聊天的目標打勾改用子字串比對。
  - 補兩個連到隱藏頁的按鈕（每日練習完成畫面、聊天題目卡）。
  - 另採納：自由聊天角色過濾與 `VALID_CHARACTERS`、中文排版規則套到元素、字級轉換與字數測試、中文分支的測試跑法、`dist-zh/` 輸出、`transformIndexHtml`、`targetLang()` 只換寫死的地方、介面固定 en、著陸頁不放 sw.js、dist 比對忽略 hash。
- 第 5 輪（1 個 critical）：
  - `useMistakes` 的 `normalizeSentence` 保留漢字（否則中文錯題全部被丟掉），中文 `/feedback` 沿用引號格式。
  - 另採納：單字干擾選項帶語言、中文 YAML 欄位對齊、`[lang|=zh]` 不設字級、`publicDir` 分開、`ios-zh/` 由複製產生並檢查 bundle ID、部署帶齊環境變數、版本常數集中在 `edition.js`、章節對話拼音、今日路線剩 2 步、polyglot 成就、後端 test script。
  - 依流程第 5 輪仍有 critical，修正後交使用者決定是否開工。

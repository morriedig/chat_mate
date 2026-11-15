# Chat Mate 兩個 App 說明

這個資料夾（`chat_mate`）同時產出兩個 iPhone App 和它們的網頁版。兩個 App 共用同一份程式碼和同一個後端，建置時用一個參數決定做出哪一個。

最後更新：2026-11-16

## 一眼看完

| | Chat Mate（英文版） | Chat Mate 華語（中文版） |
|---|---|---|
| 給誰用 | 母語是中文、想把英文「說得出口」的人 | 住在台灣或想來台灣、母語是英文的外國人 |
| 學什麼 | 英文（初級／中級／高級） | 台灣華語、繁體字（目前只有初級） |
| 介面語言 | 中文或英文（可切換） | 固定英文 |
| 聊天對象 | Emma、Marcus、Sophia、James、Yuki | 美玲（Mei-ling，台北上班族）、志偉（Chih-wei，台南咖啡店老闆） |
| iOS bundle ID | `com.morrie.chatmate` | `com.morrie.chatmate.zh` |
| App Store Connect 名稱 | Chat Mate: AI English … | Chat Mate 華語 |
| TestFlight | Build 5（內部群組「Me」） | Build 1（內部群組「Me」） |
| 網頁版（App 本體） | https://morriedig.github.io/chat_mate/app/ | https://morriedig.github.io/chat_mate/zh/app/ |
| 著陸頁 | https://morriedig.github.io/chat_mate/ | https://morriedig.github.io/chat_mate/zh/ |
| 原生專案 | `frontend/ios/` | `frontend/ios-zh/` |

在一般瀏覽器打開 App 網址會被導到著陸頁；網址後面加 `?web=1` 可以直接用網頁版測試。

## 兩個 App 怎麼共用程式

- **iPhone App 只是外殼**：用 Capacitor 包起來，打開後載入上面那個網頁網址。所以改網頁、推上 `master`，兩個 App 下次打開就是新版本，**不用重新送 TestFlight**。只有改到原生部分（圖示、權限說明、原生套件、Capacitor 版本）才要重新打包上傳。
- **建置參數 `VITE_EDITION`**：不帶就是英文版；`VITE_EDITION=zh` 建出中文版。程式裡所有「這是哪一版」的判斷都只能從 `frontend/src/edition.js` 讀，例如：
  - `IS_ZH`：是不是中文版
  - `TARGET_LANG`：要學的語言（en／zh）
  - `LEVELS`、`DEFAULT_LEVEL`：可選的程度
  - `isFeatureEnabled()`：中文版隱藏的功能（清單是 `HIDDEN_IN_ZH`）
- **原生外殼的參數 `CHATMATE_EDITION`**：`frontend/capacitor.config.ts` 依它決定同步到 `ios/` 還是 `ios-zh/`。不帶就是英文版。
- **同一個網域**：兩個網頁都在 `morriedig.github.io`，所以瀏覽器裡兩版的 localStorage 是共用的（網頁只拿來測試，可以接受）。iPhone 上是兩個不同的 App，資料各自分開。

## 各自有哪些功能

### 英文版（Chat Mate）

- **首頁「今日路線」三步**：今日練習（3 分鐘：改一個舊錯誤、回想一個句型、說一句話）→ 用今天的句型完成任務對話 → 同題講三次。
- **聊天**：自由聊天、任務對話、角色扮演情境、觀點聊天；語音模式；「我卡住了」（只有英文對話有）；聊完的小結和「明天再說這句」。
- **學習**：單字、字卡、測驗、填空、對話練習；英文中級每週一自動新增一章。
- **其他**：日記、今日觀點、文章、等級測驗、完整備份與還原（iCloud Drive）。

### 中文版（Chat Mate 華語）

- **首頁「今日路線」兩步**：今日練習 → 用句型完成任務對話（題目是台灣生活情境，例如點珍奶、問捷運站）。
- **聊天**：只有美玲和志偉，說台灣華語、繁體字；聊天畫面有「Pinyin」開關，打開會在回覆下面顯示拼音；點一個詞可以存成單字（會取整個詞，不是單一個字）。
- **每日練習**：句型、例句、單字都附拼音，朗讀用台灣口音（zh-TW），聽寫逐字比對，第 3 步打字至少 2 個漢字。
- **學習**：3 章拼音課（四聲、聲母、韻母）完成後，解鎖 8 章初級課：自我介紹、點餐與飲料、捷運公車、便利商店、問路、租屋、看醫生、跟同事聊週末。
- **批改**：錯誤類型改成中文專用的一組：量詞、了／過／著、詞序、的／得／地、用詞、其他。說明用英文寫。
- **隱藏的功能**：日記、今日觀點、觀點聊天、說三遍、文章、等級測驗、每日挑戰、角色扮演情境、語言切換。原因是這些功能的內容或計分目前只支援英文。

## 後端

- **正式環境**：Google Apps Script（`backend/Code.gs`），部署在固定的 production deployment（目前 @26）。兩個 App 共用。
- **開發用**：`backend/server.js`（Node），邏輯和 Code.gs 要保持一致。
- **共用規則**：語言驗證、錯誤類型、「明天再說這句」的檢查寫在 `backend/lib/rules.js`，Code.gs 裡有一份逐字相同的副本；台灣華語的 prompt 在兩個檔案的 `TAIWAN MANDARIN PROMPTS` 標記之間，也要逐字相同。`cd backend && npm test` 會檢查兩邊有沒有同步。
- **AI**：聊天用 Claude Haiku，批改用 Claude Sonnet。
- **用量與防濫用**：
  - 每台裝置每天 150 次、全站每天 3000 次 AI 呼叫（台灣時間）。
  - token 每台裝置 10 秒 1 個、全站每 10 分鐘最多 300 個。前端會帶自己的 `clientId`。
- **API 規格**：見根目錄 `CLAUDE.md` 的 API Endpoints 一節。中文版請求會多帶 `language: 'zh'`。

## 內容放在哪裡

| 內容 | 英文版 | 中文版 |
|---|---|---|
| 學習章節 | `frontend/src/data/chapters/en/`（初級 10 章、中級 11 章，每週一自動加一章） | `frontend/src/data/chapters/zh/foundation/`（拼音 3 章）、`zh/beginner/`（8 章） |
| 每日練習句型與單字 | `frontend/src/data/daily/en/<程度>/` | `frontend/src/data/daily/zh/beginner/` |
| 角色 | `frontend/src/data/characters.js`（`languages` 欄位決定誰說哪種語言） | 同一個檔案 |
| 介面文字 | `frontend/src/i18n/locales/en.json`、`zh.json` | 用 `en.json`，再以 `zh-edition.en.json` 覆寫提到 English 的字串 |

章節格式檢查：`node frontend/scripts/check-chapter.mjs <檔案>`（中文檔會自動改用 `check-zh.mjs`：檢查繁體、拼音、題數）。

## 自動排程

- **每週一 09:00**（本機 launchd：`~/Library/LaunchAgents/com.morrie.chatmate.weekly-chapter.plist`）執行 `scripts/weekly-chapter.sh`，自動寫一章英文中級課程，測試通過後推上 `master`，完成後跳 macOS 通知。
- 寫法照 `docs/plans/weekly-chapter.md` 的路線圖。log 在 `~/Library/Logs/chatmate-weekly-chapter.log`。
- 目前只有英文版會自動加章；中文版要等初級有人使用後再決定。

## 開發與測試

```bash
cd frontend
npm install

# 本機跑
npm run dev                       # 英文版
VITE_EDITION=zh npm run dev       # 中文版

# 測試（兩版都要跑）
NODE_OPTIONS=--no-experimental-webstorage npx vitest run
VITE_EDITION=zh NODE_OPTIONS=--no-experimental-webstorage npx vitest run

# 後端測試
cd ../backend && npm test
```

- 測試裡要模擬某一版，用 `frontend/src/__tests__/helpers/editions.js` 的 `enEdition`／`zhEdition`。
- `frontend/src/__tests__/component/zhEditionLangCoverage.spec.js` 會用真實課程內容檢查：中文版每段中文內容都標了 `lang="zh-Hant-TW"`。新增畫面時把它加進這支測試的 `SCENARIOS`。

## 上線

| 要上什麼 | 怎麼做 |
|---|---|
| 網頁（兩版一起） | 推上 `master`，GitHub Actions（`.github/workflows/deploy.yml`）會建英文版到 `/chat_mate/app/`、中文版到 `/chat_mate/zh/app/`，兩個著陸頁一起發佈。中文版建置失敗時英文版也會發佈不了。 |
| 後端 | 用 clasp 推 Code.gs，再 `clasp deploy -i <production deployment id>` 更新同一個部署。**部署前一定確認 id 不是空的**，空的會另開一個新部署。clasp 設定與 deployment id 放在 repo 外。 |
| iOS App | 見 `docs/ios.md`：建網頁 → `cap sync` → `xcodebuild archive` → 用手動簽章 `-exportArchive` 上傳。中文版加 `CHATMATE_EDITION=zh VITE_EDITION=zh`、專案改用 `ios-zh/`；上傳前檢查 archive 的 bundle ID，避免傳錯 App。 |

上線順序：有改後端 API 時，**先部署後端、再推前端**。後端新增的欄位都要做成選填，舊版前端才不會壞。

## 相關文件

- `CLAUDE.md`：架構、路由、localStorage key、API 規格、Editions 一節
- `docs/ios.md`：iOS 打包與上傳步驟、簽章與描述檔
- `docs/plans/zh-edition.md`：中文版的計畫書（為什麼這樣做、做了什麼、不做什麼）
- `docs/plans/voice-and-zh-checklist.md`：這一輪工作的 checklist 和之後再做的小問題
- `docs/plans/weekly-chapter.md`：每週英文章節的寫法與路線圖
- `design/zh-icon/`：中文版圖示原稿（字型 Noto Sans TC Bold，SIL Open Font License）

## 之後再做的小問題

- 中文任務打勾：像「一……就……」這種句型會被拆成「一」「就」，句子裡只要有「一」就可能被判成已使用。
- 學中文的人用簡體輸入時，不會自動轉成繁體再比對答案。
- 全站 token 上限可以被偽造很多 `clientId` 刷光（最長擋 10 分鐘，比原本好很多）。
- 英文版上線綁在中文版建置成功之後（同一個部署流程）。

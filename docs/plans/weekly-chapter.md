# 每週新增一個中級章節（給 agent 照做的指南）

> 目的：每週在 `frontend/src/data/chapters/en/intermediate/` 加一個英文中級（B1–B2）章節。
> 這份文件自成一體：沒有其他背景也能照著做完。做完的樣子 = 新的 YAML 通過檢查腳本、vitest 全綠、`npm run build` 成功、路線圖打勾、commit 並 push。
> **測試或 build 失敗且修不好 → 不要 push**，停下來回報失敗的指令與輸出。

## 0. 這個 app 和使用者

- Chat Mate：台灣成人練英文的 app（Vue 3 + Vite）。主要用戶端是 iOS App，它直接載入 GitHub Pages 上的網頁，所以 push 到 `master` 就會上線。
- 目標使用者：台灣上班族，**英文看得懂、但上班時講不出完整句子**。所以章節要偏「工作上開口說」的情境，教能直接套用的句型，而不是艱深單字。
- 章節由 `frontend/src/data/chapterLoader.js` 自動載入（`import.meta.glob` 讀所有 `chapters/**/*.yml`），**不用改任何程式就會出現在「學習」畫面**，依 `meta.order` 排序。

## 1. 找出這週要做第幾週

1. 看下面「路線圖」第一個沒打勾的項目，那就是這週的主題和週數。
2. 再用程式確認現有最大的 order（檔名不可靠：Week 1、2 的檔名沒有數字前綴）：
   ```bash
   cd frontend && node -e "const y=require('js-yaml'),fs=require('fs'),d='src/data/chapters/en/intermediate/';for(const f of fs.readdirSync(d))console.log(y.load(fs.readFileSync(d+f,'utf8')).meta.order,f)" | sort -n
   ```
   新章節的 `order` = 最大值 + 1，必須等於路線圖上的週數。不一致就停下來回報，不要猜。

## 2. 檔名與 id

- 檔名：`NN-slug.yml`，NN 是兩位數週數（`10-status-updates.yml`、`11-asking-for-clarification.yml`），slug 是小寫英文加連字號。
- `meta.id`：slug 的形式（可以跟檔名 slug 一樣，例：`status-updates`），全部章節之間不可重複。它會被存進使用者的進度與 SRS（`<meta.id>_<word.id>`），**上線後不可改名**。
- `words[].id`、`chat.conversations[].id`：章節內不可重複，小寫連字號。對話 id 慣例：`<主題縮寫>-<序號>-<情境>`，例 `status-1-daily-standup`。

## 3. YAML 結構（每個欄位都必填，除非註明）

範本：`10-status-updates.yml`（最新、符合本文件所有規則）。`09-giving-reasons.yml` 結構相同，但 icon 還是 emoji（舊規則，見第 4 節）。

```yaml
# Chapter: Week NN - Title
# 一兩行說明本章教什麼、用什麼結構。
meta:
  id: status-updates                 # 見第 2 節
  title:       { en: "...", ja: "...", zh: "..." }   # 實際請用多行寫法，見範本
  description: { en: "...", ja: "...", zh: "..." }   # 1–2 句，清單上只顯示一行（會截斷），重點放前面
  icon: "update"                     # Material Symbols 名稱（小寫加底線），不是 emoji，見第 4 節
  order: 10                          # 整數 = 週數
  level: intermediate

words:                               # 14–18 個（Week 9 = 16、Week 10 = 17）
  - id: on-track
    word:
      en: on track                   # 學習目標：片語／句型本身
      ja: 予定どおり                  # 該語言的對應說法（短）
      zh: 進度正常
    reading: "on TRAK"               # 英文發音拼讀（大寫 = 重音），不是日文假名
    phonetic: "/ɑːn ˈtræk/"          # IPA，前後要有斜線
    description:                     # 用法說明，1–2 句；常見錯誤用「✗ 錯 → ✓ 對」
      en: "..."
      ja: "..."
      zh: "..."
    sentence:                        # 一個例句，三語意思一致
      en: "..."
      ja: "..."
      zh: "..."

chat:
  conversations:                     # 3 段，每段 6 則，partner / user 交替，partner 先講
    - id: status-1-daily-standup
      title:                         # en 標題 ≤ 20 字元左右，手機上會截斷
        en: "Daily Stand-up"
        ja: "..."
        zh: "..."
      messages:
        - role: partner              # 只能是 partner 或 user
          text: { en: "...", ja: "...", zh: "..." }
        - role: user                 # user 的台詞要用到本章的 words，每段至少 2–3 個
          text: { en: "...", ja: "...", zh: "..." }

quiz:
  questionsPerRound: 5
  xpReward: 25
  cloze:                             # 8 題填空（有 cloze 時測驗只出這些題）
    - sentence: "Good news — we're ___ to launch on June 3."   # 恰好一個 ___
      options: ["on track", "behind schedule", "blocked by", "waiting on"]  # 4 個不重複，含答案
      answer: "on track"             # 必須等於某個 words[].word.en（不分大小寫、忽略括號內容），才會連到該字的 SRS
      explain:                       # 答錯時顯示，說明「為什麼是這個」
        en: "..."
        ja: "..."
        zh: "..."
```

補充：

- 第一個 word 建議放「結構卡」，`word.en` 用 `→` 串起三步（例：`"Done → Next → Blocker"`）。含 `→` 或括號的 word 不會被聊天偵測當目標，這是刻意的。
- 其他 word 的 `word.en` 寫成使用者會**原樣講出口**的片語（例：`I'm working on`、`by end of day`），因為「學完去聊天」任務會在使用者的聊天訊息裡字串比對這些片語（`getChapterConnectors` → `utils/connectorDetect.js`）。不要用 `to (purpose)` 這種帶括號的寫法，除非真的無法偵測。
- `word.ja` / `word.zh` 是對照意思，不是翻譯腔的直譯；`description` 可以混英文例子。
- 有字串含 `:`、`#`、開頭是引號或 `- ` 的值，一律加雙引號（YAML 會誤判）。`'` 在雙引號裡不用跳脫。

## 4. 內容規則

- **zh = 台灣繁體中文、台灣上班族的講法**：「上線、主管、簡報、加班、站會、跟進、卡關、下班前」，不要「上綫、領導、匯報、视频」。不得出現簡體字（檢查腳本會擋常見的簡體字，但不是全部，自己再看一遍）。中英混排時英文前後留半形空格（`API key`、`Excel 公式`）。
- **ja = 自然的日語**，日本職場會這麼說的說法（「朝会」「1on1」「経理」），不要逐字翻英文。
- **程度 B1–B2**：句子 8–20 字，常用字；難的是「在對的情境用對的片語」，不是生字。
- **情境**：台灣成人的真實日常，偏職場（站會、跟主管回報、跨部門、客戶、廠商、日本或海外分公司、Slack／Teams、視訊會議）。可以夾一段生活情境，但每章至少 2 段對話是工作場景。人名用常見英文名或不用名字。
- **不用 emoji**：學習畫面不顯示 YAML 裡的 emoji。`meta.icon` 由 `frontend/src/utils/chapterSymbol.js` 轉成 Material Symbols 圖示：舊章節的 emoji 查表轉換；**新章節直接寫 Material Symbols 名稱**（`update`、`help`、`call`、`handshake`…，到 https://fonts.google.com/icons 確認名稱存在），寫錯或不認得會退回 `menu_book`。內文（description、sentence、對話）也不放 emoji。`✗ / ✓ / →` 是一般符號，可以用。
- **不跟已有章節重複**：先讀路線圖的「已做」與舊章節的 words 清單（`grep -h "      en:" <檔>` 可快速看），同一個片語不要在兩章當主角。
- 例句、對話一律自己寫，不照搬影片、教材原文。
- 三語意思要對得上：en 改了，ja、zh 要跟著改。

## 5. 驗證（全部要過）

在 `frontend/` 下：

```bash
# 1. YAML 能解析，欄位齊全、id 不重複、order 不重複、cloze 答案對得上 words、沒有 emoji、沒有常見簡體字
node scripts/check-chapter.mjs src/data/chapters/en/intermediate/NN-slug.yml
#    要看到：OK <meta.id>: N words, 3 conversations, 8 cloze

# 2. 全部單元／整合測試（一定要加 NODE_OPTIONS，否則 localStorage 相關測試會大量失敗）
NODE_OPTIONS=--no-experimental-webstorage npx vitest run
#    要看到：Tests  NNN passed (NNN)，沒有 failed

# 3. 正式 build
npm run build
#    要看到：✓ built in ...
```

（`check-chapter.mjs` 對舊章節會報 icon／emoji／cloze 的錯，那是舊規則，只對新檔案跑。）

建議再做一次畫面檢查（手機寬度不能有水平捲動）：

1. `VITE_API_URL=http://api.test/chat npx vite --port 5210 --strictPort`（背景執行）
2. 用 `frontend/node_modules/playwright-core` 開 390×844，先寫入 localStorage：
   `chatmate_allow_web=1`、`chatmate_onboarded=1`、`chatmate_home_more_open=1`、`chatmate_locale=zh`、`chatmate_motherTongue=zh`、
   `chatmate_lastSession={"type":"learning","levelId":"intermediate","targetLanguage":"en","motherTongue":"zh","uiLanguage":"zh"}`
3. 開 `http://localhost:5210/?web=1#/`，點 `.start-button` → 進 `#/learning`，確認新章節在清單最後、圖示不是 `menu_book`；點進去看列表、測驗、對話三個分頁。
4. 每個畫面確認 `document.documentElement.scrollWidth === clientWidth`（390）。截圖放 scratchpad，不進 repo。
5. 關掉 vite。

任何一步失敗：修 YAML 再從第 1 步重跑。**修不好就不要 commit／push**，回報失敗的指令與輸出最後 20 行。

## 6. 路線圖打勾

在下面的路線圖把這週打 `[x]`，後面加上檔名。發現路線圖該調整（主題太像、順序不合理）就改，並在回報裡說明。

## 7. Git

```bash
cd "$(git rev-parse --show-toplevel)"   # repo 或 worktree 的根目錄
git status                        # 確認只動到新章節檔與本文件；其他未提交的改動不要一起 add
git add frontend/src/data/chapters/en/intermediate/NN-slug.yml docs/plans/weekly-chapter.md
git commit -F - <<'EOF'
Add Week NN intermediate chapter: <Title>

<一兩句：教哪些片語、三段對話是什麼情境>

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_018dqGJt5Zzi6r7x5UMuKq6D
EOF
```

標題用英文祈使句（`Add ...`），跟 repo 既有 commit 一致；trailer 兩行原樣保留在最後。

推到哪裡（先 `git fetch origin`，一律用 `origin/` 的分支判斷，本機分支可能是舊的）：

1. 從 `origin/master` 的最新狀態開工（可以是 detached worktree）。開工前確認上一週的章節檔在 `origin/master` 上；不在就停下來回報，不要補做或猜。
2. 第 5 節全綠後 commit，`git push origin HEAD:master`。被拒（遠端有新 commit）就 `git pull --rebase origin master`，**重跑第 5 節**再推；不要 force push。
3. 如果 `origin/feat/ios-app` 存在：
   - 它是剛推上去的 commit 的祖先（`git merge-base --is-ancestor origin/feat/ios-app HEAD` 成功）→ `git push origin HEAD:feat/ios-app`（fast-forward，讓兩邊一致）。
   - 不是（它有 master 沒有的 commit）→ 不要動它，在回報裡寫「feat/ios-app 有 master 沒有的 commit，沒有同步」，交給使用者決定。
   - 呼叫你的人（排程腳本或使用者）明確說只推 master，就只推 master。
4. push 到 `master` 會觸發 GitHub Pages 部署（iOS App 直接讀這個網址），等於上線。

## 8. 回報

附上：新檔路徑、words／對話／cloze 數量、三個驗證指令的輸出最後幾行、截圖路徑、commit SHA 與 push 到哪些分支（或為什麼沒 push）、路線圖剩下幾週。

---

## 路線圖

已做（不要重複）：Week 1 自我介紹與背景（`identity-and-background.yml`）、2 講故事（`telling-stories.yml`）、3 未來與計畫、4 經歷與成就、5 旅行問題與投訴、6 意見與異議、7 描述個性、8 娛樂與評論、9 說出理由（含「延後上線」的對話，之後別再用同樣情境）。

- [x] Week 10 回報進度與卡關（status updates & blockers：I've finished / I'm working on / blocked by / waiting on / ETA / heads-up）— `10-status-updates.yml`
- [x] Week 11 聽不懂時請對方說清楚（asking for clarification：Sorry, could you say that again? / What do you mean by…? / Just to clarify, … / So you're saying… / Could you give me an example?） — `11-asking-for-clarification.yml`
- [ ] Week 12 跟同事閒聊（small talk：weekend、lunch、commute、天氣與颱風假、How's your week going? / Any plans for…? / 怎麼自然結束對話）
- [ ] Week 13 有禮貌地提出請求（making requests politely：Could you…? / Would you mind…-ing? / I was wondering if… / Is there any chance… / when you get a chance）
- [ ] Week 14 給回饋與接受回饋（giving & receiving feedback：What worked well… / One thing I'd change… / Have you considered…? / Thanks, that's helpful / 三明治法）
- [ ] Week 15 電話與視訊會議（phone & video calls：You're on mute / Can you see my screen? / You broke up a bit / Let me share my screen / I'll drop off now）
- [ ] Week 16 協調期限與工作量（negotiating deadlines：Would it work if… / The earliest I can do is… / If we push X, we can… / I can commit to… / What's flexible here?）
- [ ] Week 17 說明問題與狀況（explaining a problem：It's not working since… / The issue seems to be… / Here's what happened / We've tried… / The impact is…）
- [ ] Week 18 報告數字與趨勢（presenting numbers：increased by / dropped to / roughly / compared to last quarter / doubled / a slight dip / peaked）
- [ ] Week 19 開會時插話與拉回主題（meetings：Sorry to interrupt / Can I add something? / Let's get back to… / Let's take this offline / Can we park that?）
- [ ] Week 20 會後確認與追蹤（following up：Just to recap… / Action items / Who's taking care of…? / I'll send a summary / Let me confirm…）
- [ ] Week 21 出錯時道歉與補救（handling mistakes：That's on me / I should have… / Here's how I'll fix it / It won't happen again / Thanks for catching that）

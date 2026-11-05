# Build 4：改進項目一次做完（2026-11-05）

依 `research-2026-10.md` 的建議順序，全部做完後發 TestFlight build 4 給使用者一起測。

## 前後端約定（API）

- `POST /chat-summary`（GAS action `chat-summary`）
  - Body：`{ messages, level, nativeLanguage, patterns: [{ id, pattern, match }] }`
  - 回傳：`{ summary: { points: [{ original, hint, corrected, explanation, type }], usedPatternIds: [], encouragement } }`
  - `points` 1～3 個，先給 `hint`（不直接給答案），`type` 見下。
- 錯誤分類 `type`：`article`、`tense`、`third-person-s`、`plural`、`connector`、`word-choice`、`other`
  - 聊天回饋的 corrections、造句檢查、日記 corrections 都帶這個欄位（Claude schema 為必填，舊資料沒有時前端當 `other`）。
- 每日用量上限：超過時回 `429`，`{ success: false, isDailyLimit: true }`。
- 聊天系統提示放進 Claude 的 `system` 欄位；`challengeContext` 用來放任務說明。

## Checklist

- [ ] 1. 錯誤複習卡：聊天回饋、造句檢查、日記的錯 → `chatmate_mistakes` → SRS（`mistake:<id>`）；先讓使用者自己改，再看答案；中文母語者常見錯誤複習更頻繁
- [ ] 1b. 單字庫到期的字放進今日練習
- [ ] 2. 任務型聊天：用今天的句型聊天（目標列＋偵測使用）；聊完小結（AI 1～3 點，先提示再看答案，錯誤進複習）
- [ ] 2b. 後端：system 欄位、角色少講自己、不用第三人稱、`chat-summary`
- [ ] 3. 語音：停頓時間可調（預設 2.5 秒）、「我還在想」按鈕
- [ ] 3b. 同題講三次（4/3/2）＋開口前 30 秒準備
- [ ] 4. 中文母語者回饋規則（聊天回饋、造句檢查、日記）＋ `type` 欄位
- [ ] 5. 首頁收斂成一條路：今日練習 → 任務聊天 → 小結；其他收進「更多」
- [ ] 6. 費用保護：每人每日上限、全站每日上限
- [ ] 7. 每日練習的聽力段落（聽句子選答案、聽寫）
- [ ] 測試、手機寬度巡檢（320／375／390，中英）
- [ ] 後端部署（GAS）＋線上驗證
- [ ] 前端上線
- [ ] iOS build 4 上傳 TestFlight

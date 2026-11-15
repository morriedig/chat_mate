# 麥克風統一走原生辨識＋中文版規劃：checklist（2026-11-13）

## A. 四個麥克風改用 `utils/stt.js`（App 裡走 iPhone 內建辨識）
- [x] coder：ChatInput、DiaryEditor、DailyOpinionScreen、usePronunciationCheck 改用 listenOnce／stopListening／isSTTAvailable，補測試
- [x] tester：全部測試、build（第 1 輪 789 全過）
- [x] reviewer 第 1 輪：角度 1、2 都退回（送出後句子被填回、沒講話改打字會被清掉、iOS 兩個辨識同時開會互卡、缺測試）
- [x] 修正 3 輪（送出後填回、打字被清、iOS 兩個辨識互卡、停止後馬上重開被拒、舊 session 事件、等 stop 加 3 秒上限）；tester 815 全過；角度 1、2 APPROVE
- [x] 320／390 寬度巡檢：畫面沒改（只改了一個按鈕的 click 處理），不需要
- [x] 合併到 master（70682aa）、推上線
- [ ] 實機：聊天輸入框、日記、今日觀點、單字卡發音的麥克風（併入 Build 5 實機測試）

## B. 中文版（外國人學台灣華語）
- [x] 計畫書 `docs/plans/zh-edition.md`
- [x] 計畫檢查第 1 輪：退回 6 條，已改進第 2 版
- [x] 計畫檢查第 2 輪：退回 8 條 → 第 3 版
- [x] 計畫檢查第 3 輪：退回 3 條 → 第 4 版
- [x] 計畫檢查第 4 輪：退回 3 條 → 第 5 版
- [x] 計畫檢查第 5 輪：退回 1 條（中文錯題存不進去）→ 第 6 版補上；依流程交使用者決定
- [x] 使用者說現在開工（2026-11-14）
- [x] 使用者選「照第 6 版開工」、App 名稱「Chat Mate 華語」（2026-11-15）
- [x] `frontend/src/edition.js`（分支 `feat/zh-edition`，66ffa24）
- [x] A 建置／部署／入口
- [x] B 每日練習／拼音／錯題
- [x] C 後端中文 prompt 與規則
- [x] D 課程內容：拼音課改繁體、8 章初級、每日句型單字
- [x] 合併四條線（1aa6e2a）；tester：前端 900／900（en、zh 設定各一次）、後端 22／22、兩版建置、內容檢查全過
- [x] reviewer 第 1 輪：角度 2、3 APPROVE；角度 1 退回（學習頁等中文沒標 lang）、角度 4 退回（CLAUDE.md 沒寫 edition 與部署）
- [ ] 修正（coder 進行中：lang、單一等級自動選、More practice 說明、拼音行英數字、句型拼音、成就、測試 mock 統一、CLAUDE.md）→ tester → 角度 1、4 再審
- 已知取捨（不改）：英文版建置多一個 152 bytes 的 edition chunk（precache 71→72）；英文版上線要等中文版建置成功；英文版學中文時學習頁聊天角色改成 Mei-ling；拼音「長得」固定 zhǎng de；簡體輸入不會自動轉繁體比對
- [x] 320／390 × 淺色／深色巡檢中文版：首頁、每日練習、學習、設定、拼音課、聊天設定，沒有超出畫面、沒有 JS 錯誤（修正後再巡一次聊天畫面）
- [ ] 後端部署（clasp，先上）→ 前端合併上線（英文版不變、中文版 /chat_mate/zh/app/）
- [ ] E iOS：capacitor.config.ts＋typescript、ios-zh/、註冊 bundle ID、圖示（Codex 畫）
- [ ] 使用者：App Store Connect 建「Chat Mate 華語」記錄
- [ ] TestFlight

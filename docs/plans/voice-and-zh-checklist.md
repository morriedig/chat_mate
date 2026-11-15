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
- [ ] A 建置／部署／入口（coder 進行中）
- [ ] B 每日練習／拼音／錯題（coder 進行中）
- [ ] C 後端中文 prompt 與規則（coder 進行中）
- [ ] D 課程內容：拼音課改繁體、8 章初級、每日句型單字（coder 進行中）
- [ ] 合併四條線、tester、reviewer（角度 1、2、3、4）
- [ ] 320／390 巡檢中文版畫面
- [ ] 後端部署（clasp，先上）→ 前端合併上線（英文版不變、中文版 /chat_mate/zh/app/）
- [ ] E iOS：capacitor.config.ts＋typescript、ios-zh/、註冊 bundle ID、圖示（Codex 畫）
- [ ] 使用者：App Store Connect 建「Chat Mate 華語」記錄
- [ ] TestFlight

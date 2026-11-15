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
- [x] 修正 5 輪（lang 標記改由守護測試＋真實資料把關、英文版學習語言區塊回歸、英文版中文錯題回歸、單一等級自動選、拼音「嗨」與動詞後「得」、角色名統一 Chih-wei、CLAUDE.md）；最後 tester 979／979（en、zh 各一次）、後端 22／22；角度 1、2、3、4 APPROVE
- 已知取捨（不改）：英文版建置多一個 152 bytes 的 edition chunk（precache 71→72）；英文版上線要等中文版建置成功；英文版學中文時學習頁聊天角色改成 Mei-ling；拼音「長得」固定 zhǎng de；簡體輸入不會自動轉繁體比對
- [x] 320／390 × 淺色／深色巡檢中文版：首頁、每日練習、學習、設定、拼音課、聊天設定，沒有超出畫面、沒有 JS 錯誤（修正後再巡一次聊天畫面）
- [x] 後端部署 @24→@25（2026-11-15），正式環境實打：美玲／志偉中文招呼繁體台灣口語、Emma 英文照常、中文句子檢查回 measure-word
- [x] 前端合併 master 上線（b981f8c）：/chat_mate/zh/、/chat_mate/zh/app/ 200；正式網址實測中文版跟美玲聊天、英文版首頁正常
- [x] 修 token 頻率限制：原本全站每分鐘只發 1 個 token（以網域計，所有使用者共用），改成每個 clientId 10 秒 1 個＋全體每 10 分鐘 300 個；tester 全過、角度 1、3 APPROVE；後端 @26、前端 212bf4f 上線；正式環境實測三個 client 連續拿到 token、同 client 10 秒內被擋、聊天第一次就成功
- [x] E iOS：capacitor.config.ts（CHATMATE_EDITION，未帶時等於舊 JSON）＋typescript、frontend/ios-zh/、bundle ID com.morrie.chatmate.zh 已用 API 註冊；兩個專案 xcodebuild 成功；角度 2 APPROVE；合併 master
- [x] 圖示：Codex 畫（Noto Sans TC Bold，OFL），已傳給使用者
- [x] 使用者核可圖示（2026-11-15「沒問題」）
- [x] App Store Connect 記錄「Chat Mate 華語」（2026-11-16，使用者在網頁按建立）
- [x] TestFlight：Build 1（1.0）上傳、VALID；App Store 描述檔「Chat Mate Mandarin App Store」以 API 建立（手動簽章，同英文版）；內部群組「Me」可看全部 build，使用者已加入
- [ ] 使用者實機測試中文版

## 之後再做（審查 suggestion）
- 中文目標打勾：「一……就……」切成「一」「就」，含「一」就會打勾
- lang 守護測試只抓漏標，不抓錯標（FeedbackPanel tips 若回英文）
- 英文版上線綁在中文版建置成功（deploy.yml 同一個 job）
- 簡體輸入不會自動轉繁體比對
- token：全體上限可被偽造 clientId 刷光（最長擋 10 分鐘，比原本好）；被擋的請求也會搶 script lock

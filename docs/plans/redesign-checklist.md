# 介面重新設計：checklist（2026-11-06）

設計稿由 Codex 依 distinctive-frontend 規範產出（`docs/design/DESIGN.md`、`docs/design/mockups/`），Claude 實作。

- [x] Codex 設計稿：方向、token、元件規格、每頁規格、設計稿 HTML
- [x] 設計稿渲染成 PNG 並檢查
- [x] 基礎：token、字型內建（Figtree、Material Symbols）、舊色名對應、`<html lang>` 跟介面語言
- [x] 共用元件：`components/ui/Cm*`
- [x] 首頁、設定、等級測試、歡迎導覽、首頁開的面板（agent A）
- [x] 今日練習、同題講三次、今日觀點（agent B）
- [x] 聊天全部（含小結、單字存取、語音、文章）（agent C）
- [x] 日記、學習（agent D）
- [x] 合併四個分支、處理翻譯檔衝突
- [x] 全部測試、build
- [x] 巡檢：320／390 × 淺色／深色 × 中文／英文，13 個畫面狀態都沒有超出畫面、截圖看過（各 agent 另外各自跑過自己的畫面）
- [x] 上線（網站）；App 不用重新送 build（字型隨網站載入）
- [ ] 與 Codex 討論的新功能（`next-features-2026-11.md`）：等使用者決定要不要做

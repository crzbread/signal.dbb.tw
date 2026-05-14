# Signal: Automated Intelligence Workspace

Signal 是一個基於 Gemini CLI 的自動化主題追蹤與情報驗證系統。它能幫你從網路上持續追蹤感興趣的領域，透過 AI 自動驗證資訊來源的真實性，並將結果整理成結構化的 VitePress 情報網站。

## 工作流程 (Workflow)

系統運作分為三個核心階段：

1. **主題設定 (Topic Setup)**：在 `settings/` 定義追蹤主題與過濾規則，決定「關心什麼」與「排除什麼」。
2. **情報調查 (Investigation)**：AI 代理人根據設定進行廣泛搜尋，並透過工具驗證網址有效性 (HTTP 200 OK) 與內容真實性，杜絕虛假資訊。
3. **自動編修 (Curation)**：將驗證過的情報自動合併至 `content/`，產生格式統一且易於閱讀的日報。

## 快速啟動 (Gemini Commands)

本專案深度整合 Gemini CLI，透過專屬的 Slash 指令啟動工作流：
- `/menu`：列出全部的指令。
- `/build-topics`：將興趣設定轉換為長期穩定的搜尋規格書。
- `/run-daily`：啟動每日調查任務，自動驗證並更新日報。
- `/rerun-topic`：針對特定日期或主題重新執行調查與合併。
- `/publish`：執行 Build 檢查、Commit 與遠端推送。

## 專案結構 (Project Structure)

- `settings/`：**配置層**。存放追蹤主題設定 (`topics.md`) 與 AI 執行邏輯 (`prompts/`)。
- `raw/`：**資料層**。存放調查證據（URL、狀態碼、原文引用）與去重紀錄。
- `content/`：**發布層**。最終生成的 Markdown 內容，由 VitePress 渲染成網站。

## 技術開發 (Development)

專案使用 Yarn 管理依賴，並以 VitePress 作為靜態網站產生器。

```bash
# 安裝依賴
yarn

# 啟動本地開發伺服器
yarn docs:dev

# 建置靜態網站
yarn docs:build
```

---
*Signal: Reliable intelligence gathering and verification workspace.*

# Signal Project Entry

這是個人科技情報系統。除非明確指令，否則不要主動搜尋或修改檔案。

## 啟動行為
進入專案或無任務時，僅顯示：
```text
可用指令：
- /menu：功能概覽
- /build-topics：更新搜尋規格 (topic-prompts.md)
- /run-daily [YYYY-MM-DD]：執行調查並合併日報
- /rerun-topic YYYY-MM-DD <topic>：重跑特定 topic 並合併
- /publish：Build、Commit、Push
```

## 核心準則 (Core Constraints)

- **寫作邊界**：
  - Subagent：僅限寫入 `raw/runs/YYYY-MM-DD/`。
  - Merge Agent (LLM)：將 Raw Data 智慧合併至 `content/daily/`，取代舊有 `merge.js`。
  - 嚴禁修改 `settings/`、`GEMINI.md`、`README.md` 或專案配置檔。
- **真實性 (Grounding)**：
  - 以採集到的原始正文為準。
  - 只有 `verified` 狀態的條目能進入日報（指成功獲取 JSON 與正文）。
- **寫作風格**：
  - 目標讀者：**普通人**。
  - 要求：繁體中文、專業易懂、專注實質影響、避免渲染詞。
- **資源調度**：
  - 採取批次派發策略（建議 3-5 個並行）。
  - 若遇 429 或超時，必須調低併發。

## 指令對照表

| 指令 | 執行 Prompt | 產出/影響 |
| :--- | :--- | :--- |
| `/build-topics` | `topic-builder.md` | `raw/generated/topic-prompts.md` |
| `/run-daily` | `run-topics.md` | `raw/runs/` & `content/daily/` |
| `/rerun-topic` | `run-topics.md` | `raw/runs/` & `content/daily/` (Upsert) |
| `/publish` | `publish.md` | `yarn docs:build` & Git Push |

## 專案結構
- `settings/`：規格與 Prompts。
- `raw/`：驗證證據、去重記錄與 Logs。
- `content/`：VitePress 發布內容。

## 網站維護
```bash
yarn docs:dev   # 本地預覽
yarn docs:build # 發布前檢查
```

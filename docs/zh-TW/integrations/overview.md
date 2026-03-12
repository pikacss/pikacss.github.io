---
description: 了解每個 PikaCSS integration 共用的 build-time 流程，並為你的技術堆疊選擇合適的設定路徑。
---

# Integrations 總覽

PikaCSS 在每個 adapter 上都維持同一套 engine model。你仍然是寫靜態的 `pika()` 呼叫、載入同一份 engine config、匯入產生的 CSS entry，然後讓 integration 幫你保持 generated files 同步。

這個章節的目的，是把設定決策縮小到必要範圍。只要先搞清楚這套共用工作流，之後在 Vite、Nuxt，或其他以 unplugin 驅動的工具之間做選擇，多半就只是註冊方式與預設值的差異。

## 選擇你的路徑

| 如果你使用的是 | 請前往 |
| --- | --- |
| Vite | [Vite](/zh-TW/integrations/vite) |
| Nuxt | [Nuxt](/zh-TW/integrations/nuxt) |
| 其他以 unplugin 驅動的 bundler | 先看 [Vite](/zh-TW/integrations/vite) 建立基本心智模型 |
| 想在 CI 或 editor 中強制靜態規則 | [ESLint](/zh-TW/integrations/eslint) |

## 一套共用的 integration 心智模型

每個 adapter 都有相同的四個工作：

1. 掃描原始碼中受支援的 `pika()` 用法
2. 從 inline 物件或 `pika.config.*` 解析 engine config
3. 寫出 generated CSS 與 generated TypeScript types
4. 暴露 `pika.css` 這個 virtual module，讓應用程式能載入輸出的樣式

<<< @/zh-TW/.examples/integrations/plugin-options.ts

只要這四個部分有正常運作，integration 就是在正常運作。大多數設定問題，通常不是高階 config 出錯，而是其中某一段根本沒有接上。

## integration 之間會改變什麼

- adapter 要註冊在哪裡
- 預設會掃描哪些檔案
- dev server 的重新載入路徑會怎麼運作
- framework 慣例是否會多包一層 module

engine 本身不會因為 adapter 改變，就突然變得更動態，或更偏向某個 framework。

## 建議的第一個選擇

如果你有選擇空間，先從 Vite 開始。它提供最乾淨的心智模型、最少的 framework 抽象，以及從原始碼走到 generated output 的最快路徑。

如果應用程式本來就是 Nuxt 形狀，那就選 Nuxt。對 Nuxt app 來說它是正確的 adapter，但不是第一次學基本觀念的最佳入口。

## 在任何 integration 上都該先驗證什麼

1. adapter 真的有註冊在 bundler 或 framework config 裡。
2. 應用程式有載入 `pika.css`，或該 integration 對應的等價入口。
3. 你的 `pika()` 呼叫位在 scan config 會涵蓋到的檔案裡。
4. `pika.gen.css` 與 `pika.gen.ts` 出現在你預期的位置。

## Next

- [Vite](/zh-TW/integrations/vite)
- [Nuxt](/zh-TW/integrations/nuxt)
- [ESLint](/zh-TW/integrations/eslint)
- [Configuration](/zh-TW/guide/configuration)

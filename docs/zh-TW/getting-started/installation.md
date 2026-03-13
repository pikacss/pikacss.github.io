---
description: 安裝主要 integration、驗證一條最基本的設定流程，並理解哪些 generated files 屬於 build-time workflow 的一部分。
---

# 安裝

大多數專案都應該從 unplugin package 開始。這條路徑透過同一套共享 integration model，涵蓋 Vite、Rollup、Webpack、Rspack、Rolldown 與 esbuild。

如果你還在判斷 PikaCSS 是否適合這個專案，請先讀 [PikaCSS 是什麼？](/zh-TW/getting-started/what-is-pikacss) 和 [靜態限制](/zh-TW/getting-started/static-arguments)。安裝頁預設你已經通過這個適配檢查。

::: code-group
<<< @/zh-TW/.examples/getting-started/install-unplugin.sh [pnpm]
<<< @/zh-TW/.examples/getting-started/install-unplugin-npm.sh [npm]
<<< @/zh-TW/.examples/getting-started/install-unplugin-yarn.sh [yarn]
:::

如果你使用的是 Nuxt，請直接前往 [Nuxt](/zh-TW/integrations/nuxt)。

## 先從一條可驗證的基準路徑開始

除非專案本來就跑在其他工具上，否則先從 Vite 開始。第一次設定的目標不是設計最終架構，而是先證明 build 看得到 `pika()` 呼叫、會改寫它們，也真的會輸出你能檢查的 CSS。

如果專案本來就跑在 Rollup、Webpack、Rspack、Rolldown 或 esbuild 上，請保留原本的 adapter，並在那個環境裡重現同一條基準路徑：註冊 plugin、匯入 `pika.css`，再驗證一個字面值 `pika()` 呼叫。接著再用 [Integrations Overview](/zh-TW/integrations/overview) 確認共用的心智模型，而不是先陷入 adapter 細節。

最小可成功的設定有三個部分：

1. 在 bundler config 中註冊 PikaCSS plugin。
2. 在應用程式 entry 匯入 virtual module `pika.css`。
3. 在支援的原始碼檔案中寫一個字面值的 `pika()` 呼叫。

<<< @/zh-TW/.examples/integrations/vite-basic-config.ts

<<< @/zh-TW/.examples/integrations/import-pika-css.ts

## 支援的 build tools

- Vite
- Nuxt
- Rollup
- Webpack
- Rspack
- Rolldown
- esbuild

完整對照表請看 [Integrations Overview](/zh-TW/integrations/overview)。

::: warning 在寫正式 styles 之前先讀這段
`pika()` 的 arguments 必須能被靜態分析。不要因為 API 表面看起來像一般 JavaScript，就假設你可以傳入 runtime values。在把它大規模用進整個 codebase 前，先讀 [靜態限制](/zh-TW/getting-started/static-arguments)。
:::

## 專案不再只是試跑時，就加入 config

PikaCSS 會自動尋找 `pika.config.{js,ts,mjs,mts,cjs,cts}` 與 `pikacss.config.{js,ts,mjs,mts,cjs,cts}` 兩個檔名家族。Zero-config 適合第一次驗證，但大多數真實專案一旦需要 selectors、shortcuts、variables、plugins 或一致的 layer 控制，就應該儘快補上 config file。

<<< @/zh-TW/.examples/getting-started/pika.config.ts

## 先知道哪些檔案是 generated

integration 可能會產生：

- `pika.gen.ts`，用於 autocomplete 與型別擴充。
- `pika.gen.css`，也就是磁碟上的產生 CSS 輸出檔。
- virtual module `pika.css`，它會在 build-time 解析成產生的 CSS。

預設情況下，`pika.gen.ts` 和 `pika.gen.css` 都會寫到專案根目錄。如果你覆寫了 `tsCodegen` 或 `cssCodegen`，就改去檢查那些自訂路徑。

在編輯任何看起來像是自動建立的內容之前，先讀 [Generated Files](/zh-TW/guide/generated-files)。

## 把 ESLint 當成設定的一部分，不是清理工作

如果從第一天開始就讓不合法的 `pika()` 用法在編輯器與 CI 被擋下來，PikaCSS 會容易採用很多。

不要等到團隊已經把錯誤模式複製到十幾個檔案後，才把 ESLint integration 補上。

完成第一次成功設定後，立刻接著看 [ESLint](/zh-TW/integrations/eslint)。

## 第一次執行的檢查清單

- 確認 bundler plugin 已經註冊。
- 確認 app entry 已經匯入 `pika.css`。
- 確認至少有一個字面值 `pika()` 呼叫真的產生了 class names 與 generated CSS。
- 確認你知道哪些檔案是 generated files，不應直接修改。
- 確認你知道這個專案裡 `pika.gen.ts` 和 `pika.gen.css` 應該出現在哪裡。
- 確認團隊在大規模採用前已讀過 [靜態限制](/zh-TW/getting-started/static-arguments)。
- **現在就安裝 [ESLint](/zh-TW/integrations/eslint)。** 不要等到不合法的 `pika()` 用法已經擴散到整個 codebase 才處理。

## Next

- [第一個 Pika](/zh-TW/getting-started/first-pika)
- [產生檔案](/zh-TW/guide/generated-files)
- [ESLint](/zh-TW/integrations/eslint)
- [Vite](/zh-TW/integrations/vite)

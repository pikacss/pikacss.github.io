---
description: 在 Nuxt app 中加入 PikaCSS，同時維持和較低層 integration 相同的靜態 build-time 工作流。
---

# Nuxt

Nuxt 會用 module 包住 Vite adapter，但不會改變 PikaCSS 的基本原則。樣式撰寫規則都一樣：保持 `pika()` 靜態、載入產生的 CSS entry，並把共享的樣式規則移進 engine config。

這一頁是給已經確定要用 Nuxt 的團隊。如果你還在建立 engine model，先讀 Vite 頁面，再回來看這裡的 Nuxt 專屬設定。

## Install

::: code-group
<<< @/zh-TW/.examples/integrations/install-nuxt.sh [pnpm]
<<< @/zh-TW/.examples/integrations/install-nuxt-npm.sh [npm]
<<< @/zh-TW/.examples/integrations/install-nuxt-yarn.sh [yarn]
:::

## 最小設定

<<< @/zh-TW/.examples/integrations/nuxt.config.ts

這個 module 會幫你接好 Vite plugin，並把 `pika.css` 載入到 app 中。這讓 Nuxt 的設定保持精簡，但 generated files 與靜態限制的行為仍然完全一樣。

## 什麼時候要自訂 scanning

Nuxt 的預設值只是起點，不代表所有專案結構都一定會自動被找到。

<<< @/zh-TW/.examples/integrations/nuxt.config.scan-all.ts

只有當你的原始碼樹真的有這個需要時，再去自訂 scanning，例如共用 UI 套件、特殊的 app 目錄，或額外的檔案類型。

## 通常哪裡會出錯

- 樣式寫在設定的 scan globs 之外的檔案裡
- runtime values 被直接塞進 `pika()`
- 你預期 generated files 在別的位置，但 module 寫到別處
- 專案層級的慣例還留在 `nuxt.config.ts`，沒有搬進 `pika.config.ts`

## 一條穩健的 Nuxt 工作流

1. 註冊 Nuxt module，先確認 app 能正常啟動。
2. 驗證至少有一個簡單的字面值 `pika()` 呼叫能如預期被轉換。
3. 在假設問題是 Nuxt 專屬之前，先去檢查 generated files。
4. 只有在這之後，才去放寬 scanning 或加入共享的 engine config。

## Next

- [靜態限制](/zh-TW/getting-started/static-arguments)
- [Integrations 總覽](/zh-TW/integrations/overview)
- [Generated Files](/zh-TW/guide/generated-files)
- [Common Problems](/zh-TW/troubleshooting/common-problems)

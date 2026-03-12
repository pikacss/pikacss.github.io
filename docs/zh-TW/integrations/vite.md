---
description: 在 Vite 中設定 PikaCSS，並把這套流程當成所有其他 integration 的基準心智模型。
---

# Vite

Vite 是學習 PikaCSS 最清楚的起點。adapter surface 很小、回饋迴圈很快，而且在開發時也很容易直接檢查 generated files。

即使你最後使用的是其他 bundler，Vite 這條路徑教你的，仍然是之後所有地方都會用到的同一套 build-time model。

## Install

::: code-group
<<< @/zh-TW/.examples/integrations/vite-install.sh [pnpm]
<<< @/zh-TW/.examples/integrations/vite-install-npm.sh [npm]
<<< @/zh-TW/.examples/integrations/vite-install-yarn.sh [yarn]
:::

## 最小設定

<<< @/zh-TW/.examples/integrations/vite-basic-config.ts

<<< @/zh-TW/.examples/integrations/import-pika-css.ts

這就是整個基線設定：註冊 plugin、匯入 virtual CSS module，並把 `pika()` 的使用維持在會被掃描到的原始碼檔案裡。

## Inline config 與 config file

Inline config 適合拿來做 sandbox、重現問題，或單檔 demo。

<<< @/zh-TW/.examples/integrations/vite-inline-config.ts

真正的專案應該把 engine config 移到 `pika.config.ts`。這樣 selectors、variables、shortcuts 與 plugins 才會集中在同一個地方，而不是藏在 bundler config 裡。

## 實用 options

<<< @/zh-TW/.examples/integrations/vite-all-options.ts

大多數團隊只需要其中幾個。先從預設值開始，只有在專案結構真的需要時，再去自訂 scan patterns、generated file 路徑或 function names。

## 一開始先驗證什麼

1. `pika.css` 有從應用程式 entry 匯入。
2. Vite plugin 只註冊了一次。
3. `pika()` 呼叫仍然足夠靜態，能在 build-time 被抽取。
4. generated files 真的寫到預期的位置。

只要這四個檢查有任一項失敗，就先停在那裡修好。基線還沒通就繼續往上堆更多 config，通常只會讓問題更難看清楚。

## Next

- [First Pika](/zh-TW/getting-started/first-pika)
- [Integrations 總覽](/zh-TW/integrations/overview)
- [靜態限制](/zh-TW/getting-started/static-arguments)
- [Generated Files](/zh-TW/guide/generated-files)

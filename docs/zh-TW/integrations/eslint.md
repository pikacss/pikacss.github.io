---
description: 使用 ESLint 在無效的 PikaCSS 撰寫模式擴散到程式碼庫之前，先強制靜態限制。
---

# ESLint

ESLint integration 的目的，是在最便宜的階段攔下無效的 `pika()` 用法：在 editor 裡、在 code review 時，以及在 CI 裡，避免 build output 開始變得難以理解。

請把 linting 當成 onboarding，而不是事後清理。PikaCSS 有一條團隊必須盡早學會的邊界，而那條邊界就是靜態輸入。

## Install

::: code-group
<<< @/zh-TW/.examples/integrations/eslint-install.sh [pnpm]
<<< @/zh-TW/.examples/integrations/eslint-install-npm.sh [npm]
<<< @/zh-TW/.examples/integrations/eslint-install-yarn.sh [yarn]
:::

## 推薦設定

<<< @/zh-TW/.examples/integrations/eslint-recommended-config.mjs

在 PikaCSS 擴散到很多 component 之前，就先加上這條 rule。維持正確習慣，通常遠比之後再拆掉動態樣式模式容易得多。

## 這會保護你避開什麼

這條 rule 主要是在阻止 runtime CSS-in-JS 的習慣滲進 build-time engine。

通常包含變數參照、computed keys、條件式物件值，以及其他只有在 app 跑起來之後才知道的輸入形狀。

## 合法用法長什麼樣子

<<< @/zh-TW/.examples/integrations/eslint-valid-example.pikainput.ts

## 非法用法長什麼樣子

<<< @/zh-TW/.examples/integrations/eslint-invalid-example.pikainput.ts

## 為什麼值得強制執行

如果沒有 linting，無效的樣式輸入看起來常常像是 transform 消失、scan path 壞掉，或 generated CSS 有 bug。有了 linting，真正的問題會立刻被命名，而且離來源很近。

::: tip 團隊建議
在本機開發與 CI 都啟用這條 rule。成本很低，而且能讓整個團隊對同一套 authoring model 維持一致。
:::

## Next

- [Installation](/zh-TW/getting-started/installation)
- [靜態限制](/zh-TW/getting-started/static-arguments)
- [Generated Files](/zh-TW/guide/generated-files)
- [Configuration](/zh-TW/guide/configuration)

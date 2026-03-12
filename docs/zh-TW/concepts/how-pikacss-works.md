---
description: 從靜態原始碼輸入一路看到抽出的 class names 與 generated CSS，讓 build-time engine 更容易被正確理解。
---

# PikaCSS 如何運作

從高層來看，PikaCSS 會把可靜態分析的 style 輸入轉成 generated atomic CSS。

重點不只是最後有 CSS 被產生，而是 engine 在應用程式執行前，就已經理解 styling 輸入。

## 1. 原始碼提供靜態 style 輸入

你會在支援的檔案中寫 `pika()` 呼叫：

<<< @/zh-TW/.examples/principles/build-source.ts

只有當這些輸入能從原始碼直接讀懂時，engine 才會成功。它不是在讀取 live runtime state。

## 2. integration 會抽取並改寫呼叫

integration 會掃描原始碼檔案、抽出 style 輸入，再把它轉成 atomic class names。

<<< @/zh-TW/.examples/principles/build-compiled.ts

這也是為什麼文件會一直強調靜態限制。抽取本身就是整個模型的核心。

## 3. build 會輸出 generated CSS

這些 class names 會對應到產生的 CSS declarations：

<<< @/zh-TW/.examples/principles/build-generated.css

## 4. 當重用安全時，atomic 輸出會被重用

PikaCSS 不會為每個 component block 只產生一個 class。它會把 style 內容拆成可重用的 atomic declarations。當同一個 declaration 再次出現時，engine 可以重用同一個 atomic class。

<<< @/zh-TW/.examples/principles/build-dedup-source.ts

<<< @/zh-TW/.examples/principles/build-dedup-output.css

## 5. 重疊效果會改變是否能重用的判斷

重用並不總是安全。

當兩個 declarations 在效果上彼此重疊時，真正決定結果的是 stylesheet 順序，而不是 markup 裡 token 的順序。PikaCSS 會偵測這些衝突，讓後續重疊的 declarations 保持對順序敏感，而不是盲目重用全域快取的 atomic class。

完整說明請讀 [Atomic Order And Cascade](/zh-TW/concepts/atomic-order-and-cascade)。

## 6. plugins 會擴充 engine 能理解的內容

Plugins 可以修改 config，也能擴充 selectors、shortcuts、variables、keyframes、autocomplete 與 preflights。它們會在抽取前與抽取過程中，改變 engine 能理解的內容。

也因為如此，PikaCSS 才能對採用者維持相對精簡，同時支援更完整的 ecosystem。

## 哪些東西永遠不會進到瀏覽器

應用程式 runtime 拿到的是 class names 與 CSS files，而不是一個會在瀏覽器中持續解讀 style objects 的 styling engine。

這正是靜態邊界帶來的回報：因為 engine 已經先做完工作，runtime 才能保持簡單。

## Next

- [Atomic 順序與 Cascade](/zh-TW/concepts/atomic-order-and-cascade)
- [Build-time Engine](/zh-TW/concepts/build-time-engine)
- [Generated Files](/zh-TW/guide/generated-files)
- [Plugin System Overview](/zh-TW/plugin-system/overview)

// ✅ 正確 — 在 pika() 中使用已登記的 selector 名稱作為 key
pika({ hover: { color: 'blue' } })

// ❌ 錯誤 — '&:hover' 會產生 CSS nesting rule，而非 flat atomic rules
pika({ '&:hover': { color: 'blue' } })

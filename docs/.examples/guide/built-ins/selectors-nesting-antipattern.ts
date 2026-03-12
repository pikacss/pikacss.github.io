// ✅ correct — use the registered selector name as a key in pika()
pika({ hover: { color: 'blue' } })

// ❌ wrong — '&:hover' produces a CSS nesting rule, not flat atomic rules
pika({ '&:hover': { color: 'blue' } })

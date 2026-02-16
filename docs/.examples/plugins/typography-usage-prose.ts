// pika() is available as a global function — no import needed

// Apply all typography styles at once
const article = pika('prose')

// Apply a specific size variant
const smallArticle = pika('prose-sm')
const largeArticle = pika('prose-lg')

// Combine with custom styles
const styledArticle = pika('prose', { maxWidth: '80ch' })

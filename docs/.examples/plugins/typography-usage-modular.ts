// pika() is available as a global function — no import needed

// Apply only specific typography aspects
const headingsOnly = pika('prose-headings')
const linksOnly = pika('prose-links')
const codeOnly = pika('prose-code')
const tablesOnly = pika('prose-tables')

// Combine multiple modular shortcuts
const partial = pika('prose-headings', 'prose-paragraphs', 'prose-links')

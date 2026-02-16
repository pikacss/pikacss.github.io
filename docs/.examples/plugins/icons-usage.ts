// pika() is available as a global function — no import needed

// Basic icon usage: prefix + collection:name
pika('i-mdi:home')
pika('i-mdi:account')
pika('i-lucide:settings')

// Force mask mode (icon inherits text color via currentColor)
pika('i-mdi:home?mask')

// Force background mode (icon keeps original colors)
pika('i-mdi:home?bg')

// Auto mode (default): uses mask if SVG contains currentColor, otherwise bg
pika('i-mdi:home?auto')

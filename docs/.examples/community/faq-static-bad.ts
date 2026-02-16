// pika() is available as a global function — no import needed

// ❌ Runtime variable — cannot be evaluated at build time
const userColor = getUserPreference()
const btn = pika({
	backgroundColor: userColor, // Error: userColor is not statically analyzable
})

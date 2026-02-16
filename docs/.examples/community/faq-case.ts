// pika() is available as a global function — no import needed

// Both camelCase and kebab-case are supported
const a = pika({ backgroundColor: 'red' })
const b = pika({ 'background-color': 'red' })
// `a` and `b` produce the same atomic class

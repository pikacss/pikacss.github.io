// pika() - Default output format (configured by integration, usually string)
const classes = pika({ color: 'red', fontSize: '1rem' })
// => "a b" (string of space-separated class names)

// pika.str() - Force string output
const str = pika.str({ color: 'red', fontSize: '1rem' })
// => "a b"

// pika.arr() - Force array output
const arr = pika.arr({ color: 'red', fontSize: '1rem' })
// => ["a", "b"]

// pika.inl() - Force inline style output (for SSR or special cases)
pika.inl({ color: 'red', fontSize: '1rem' })
// Applies styles inline, no return value

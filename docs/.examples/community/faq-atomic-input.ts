// pika() is available as a global function — no import needed

const btn = pika({
	color: 'white',
	backgroundColor: 'blue',
})

const link = pika({
	color: 'white',
	textDecoration: 'underline',
})

// Both `btn` and `link` share the same atomic class for `color: white`

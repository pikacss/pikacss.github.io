// ✅ Valid: all arguments are static and analyzable at build time

// Object literal with static values
pika({ color: 'red', fontSize: '16px' })

// Multiple arguments
pika({ color: 'red' }, { fontSize: '16px' })

// Nested selectors with static values
pika({
	'color': 'black',
	'&:hover': { color: 'blue' },
})

// Static string values
pika({ padding: '1rem', margin: '0 auto' })

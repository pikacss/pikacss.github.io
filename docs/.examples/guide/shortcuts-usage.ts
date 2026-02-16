// Method 1: Use shortcut as a string style item inside __shortcut
const className = pika({
	__shortcut: 'flex-center',
	gap: '1rem',
})

// Method 2: Apply multiple shortcuts at once
const multi = pika({
	__shortcut: ['flex-center', 'btn-base'],
	backgroundColor: '#0ea5e9',
})

// Method 3: Dynamic shortcuts resolve from the pattern
const spacing = pika({
	__shortcut: 'm-4',
})

// Use __shortcut property in a style definition
// Shortcut styles are inserted BEFORE other properties in the definition

// Single shortcut via __shortcut
const centered = pika({
	__shortcut: 'flex-center',
	gap: '1rem',
})

// Multiple shortcuts via __shortcut array
const button = pika({
	__shortcut: ['flex-center', 'btn'],
	backgroundColor: '#0ea5e9',
	color: 'white',
})

// Dynamic shortcut via __shortcut
const spacing = pika({
	__shortcut: 'm-4',
})

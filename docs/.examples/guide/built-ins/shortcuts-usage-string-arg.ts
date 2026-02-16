// Use a shortcut as a string argument to pika()
// Shortcuts resolve to their underlying style items at build time

// Single shortcut
const centered = pika('flex-center')

// Shortcut mixed with inline style definitions
const card = pika(
	'flex-center',
	{ gap: '1rem', padding: '2rem' },
)

// Dynamic shortcut as string argument
const spaced = pika('m-4', { color: 'blue' })

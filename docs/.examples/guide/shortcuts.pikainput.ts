export const shortcutUsage = ['card', 'stack-gap-16'] as const

const className = pika({
	__shortcut: 'cluster',
	justifyContent: 'space-between',
})

const multi = pika({
	__shortcut: ['cluster', 'button-base'],
	backgroundColor: 'var(--accent-color)',
})

const spacing = pika({
	__shortcut: ['stack-16', 'radius-12'],
})

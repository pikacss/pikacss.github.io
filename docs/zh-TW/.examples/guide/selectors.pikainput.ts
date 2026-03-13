export const selectorUsage = ['hover', { color: 'var(--docs-accent)' }] as const

const className = pika({
	color: 'var(--surface-fg)',
	hover: {
		color: 'blue',
	},
	'theme-dark': {
		color: 'white',
	},
	'screen-md': {
		fontSize: '1.25rem',
	},
})

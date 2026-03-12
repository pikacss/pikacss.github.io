import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	prefix: 'pk-',
	selectors: {
		selectors: [
			['hover', '$:hover'],
			['dark', '[data-theme="dark"] $'],
			[/^screen-(\d+)$/, m => `@media (min-width: ${m[1]}px)`, ['screen-768', 'screen-1024']],
		],
	},
	shortcuts: {
		shortcuts: [
			['surface-card', {
				padding: '1rem',
				borderRadius: '0.75rem',
				backgroundColor: 'var(--surface-card)',
				boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
			}],
			['stack-sm', {
				display: 'grid',
				gap: '0.5rem',
			}],
		],
	},
	variables: {
		variables: {
			'--surface-card': '#ffffff',
			'--accent-500': '#0ea5e9',
			'[data-theme="dark"]': {
				'--surface-card': '#111827',
			},
		},
	},
})

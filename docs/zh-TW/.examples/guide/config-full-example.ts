import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'
import { reset } from '@pikacss/plugin-reset'
import { typography } from '@pikacss/plugin-typography'

export default defineEngineConfig({
	plugins: [
		reset(),
		icons(),
		typography(),
	],

	prefix: 'pk-',
	defaultSelector: '.%',

	autocomplete: {
		shortcuts: ['surface-card', 'stack-md'],
		properties: {
			intent: ['"neutral"', '"accent"'],
		},
		patterns: {
			selectors: ['screen-${number}'],
			shortcuts: ['icon-${string}'],
		},
	},

	cssImports: [
		'@import url("https://cdn.example.com/brand-tokens.css");',
	],

	preflights: [
		'*, *::before, *::after { box-sizing: border-box; }',
		'html, body { margin: 0; }',
	],

	important: {
		default: false,
	},

	variables: {
		variables: {
			'--surface-bg': '#ffffff',
			'--surface-fg': '#0f172a',
			'[data-theme="dark"]': {
				'--surface-bg': '#020617',
				'--surface-fg': '#e2e8f0',
			},
		},
		pruneUnused: true,
		safeList: ['--surface-bg', '--surface-fg'],
	},

	keyframes: {
		keyframes: [
			['enter-fade', {
				from: { opacity: '0' },
				to: { opacity: '1' },
			}, ['enter-fade 180ms ease-out']],
		],
		pruneUnused: true,
	},

	selectors: {
		selectors: [
			['hover', '$:hover'],
			['focus-visible', '$:focus-visible'],
			['theme-dark', '[data-theme="dark"] $'],
		],
	},

	shortcuts: {
		shortcuts: [
			['surface-card', {
				padding: '1rem',
				borderRadius: 'var(--radius-card)',
				backgroundColor: 'var(--surface-bg)',
				color: 'var(--surface-fg)',
			}],
		],
	},
})

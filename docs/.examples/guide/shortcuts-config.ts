// pika.config.ts
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	shortcuts: {
		shortcuts: [
			// Static shortcut: [name, styleDefinition]
			['flex-center', {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}],

			// Static shortcut with multiple style items
			['btn-base', [
				{ padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' },
				{ border: 'none', fontSize: '1rem' },
			]],

			// Dynamic shortcut: [pattern, resolver, autocomplete?]
			[
				/^m-(\d+)$/,
				m => ({ margin: `${Number(m[1]) * 0.25}rem` }),
				['m-1', 'm-2', 'm-4', 'm-8'], // autocomplete hints
			],

			// Dynamic shortcut returning multiple style items
			[
				/^size-(\d+)$/,
				m => ({ width: `${m[1]}px`, height: `${m[1]}px` }),
				['size-16', 'size-24', 'size-32'],
			],
		],
	},
})

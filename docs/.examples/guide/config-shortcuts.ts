import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	shortcuts: {
		shortcuts: [
			// 1. Static shortcut: [name, styleDefinition]
			['flex-center', {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}],

			// 2. Static shortcut with multiple values (array)
			['btn-base', [
				{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
				{ padding: '8px 16px', borderRadius: '4px' },
			]],

			// 3. Dynamic shortcut: [pattern, handler, autocomplete?]
			[/^m-(\d+)$/, m => ({ margin: `${m[1]}px` }), [
				'm-0',
				'm-4',
				'm-8',
				'm-16',
			]],

			// 4. Object form (static)
			{
				shortcut: 'sr-only',
				value: {
					position: 'absolute',
					width: '1px',
					height: '1px',
					overflow: 'hidden',
					clip: 'rect(0, 0, 0, 0)',
					whiteSpace: 'nowrap',
					borderWidth: '0',
				},
			},

			// 5. Object form (dynamic)
			{
				shortcut: /^p-(\d+)$/,
				value: m => ({ padding: `${m[1]}px` }),
				autocomplete: ['p-0', 'p-4', 'p-8', 'p-16'],
			},
		],
	},
})

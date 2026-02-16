// pika.config.ts
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	shortcuts: {
		shortcuts: [
			// String form: autocomplete-only
			'my-custom-shortcut',

			// Tuple form — static
			['flex-center', {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}],

			// Tuple form — static with multiple style items
			['btn', [
				{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
				{ padding: '0.5rem 1rem', borderRadius: '0.25rem' },
				{ border: 'none', cursor: 'pointer', fontSize: '1rem' },
			]],

			// Tuple form — dynamic
			[
				/^m-(\d+)$/,
				m => ({ margin: `${Number(m[1]) * 0.25}rem` }),
				['m-1', 'm-2', 'm-4', 'm-8'],
			],

			// Object form — static
			{
				shortcut: 'sr-only',
				value: {
					position: 'absolute',
					width: '1px',
					height: '1px',
					padding: '0',
					margin: '-1px',
					overflow: 'hidden',
					clip: 'rect(0, 0, 0, 0)',
					whiteSpace: 'nowrap',
					borderWidth: '0',
				},
			},

			// Object form — dynamic
			{
				shortcut: /^size-(\d+)$/,
				value: m => ({ width: `${m[1]}px`, height: `${m[1]}px` }),
				autocomplete: ['size-16', 'size-24', 'size-32'],
			},
		],
	},
})

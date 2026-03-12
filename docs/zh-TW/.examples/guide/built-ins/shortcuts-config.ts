import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	shortcuts: {
		shortcuts: [
			'my-custom-shortcut',
			['flex-center', {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}],
			['btn', [
				{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
				{ padding: '0.5rem 1rem', borderRadius: '0.25rem' },
				{ border: 'none', cursor: 'pointer', fontSize: '1rem' },
			]],
			[
				/^m-(\d+)$/,
				m => ({ margin: `${Number(m[1]) * 0.25}rem` }),
				['m-1', 'm-2', 'm-4', 'm-8'],
			],
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
			{
				shortcut: /^size-(\d+)$/,
				value: m => ({ width: `${m[1]}px`, height: `${m[1]}px` }),
				autocomplete: ['size-16', 'size-24', 'size-32'],
			},
		],
	},
})

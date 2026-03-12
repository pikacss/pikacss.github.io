import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	shortcuts: {
		shortcuts: [
			['cluster', {
				display: 'flex',
				alignItems: 'center',
				gap: '0.75rem',
			}],
			['button-base', [
				{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
				{ paddingInline: '1rem', paddingBlock: '0.625rem', borderRadius: '9999px' },
			]],
			[/^stack-(\d+)$/, (match: RegExpMatchArray) => ({ gap: `${match[1]}px` }), [
				'stack-8',
				'stack-12',
				'stack-16',
			]],
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
				shortcut: /^radius-(\d+)$/,
				value: (match: RegExpMatchArray) => ({ borderRadius: `${match[1]}px` }),
				autocomplete: ['radius-8', 'radius-12', 'radius-16'],
			},
		],
	},
})
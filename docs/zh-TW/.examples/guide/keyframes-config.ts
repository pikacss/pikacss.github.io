import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	keyframes: {
		keyframes: [
			'external-spinner',
			['enter-fade', {
				from: { opacity: '0' },
				to: { opacity: '1' },
			}, ['enter-fade 180ms ease-out']],
			{
				name: 'slide-up',
				frames: {
					from: { transform: 'translateY(1rem)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				autocomplete: ['slide-up 240ms ease-out'],
				pruneUnused: false,
			},
			['pulse-ring', {
				'0%': { transform: 'scale(0.95)', opacity: '0.4' },
				'70%': { transform: 'scale(1)', opacity: '1' },
				'100%': { transform: 'scale(0.95)', opacity: '0.4' },
			}],
		],
		pruneUnused: true,
	},
})
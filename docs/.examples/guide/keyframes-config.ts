// pika.config.ts
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	keyframes: {
		keyframes: [
			// Tuple form: [name, frames, autocomplete?, pruneUnused?]
			['fade-in', {
				from: { opacity: '0' },
				to: { opacity: '1' },
			}, ['fade-in 0.3s ease']],

			// Object form
			{
				name: 'slide-up',
				frames: {
					from: { transform: 'translateY(100%)' },
					to: { transform: 'translateY(0)' },
				},
				autocomplete: ['slide-up 0.5s ease-out'],
				pruneUnused: false, // always include in CSS output
			},

			// Percentage-based keyframes
			['bounce', {
				'0%': { transform: 'translateY(0)' },
				'50%': { transform: 'translateY(-20px)' },
				'100%': { transform: 'translateY(0)' },
			}],

			// String-only form: register an external animation name for autocomplete
			'external-animation',
		],
		// Prune keyframes not referenced in atomic styles (default: true)
		pruneUnused: true,
	},
})

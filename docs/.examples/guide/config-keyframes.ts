import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	keyframes: {
		keyframes: [
			// 1. String only — name for autocomplete, no frames defined
			'external-animation',

			// 2. Tuple form: [name, frames?, autocomplete?, pruneUnused?]
			['fade-in', {
				from: { opacity: '0' },
				to: { opacity: '1' },
			}, ['fade-in 0.3s ease']],

			// 3. Object form
			{
				name: 'slide-up',
				frames: {
					from: { transform: 'translateY(100%)' },
					to: { transform: 'translateY(0)' },
				},
				autocomplete: ['slide-up 0.5s ease-out'],
				pruneUnused: false, // Always include in output
			},

			// 4. Percentage-based keyframes
			['bounce', {
				'0%': { transform: 'translateY(0)' },
				'50%': { transform: 'translateY(-20px)' },
				'100%': { transform: 'translateY(0)' },
			}],
		],

		// Whether to prune unused keyframes from the final CSS
		pruneUnused: true,
	},
})

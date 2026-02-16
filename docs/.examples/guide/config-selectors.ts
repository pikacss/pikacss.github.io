import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	selectors: {
		selectors: [
			// 1. Static selector: [name, replacement]
			['hover', '$:hover'],
			['focus', '$:focus'],
			['dark', '[data-theme="dark"] $'],

			// 2. Dynamic selector: [pattern, handler, autocomplete?]
			[/^screen-(\d+)$/, m => `@media (min-width: ${m[1]}px)`, [
				'screen-640',
				'screen-768',
				'screen-1024',
				'screen-1280',
			]],

			// 3. Object form (static)
			{
				selector: 'first-child',
				value: '$:first-child',
			},

			// 4. Object form (dynamic)
			{
				selector: /^aria-(\w+)$/,
				value: m => `$[aria-${m[1]}="true"]`,
				autocomplete: ['aria-expanded', 'aria-selected', 'aria-disabled'],
			},
		],
	},
})

// pika.config.ts
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	// CSS variables with autocomplete support
	variables: {
		variables: {
			'--color-primary': '#ff007f',
			'--color-bg': '#ffffff',
		},
	},
	// Custom selectors for cleaner style definitions
	selectors: {
		selectors: [
			[':hover', '$:hover'],
			['@dark', 'html.dark $'],
			['@screen-md', '@media screen and (min-width: 768px)'],
		],
	},
	// Reusable style shortcuts
	shortcuts: {
		shortcuts: [
			['flex-center', {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}],
		],
	},
})

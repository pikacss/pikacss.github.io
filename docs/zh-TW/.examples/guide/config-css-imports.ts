import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	cssImports: [
		'@import url("https://cdn.example.com/brand-tokens.css");',
		'@import url("https://cdn.example.com/marketing-fonts.css");',
	],
	preflights: [
		':root { color-scheme: light dark; }',
	],
})

import { defineSelector } from '@pikacss/core'

// Dynamic tuple: [pattern, resolver, autocomplete?]
// The resolver function receives the RegExp match array
const screen = defineSelector([
	/^screen-(\d+)$/,
	m => `@media (min-width: ${m[1]}px)`,
	['screen-640', 'screen-768', 'screen-1024'], // autocomplete hints
])

import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	// No prefix (default): generated IDs are "a", "b", "c", ...
	prefix: '',
})

export const withPrefix = defineEngineConfig({
	// With prefix: generated IDs are "pika-a", "pika-b", "pika-c", ...
	prefix: 'pika-',
})

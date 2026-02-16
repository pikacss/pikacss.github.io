// pika.config.ts
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	// Prefix for generated class names (default: '')
	prefix: '',

	// Selector pattern, '%' is replaced with the class ID (default: '.%')
	defaultSelector: '.%',

	// Plugins to extend functionality
	plugins: [],

	// Global CSS injected before atomic styles
	preflights: [],
})

import { defineEngineConfig } from '@pikacss/core'

// Default: use CSS class selector
export const classSelector = defineEngineConfig({
	defaultSelector: '.%', // <div class="a b c">
})

// Use attribute selector instead
export const attrSelector = defineEngineConfig({
	defaultSelector: '[data-pika~="%"]', // <div data-pika="a b c">
})

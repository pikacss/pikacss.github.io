import { defineSelector } from '@pikacss/core'

// defineSelector() provides type safety and autocomplete
// for all selector definition formats
const hover = defineSelector(['hover', '$:hover'])
const dark = defineSelector({
	selector: 'dark',
	value: '[data-theme="dark"] $',
})

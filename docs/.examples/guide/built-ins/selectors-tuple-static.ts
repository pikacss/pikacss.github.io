import { defineSelector } from '@pikacss/core'

// Static tuple: [name, replacement]
// Use $ as a placeholder for the element's default selector
const hover = defineSelector(['hover', '$:hover'])
const focus = defineSelector(['focus', '$:focus'])
const firstChild = defineSelector(['first-child', '$:first-child'])

// Ancestor / wrapper selectors
const dark = defineSelector(['dark', '[data-theme="dark"] $'])

// At-rules — do NOT include $ inside at-rules
const md = defineSelector(['md', '@media (min-width: 768px)'])
const lg = defineSelector(['lg', '@media (min-width: 1024px)'])

// Multiple values (array form)
const hoverOrFocus = defineSelector(['hover-or-focus', ['$:hover', '$:focus']])

import { defineSelector } from '@pikacss/core'

const hover = defineSelector(['hover', '$:hover'])
const focus = defineSelector(['focus', '$:focus'])
const firstChild = defineSelector(['first-child', '$:first-child'])

const dark = defineSelector(['dark', '[data-theme="dark"] $'])

const md = defineSelector(['md', '@media (min-width: 768px)'])
const lg = defineSelector(['lg', '@media (min-width: 1024px)'])

const hoverOrFocus = defineSelector(['hover-or-focus', ['$:hover', '$:focus']])

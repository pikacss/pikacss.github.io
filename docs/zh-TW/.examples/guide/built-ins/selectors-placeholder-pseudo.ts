import { defineSelector } from '@pikacss/core'

const hover = defineSelector(['hover', '$:hover'])

const before = defineSelector(['before', '$::before'])

const dark = defineSelector(['dark', '[data-theme="dark"] $'])

const md = defineSelector(['md', '@media (min-width: 768px)'])

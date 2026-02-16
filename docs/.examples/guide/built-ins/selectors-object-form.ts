import { defineSelector } from '@pikacss/core'

// Object form — static
const hover = defineSelector({
	selector: 'hover',
	value: '$:hover',
})

// Object form — dynamic (with autocomplete)
const breakpoint = defineSelector({
	selector: /^bp-(\d+)$/,
	value: (m: RegExpMatchArray) => `@media (min-width: ${m[1]}px)`,
	autocomplete: ['bp-640', 'bp-768', 'bp-1024'],
})

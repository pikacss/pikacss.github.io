import { defineStyleDefinition } from '@pikacss/core'

const badgeBase = defineStyleDefinition({
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.375rem',
	paddingInline: '0.75rem',
	paddingBlock: '0.25rem',
	borderRadius: '9999px',
})

const className = pika(badgeBase)

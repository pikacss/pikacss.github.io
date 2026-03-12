import { defineStyleDefinition } from '@pikacss/core'

const quietRule = pika({
	__important: false,
	color: 'var(--text-muted)',
	fontSize: '0.875rem',
})

const forcedRule = defineStyleDefinition({
	__important: true,
	color: 'var(--accent-color)',
	fontWeight: '700',
})

const variantMap = {
	primary: 'pk-btn pk-btn-primary',
	secondary: 'pk-btn pk-btn-secondary',
} as const

export const validExample = variantMap.primary

pika({ color: 'tomato' })

pika({ color: 'white' }, { backgroundColor: 'black' })

pika({
	paddingInline: '1rem',
	hover: {
		opacity: '0.9',
	},
})

pika.str({ fontSize: 14, zIndex: 2 })

pika.arr({ __shortcut: 'button-base' })

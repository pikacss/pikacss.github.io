export const selectorsUsage = ['hover', 'screen-768'] as const

const className = pika({
	color: 'black',
	hover: {
		color: 'blue',
	},
	dark: {
		color: 'white',
	},
	md: {
		fontSize: '1.25rem',
	},
})

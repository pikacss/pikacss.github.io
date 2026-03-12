const buttonClass = pika({
	padding: '0.75rem 1rem',
	borderRadius: '0.75rem',
	backgroundColor: '#0f172a',
	color: 'white',
	border: 'none',
	cursor: 'pointer',
	fontWeight: '600',
})

document.querySelector('#save-button')?.setAttribute('class', buttonClass)

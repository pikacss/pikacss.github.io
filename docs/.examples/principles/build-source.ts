// pika() is available as a global function — no import needed

// A button component using pika() for styling
const buttonClass = pika({
	padding: '0.5rem 1rem',
	borderRadius: '0.5rem',
	backgroundColor: '#0ea5e9',
	color: 'white',
	cursor: 'pointer',
})

document.querySelector('#btn')!.className = buttonClass

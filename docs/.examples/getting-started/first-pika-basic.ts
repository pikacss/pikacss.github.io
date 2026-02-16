// In vanilla JS/TS, pika() is a global function
// available after setting up the build plugin.

const className = pika({
	padding: '0.5rem 1rem',
	borderRadius: '0.5rem',
	backgroundColor: '#0ea5e9',
	color: 'white',
	border: 'none',
	cursor: 'pointer',
	fontSize: '1rem',
})

// Use the returned class name(s) on any DOM element
document.querySelector('#my-button')!.className = className

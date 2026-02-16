// Source code — buttonStyles is used, but unusedStyles is never referenced

const buttonStyles = pika({
	color: 'white',
	backgroundColor: '#0ea5e9',
})

// This variable is never used anywhere
const unusedStyles = pika({
	padding: '2rem',
	margin: '1rem',
})

document.querySelector('#btn')!.className = buttonStyles
// unusedStyles is never referenced — tree-shaking removes it

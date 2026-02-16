// Source code — uses pika() to define styles
// pika() is available as a global function — no import needed

const cardClass = pika({
	padding: '1.5rem',
	borderRadius: '0.75rem',
	boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
})

const titleClass = pika({
	fontSize: '1.25rem',
	fontWeight: '700',
	color: '#1a1a1a',
})

export function createCard(title: string, content: string) {
	return `
    <div class="${cardClass}">
      <h2 class="${titleClass}">${title}</h2>
      <p>${content}</p>
    </div>
  `
}

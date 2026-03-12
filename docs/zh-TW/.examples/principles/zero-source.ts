const cardClass = pika({
	padding: '1.5rem',
	borderRadius: '1rem',
	boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
})

const titleClass = pika({
	fontSize: '1.25rem',
	fontWeight: '700',
	color: '#0f172a',
})

export function createCard(title: string, content: string) {
	return `
    <div class="${cardClass}">
      <h2 class="${titleClass}">${title}</h2>
      <p>${content}</p>
    </div>
  `
}

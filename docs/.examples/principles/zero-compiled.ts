// After compilation — no pika import, no function calls
// Only plain string literals remain

const cardClass = 'a b c'

const titleClass = 'd e f'

export function createCard(title: string, content: string) {
	return `
    <div class="${cardClass}">
      <h2 class="${titleClass}">${title}</h2>
      <p>${content}</p>
    </div>
  `
}

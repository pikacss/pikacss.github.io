const cardClass = 'pk-a pk-b pk-c'

const titleClass = 'pk-d pk-e pk-f'

export function createCard(title: string, content: string) {
	return `
    <div class="${cardClass}">
      <h2 class="${titleClass}">${title}</h2>
      <p>${content}</p>
    </div>
  `
}

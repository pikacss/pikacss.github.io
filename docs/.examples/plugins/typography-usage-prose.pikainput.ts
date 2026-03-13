export const articleClass = 'prose prose-lg'

// pika() is available as a global function - no import needed

const article = pika('prose')

const smallArticle = pika('prose-sm')
const largeArticle = pika('prose-lg')

const styledArticle = pika('prose', { maxWidth: '80ch' })

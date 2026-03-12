const tone = Math.random() > 0.5 ? 'teal' : 'slate'

export const invalidExample = `bg-${tone}-600`

const accent = 'tomato'
pika({ color: accent })

const baseCard = { padding: '1rem' }
pika(baseCard)

pika({ color: getAccentColor() })

const gap = 8
pika({ gap: `${gap}px` })

const isActive = Math.random() > 0.5
pika({ color: isActive ? 'white' : 'black' })

const key = 'backgroundColor'
pika({ [key]: 'navy' })

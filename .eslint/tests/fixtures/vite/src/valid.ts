// pika is a global function injected by @pikacss/vite-plugin-pikacss

// Static literal
export const styles1 = pika({ color: 'red', fontSize: '16px' })

// Const reference
const COLOR = 'blue'
export const styles2 = pika({ color: COLOR })

// Template literal (static)
const SIZE = '20px'
export const styles3 = pika({ fontSize: `${SIZE}` })

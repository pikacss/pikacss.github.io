// ❌ Invalid: Variable reference
const color = 'red'
pika({ color: color })

// ❌ Invalid: Variable as argument
const styles = { color: 'red' }
pika(styles)

// ❌ Invalid: Function call in value
pika({ color: getColor() })

// ❌ Invalid: Template literal with expression
const size = 16
pika({ fontSize: `${size}px` })

// ❌ Invalid: Spread of variable
const base = { color: 'red' }
pika({ ...base })

// ❌ Invalid: Conditional expression
const isDark = true
pika({ color: isDark ? 'white' : 'black' })

// ❌ Invalid: Binary expression
const x = 10
pika({ width: x + 'px' })

// ❌ Invalid: Member expression
const theme = { color: 'red' }
pika({ color: theme.color })

// ❌ Invalid: Dynamic computed key
const key = 'color'
pika({ [key]: 'red' })

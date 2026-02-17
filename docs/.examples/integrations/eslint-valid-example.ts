// ✅ Valid: Static literal arguments
pika({ color: 'red' })

// ✅ Valid: Multiple static arguments
pika({ color: 'red' }, { fontSize: '16px' })

// ✅ Valid: Nested static objects (pseudo-classes, media queries)
pika({ color: 'black', '&:hover': { color: 'blue' } })

// ✅ Valid: Number values
pika({ fontSize: 16, zIndex: -1 })

// ✅ Valid: Template literal without expressions
pika({ color: `red` })

// ✅ Valid: Spread of static object literal
pika({ ...{ color: 'red' } })

// ✅ Valid: Using variants
pika.str({ color: 'red' })
pika.arr({ display: 'flex' })
pikap({ margin: '10px' })

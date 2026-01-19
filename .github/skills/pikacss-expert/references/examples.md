# Code Examples Summary

For comprehensive, real-world code examples, see:

- **Component Examples**: `/docs/examples/components.md`
- **Guide Tutorials**: `/docs/guide/`
- **Advanced Patterns**: `/docs/advanced/`

## Quick Pattern Reference

### Basic Component

```tsx
function Button({ children }) {
  return (
    <button className={pika({
      padding: '0.5rem 1rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      '$:hover': { backgroundColor: '#2563eb' },
    })}>
      {children}
    </button>
  )
}
```

### Using Shortcuts

```tsx
// pika.config.ts
shortcuts: [
  ['btn', { padding: '0.5rem 1rem', borderRadius: '4px' }],
  ['btn-primary', { __shortcut: 'btn', backgroundColor: '#3b82f6', color: 'white' }],
]

// Component
<button className={pika('btn-primary')}>Click</button>
```

### Responsive Design

```tsx
<div className={pika({
  padding: '1rem',
  '@media (min-width: 768px)': {
    padding: '2rem',
  },
})}>
  Content
</div>
```

### Dynamic Values

```tsx
// ✅ Use CSS variables
const styles = pika({ color: 'var(--dynamic-color)' })

function Component({ color }) {
  return <div className={styles} style={{ '--dynamic-color': color }} />
}
```

### Conditional Styling

```tsx
const btnPrimary = pika('btn-primary')
const btnSecondary = pika('btn-secondary')

function Button({ variant }) {
  return <button className={variant === 'primary' ? btnPrimary : btnSecondary} />
}
```

## Common Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| Shortcuts | Reusable styles | `pika('btn')` |
| CSS Variables | Dynamic values | `pika({ color: 'var(--color)' })` |
| Selectors | Pseudo-classes | `'$:hover': { ... }` |
| Media Queries | Responsive | `'@media (...)': { ... }` |

## Learn More

- **Component Examples**: Full React, Vue, and Svelte components at `/docs/examples/components.md`
- **Troubleshooting**: Common issues and solutions at `/docs/advanced/troubleshooting.md`
- **Best Practices**: Performance optimization at `/docs/advanced/performance.md`


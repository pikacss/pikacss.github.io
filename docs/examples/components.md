---
title: Real-World Examples
description: Practical component examples using PikaCSS
outline: deep
---

# Real-World Examples

This section provides complete, production-ready examples of common UI components built with PikaCSS.

## Component Library Examples

### Button Component

```typescript
// pika.config.ts
export default defineEngineConfig({
  shortcuts: {
    shortcuts: [
      // Base button styles
      ['btn-base', {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '$:disabled': {
          opacity: '0.5',
          cursor: 'not-allowed'
        }
      }],
      
      // Variants
      ['btn-primary', {
        __shortcut: 'btn-base',
        backgroundColor: '#3b82f6',
        color: 'white',
        '$:hover:not(:disabled)': {
          backgroundColor: '#2563eb'
        },
        '$:active:not(:disabled)': {
          backgroundColor: '#1d4ed8'
        }
      }],
      
      ['btn-secondary', {
        __shortcut: 'btn-base',
        backgroundColor: '#6b7280',
        color: 'white',
        '$:hover:not(:disabled)': {
          backgroundColor: '#4b5563'
        }
      }],
      
      ['btn-outline', {
        __shortcut: 'btn-base',
        backgroundColor: 'transparent',
        border: '1px solid #3b82f6',
        color: '#3b82f6',
        '$:hover:not(:disabled)': {
          backgroundColor: '#3b82f6',
          color: 'white'
        }
      }],
      
      // Sizes
      ['btn-sm', { padding: '0.25rem 0.75rem', fontSize: '0.75rem' }],
      ['btn-lg', { padding: '0.75rem 1.5rem', fontSize: '1rem' }]
    ]
  }
})
```

```tsx
// Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children,
  className,
  ...props 
}: ButtonProps) {
  const variantClass = pika(`btn-${variant}`)
  const sizeClass = size !== 'md' ? pika(`btn-${size}`) : ''
  
  return (
    <button 
      className={`${variantClass} ${sizeClass} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Usage
<Button variant="primary">Primary</Button>
<Button variant="secondary" size="lg">Large Secondary</Button>
<Button variant="outline" disabled>Disabled</Button>
```

### Card Component

```typescript
// pika.config.ts shortcuts
shortcuts: [
  ['card', {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    '$:hover': {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    '@media (prefers-color-scheme: dark)': {
      backgroundColor: '#1f2937',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)'
    }
  }],
  
  ['card-header', {
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e5e7eb',
    '@media (prefers-color-scheme: dark)': {
      borderBottom: '1px solid #374151'
    }
  }],
  
  ['card-title', {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    '@media (prefers-color-scheme: dark)': {
      color: '#f9fafb'
    }
  }],
  
  ['card-content', {
    color: '#6b7280',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    '@media (prefers-color-scheme: dark)': {
      color: '#9ca3af'
    }
  }]
]
```

```tsx
// Card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
}

interface CardHeaderProps {
  children: React.ReactNode
}

interface CardTitleProps {
  children: React.ReactNode
}

interface CardContentProps {
  children: React.ReactNode
}

export function Card({ children, className }: CardProps) {
  return <div className={`${pika('card')} ${className || ''}`}>{children}</div>
}

export function CardHeader({ children }: CardHeaderProps) {
  return <div className={pika('card-header')}>{children}</div>
}

export function CardTitle({ children }: CardTitleProps) {
  return <h3 className={pika('card-title')}>{children}</h3>
}

export function CardContent({ children }: CardContentProps) {
  return <div className={pika('card-content')}>{children}</div>
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    This is the card content with some text.
  </CardContent>
</Card>
```

### Modal Component

```tsx
// Modal.tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null
  
  return (
    <div className={pika({
      'position': 'fixed',
      'top': '0',
      'left': '0',
      'right': '0',
      'bottom': '0',
      'backgroundColor': 'rgba(0, 0, 0, 0.5)',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'zIndex': '1000',
      'padding': '1rem'
    })} onClick={onClose}>
      <div 
        className={pika({
          'backgroundColor': 'white',
          'borderRadius': '0.5rem',
          'padding': '2rem',
          'maxWidth': '32rem',
          'width': '100%',
          'boxShadow': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          'position': 'relative',
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: '#1f2937'
          }
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={pika({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        })}>
          <h2 className={pika({
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
            '@media (prefers-color-scheme: dark)': {
              color: '#f9fafb'
            }
          })}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={pika({
              'padding': '0.5rem',
              'border': 'none',
              'backgroundColor': 'transparent',
              'cursor': 'pointer',
              'fontSize': '1.5rem',
              'color': '#6b7280',
              '$:hover': {
                color: '#111827'
              }
            })}
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

// Usage
const [isOpen, setIsOpen] = useState(false)

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
  <div className={pika({ display: 'flex', gap: '0.5rem', marginTop: '1rem' })}>
    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </div>
</Modal>
```

## Form Examples

### Input Component

```tsx
// Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className={pika({ marginBottom: '1rem' })}>
      {label && (
        <label className={pika({
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '500',
          marginBottom: '0.5rem',
          color: '#374151'
        })}>
          {label}
        </label>
      )}
      <input
        className={`${pika({
          'width': '100%',
          'padding': '0.5rem 0.75rem',
          'border': error ? '1px solid #ef4444' : '1px solid #d1d5db',
          'borderRadius': '0.375rem',
          'fontSize': '0.875rem',
          '$:focus': {
            outline: 'none',
            borderColor: error ? '#ef4444' : '#3b82f6',
            boxShadow: error 
              ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
              : '0 0 0 3px rgba(59, 130, 246, 0.1)'
          },
          '$:disabled': {
            backgroundColor: '#f3f4f6',
            cursor: 'not-allowed'
          }
        })} ${className || ''}`}
        {...props}
      />
      {error && (
        <p className={pika({
          marginTop: '0.25rem',
          fontSize: '0.75rem',
          color: '#ef4444'
        })}>
          {error}
        </p>
      )}
    </div>
  )
}

// Usage
<Input 
  label="Email" 
  type="email" 
  placeholder="Enter your email"
  error={errors.email}
/>
```

### Form Example

```tsx
// LoginForm.tsx
export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validation logic...
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className={pika({
        maxWidth: '24rem',
        margin: '0 auto',
        padding: '2rem'
      })}
    >
      <h2 className={pika({
        fontSize: '1.875rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        textAlign: 'center'
      })}>
        Sign In
      </h2>
      
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="you@example.com"
      />
      
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="••••••••"
      />
      
      <Button 
        type="submit" 
        variant="primary"
        className={pika({ width: '100%' })}
      >
        Sign In
      </Button>
    </form>
  )
}
```

## Layout Examples

### Flexbox Layouts

```tsx
// Header.tsx
export function Header() {
  return (
    <header className={pika({
      'display': 'flex',
      'justifyContent': 'space-between',
      'alignItems': 'center',
      'padding': '1rem 2rem',
      'backgroundColor': 'white',
      'boxShadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      '@media (max-width: 768px)': {
        padding: '1rem'
      }
    })}>
      <div className={pika({
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#3b82f6'
      })}>
        Logo
      </div>
      
      <nav className={pika({
        'display': 'flex',
        'gap': '2rem',
        '@media (max-width: 768px)': {
          gap: '1rem'
        }
      })}>
        <a href="/" className={pika({
          'color': '#6b7280',
          'textDecoration': 'none',
          '$:hover': {
            color: '#3b82f6'
          }
        })}>
          Home
        </a>
        <a href="/about" className={pika({
          'color': '#6b7280',
          'textDecoration': 'none',
          '$:hover': {
            color: '#3b82f6'
          }
        })}>
          About
        </a>
      </nav>
    </header>
  )
}
```

### Grid Layouts

```tsx
// ProductGrid.tsx
interface Product {
  id: number
  name: string
  price: number
  image: string
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={pika({
      'display': 'grid',
      'gridTemplateColumns': 'repeat(4, 1fr)',
      'gap': '1.5rem',
      'padding': '2rem',
      '@media (max-width: 1024px)': {
        gridTemplateColumns: 'repeat(3, 1fr)'
      },
      '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem'
      },
      '@media (max-width: 640px)': {
        gridTemplateColumns: '1fr'
      }
    })}>
      {products.map(product => (
        <Card key={product.id}>
          <img 
            src={product.image} 
            alt={product.name}
            className={pika({
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            })}
          />
          <h3 className={pika({
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          })}>
            {product.name}
          </h3>
          <p className={pika({
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#3b82f6'
          })}>
            ${product.price}
          </p>
        </Card>
      ))}
    </div>
  )
}
```

## Animation Examples

### Loading Spinner

```typescript
// pika.config.ts
export default defineEngineConfig({
  preflights: [
    `@keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }`
  ]
})
```

```tsx
// Spinner.tsx
export function Spinner({ size = '2rem' }: { size?: string }) {
  return (
    <div className={pika({
      'width': size,
      'height': size,
      'border': '2px solid #e5e7eb',
      'borderTopColor': '#3b82f6',
      'borderRadius': '50%',
      'animation': 'spin 0.6s linear infinite'
    })} />
  )
}

// Usage
<Spinner size="3rem" />
```

### Fade In Animation

```typescript
// pika.config.ts
preflights: [
  `@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }`
]
```

```tsx
// FadeIn component
export function FadeIn({ children, delay = 0 }: { 
  children: React.ReactNode
  delay?: number 
}) {
  return (
    <div className={pika({
      animation: 'fadeIn 0.5s ease-out forwards',
      animationDelay: `${delay}s`,
      opacity: '0'
    })}>
      {children}
    </div>
  )
}

// Usage
<FadeIn delay={0}>First item</FadeIn>
<FadeIn delay={0.1}>Second item</FadeIn>
<FadeIn delay={0.2}>Third item</FadeIn>
```

## Responsive Design Patterns

### Mobile-First Navigation

```tsx
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={pika({
          'display': 'block',
          'padding': '0.5rem',
          'border': 'none',
          'backgroundColor': 'transparent',
          'cursor': 'pointer',
          '@media (min-width: 768px)': {
            display: 'none'
          }
        })}
      >
        ☰
      </button>

      {/* Navigation links */}
      <div className={pika({
        'display': isOpen ? 'flex' : 'none',
        'flexDirection': 'column',
        'position': 'absolute',
        'top': '100%',
        'left': '0',
        'right': '0',
        'backgroundColor': 'white',
        'padding': '1rem',
        'boxShadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        '@media (min-width: 768px)': {
          display: 'flex',
          flexDirection: 'row',
          position: 'static',
          boxShadow: 'none',
          padding: '0',
          gap: '2rem'
        }
      })}>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>
    </nav>
  )
}
```

## Dark Mode Example

```tsx
// App.tsx with dark mode support
export function App() {
  return (
    <div className={pika({
      'minHeight': '100vh',
      'backgroundColor': '#ffffff',
      'color': '#111827',
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#111827',
        color: '#f9fafb'
      }
    })}>
      <Header />
      <main className={pika({
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      })}>
        <h1 className={pika({
          'fontSize': '2.25rem',
          'fontWeight': '700',
          'marginBottom': '1.5rem',
          'color': '#111827',
          '@media (prefers-color-scheme: dark)': {
            color: '#f9fafb'
          }
        })}>
          Welcome
        </h1>
        {/* Content */}
      </main>
    </div>
  )
}
```

## Next Steps

- Explore [Plugin System](/guide/plugin-system) for additional features
- Learn about [Shortcuts](/guide/shortcuts) to reuse these patterns
- Check [Performance Guide](/advanced/performance) for optimization tips

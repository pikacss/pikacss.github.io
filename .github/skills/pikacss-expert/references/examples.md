# Real-World Code Examples

Comprehensive collection of real-world examples showing how to use PikaCSS in practical scenarios.

## Table of Contents

- [Basic Components](#basic-components)
- [Form Patterns](#form-patterns)
- [Layout Patterns](#layout-patterns)
- [Interactive Components](#interactive-components)
- [Responsive Design](#responsive-design)
- [Dark Mode & Theming](#dark-mode--theming)
- [Animation & Transitions](#animation--transitions)
- [Advanced Patterns](#advanced-patterns)

---

## Basic Components

### Button Component

```tsx
// pika.config.ts
export default defineEngineConfig({
  shortcuts: {
    shortcuts: [
      ['btn', {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        fontWeight: '500',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }],
      ['btn-primary', {
        __shortcut: 'btn',
        backgroundColor: '#3b82f6',
        color: 'white',
        '$:hover': { backgroundColor: '#2563eb' },
        '$:active': { backgroundColor: '#1d4ed8' },
      }],
      ['btn-secondary', {
        __shortcut: 'btn',
        backgroundColor: '#e5e7eb',
        color: '#1f2937',
        '$:hover': { backgroundColor: '#d1d5db' },
      }],
      ['btn-danger', {
        __shortcut: 'btn',
        backgroundColor: '#ef4444',
        color: 'white',
        '$:hover': { backgroundColor: '#dc2626' },
      }],
      ['btn-lg', { padding: '0.75rem 1.5rem', fontSize: '1.125rem' }],
      ['btn-sm', { padding: '0.25rem 0.75rem', fontSize: '0.875rem' }],
    ]
  }
})

// Component
function Button({ 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  children 
}) {
  const variantClass = pika(`btn-${variant}`)
  const sizeClass = size !== 'md' ? pika(`btn-${size}`) : ''
  
  return (
    <button 
      className={`${variantClass} ${sizeClass}`}
      disabled={disabled}
      style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
    >
      {children}
    </button>
  )
}
```

### Card Component

```tsx
function Card({ title, children, className = '' }) {
  return (
    <div className={pika({
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      ...className && { className }
    })}>
      {title && (
        <h2 className={pika({
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
        })}>
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
```

### Badge Component

```tsx
// pika.config.ts
shortcuts: {
  shortcuts: [
    ['badge', {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.25rem 0.75rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      borderRadius: '9999px',
    }],
    ['badge-blue', {
      __shortcut: 'badge',
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    }],
    ['badge-green', {
      __shortcut: 'badge',
      backgroundColor: '#dcfce7',
      color: '#166534',
    }],
    ['badge-red', {
      __shortcut: 'badge',
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    }],
  ]
}

function Badge({ variant = 'blue', children }) {
  return (
    <span className={pika(`badge-${variant}`)}>
      {children}
    </span>
  )
}

// Usage
<Badge variant="green">Active</Badge>
<Badge variant="red">Inactive</Badge>
```

---

## Form Patterns

### Input Component

```tsx
// pika.config.ts
shortcuts: {
  shortcuts: [
    ['input-base', {
      width: '100%',
      padding: '0.5rem 0.75rem',
      fontSize: '1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      transition: 'all 0.2s',
      '$:focus': {
        outline: 'none',
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
    }],
    ['input-error', {
      borderColor: '#ef4444',
      '$:focus': {
        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
      },
    }],
  ]
}

function Input({ 
  error, 
  label, 
  id,
  ...props 
}) {
  return (
    <div className={pika({ marginBottom: '1rem' })}>
      {label && (
        <label className={pika({
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
        })} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={pika('input-base', error && 'input-error')}
        {...props}
      />
      {error && (
        <p className={pika({
          marginTop: '0.25rem',
          fontSize: '0.875rem',
          color: '#ef4444',
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
  error={emailError}
/>
```

### Checkbox Component

```tsx
function Checkbox({ label, checked, onChange, id }) {
  return (
    <div className={pika({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={pika({
          width: '1.25rem',
          height: '1.25rem',
          cursor: 'pointer',
          '$:focus': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
          },
        })}
      />
      {label && (
        <label 
          htmlFor={id}
          className={pika({
            cursor: 'pointer',
            fontSize: '0.875rem',
          })}
        >
          {label}
        </label>
      )}
    </div>
  )
}
```

### Select Component

```tsx
function Select({ label, options, value, onChange, id }) {
  return (
    <div className={pika({ marginBottom: '1rem' })}>
      {label && (
        <label className={pika({
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
        })} htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={pika({
          width: '100%',
          padding: '0.5rem 0.75rem',
          fontSize: '1rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          backgroundColor: 'white',
          cursor: 'pointer',
          '$:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
          },
        })}
      >
        <option value="">Select...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
```

---

## Layout Patterns

### Grid Layout

```tsx
function Grid({ columns = 3, gap = '1rem', children }) {
  return (
    <div className={pika({
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap,
    })}>
      {children}
    </div>
  )
}

// Usage
<Grid columns={3}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

### Flexbox Container

```tsx
function Flex({
  direction = 'row',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  gap = '1rem',
  children,
  ...props
}) {
  return (
    <div className={pika({
      display: 'flex',
      flexDirection: direction,
      justifyContent,
      alignItems,
      gap,
    })} {...props}>
      {children}
    </div>
  )
}

// Usage
<Flex justifyContent="center" alignItems="center" gap="2rem">
  <Item />
  <Item />
  <Item />
</Flex>
```

### Stack Component

```tsx
function Stack({ spacing = '1rem', direction = 'vertical', children }) {
  const isVertical = direction === 'vertical'
  
  return (
    <div className={pika({
      display: 'flex',
      flexDirection: isVertical ? 'column' : 'row',
      gap: spacing,
    })}>
      {children}
    </div>
  )
}

// Usage
<Stack spacing="2rem">
  <Header />
  <Main />
  <Footer />
</Stack>
```

### Container Component

```tsx
function Container({ maxWidth = '1200px', children }) {
  return (
    <div className={pika({
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth,
      paddingLeft: '1rem',
      paddingRight: '1rem',
    })}>
      {children}
    </div>
  )
}
```

---

## Interactive Components

### Modal Component

```tsx
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={pika({
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 40,
        })}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={pika({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
        maxWidth: '500px',
        width: '90%',
        zIndex: 50,
      })}>
        {/* Header */}
        <div className={pika({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
        })}>
          <h2 className={pika({ fontSize: '1.25rem', fontWeight: 'bold' })}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            className={pika({
              fontSize: '1.5rem',
              cursor: 'pointer',
              '$:hover': { opacity: 0.7 },
            })}
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className={pika({ padding: '1.5rem' })}>
          {children}
        </div>
      </div>
    </>
  )
}
```

### Dropdown Menu

```tsx
function Dropdown({ trigger, items }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className={pika({ position: 'relative', display: 'inline-block' })}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={pika('btn-secondary')}
      >
        {trigger}
      </button>
      
      {isOpen && (
        <div className={pika({
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '0.5rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
          zIndex: 50,
          minWidth: '200px',
        })}>
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => {
                item.onClick()
                setIsOpen(false)
              }}
              className={pika({
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                '$:hover': { backgroundColor: '#f3f4f6' },
              })}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Tabs Component

```tsx
function Tabs({ tabs, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  
  return (
    <div>
      {/* Tab buttons */}
      <div className={pika({
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
      })}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(idx)}
            className={pika({
              padding: '1rem',
              fontWeight: activeTab === idx ? 'bold' : 'normal',
              borderBottom: activeTab === idx ? '2px solid #3b82f6' : 'none',
              color: activeTab === idx ? '#3b82f6' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            })}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className={pika({ padding: '1.5rem' })}>
        {tabs[activeTab].content}
      </div>
    </div>
  )
}
```

---

## Responsive Design

### Mobile-First Approach

```tsx
function ResponsiveGrid({ children }) {
  return (
    <div className={pika({
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1rem',
      
      '@media (min-width: 640px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
      
      '@media (min-width: 1024px)': {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },
      
      '@media (min-width: 1280px)': {
        gridTemplateColumns: 'repeat(4, 1fr)',
      },
    })}>
      {children}
    </div>
  )
}
```

### Typography Scaling

```tsx
function ResponsiveHeading({ level = 1, children }) {
  const sizes = {
    1: { base: '1.875rem', md: '2.25rem', lg: '3rem' },
    2: { base: '1.5rem', md: '1.875rem', lg: '2.25rem' },
    3: { base: '1.25rem', md: '1.5rem', lg: '1.875rem' },
  }
  
  const size = sizes[level]
  const Tag = `h${level}`
  
  return (
    <Tag className={pika({
      fontSize: size.base,
      fontWeight: 'bold',
      
      '@media (min-width: 768px)': {
        fontSize: size.md,
      },
      
      '@media (min-width: 1024px)': {
        fontSize: size.lg,
      },
    })}>
      {children}
    </Tag>
  )
}
```

### Flexible Layout

```tsx
function ResponsiveLayout() {
  return (
    <div className={pika({
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
      
      '@media (min-width: 1024px)': {
        gridTemplateColumns: '1fr 300px',
      },
    })}>
      <main>Main content</main>
      <aside>Sidebar</aside>
    </div>
  )
}
```

---

## Dark Mode & Theming

### CSS Variables Approach

```tsx
// pika.config.ts
variables: {
  variables: {
    '--color-bg': '#ffffff',
    '--color-bg-secondary': '#f9fafb',
    '--color-text': '#1f2937',
    '--color-text-secondary': '#6b7280',
    '--color-border': '#e5e7eb',
  }
}

function Card({ children }) {
  return (
    <div className={pika({
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border)',
      padding: '1.5rem',
      borderRadius: '0.5rem',
    })}>
      {children}
    </div>
  )
}

function App() {
  const [isDark, setIsDark] = useState(false)
  
  return (
    <div style={{
      '--color-bg': isDark ? '#1f2937' : '#ffffff',
      '--color-bg-secondary': isDark ? '#111827' : '#f9fafb',
      '--color-text': isDark ? '#f9fafb' : '#1f2937',
      '--color-text-secondary': isDark ? '#d1d5db' : '#6b7280',
      '--color-border': isDark ? '#374151' : '#e5e7eb',
    }}>
      <Card>Dark mode content</Card>
    </div>
  )
}
```

### Media Query Approach

```tsx
function ThemedComponent({ children }) {
  return (
    <div className={pika({
      backgroundColor: 'white',
      color: 'black',
      
      '@media (prefers-color-scheme: dark)': {
        backgroundColor: 'black',
        color: 'white',
      },
    })}>
      {children}
    </div>
  )
}
```

---

## Animation & Transitions

### Keyframes with Config

```tsx
// pika.config.ts
export default defineEngineConfig({
  keyframes: {
    keyframes: {
      'fade-in': {
        'from': { opacity: '0' },
        'to': { opacity: '1' },
      },
      'slide-in': {
        'from': { transform: 'translateY(-10px)', opacity: '0' },
        'to': { transform: 'translateY(0)', opacity: '1' },
      },
      'bounce': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      },
    }
  },
  shortcuts: {
    shortcuts: [
      ['animate-fade-in', {
        animation: 'fade-in 0.3s ease-in-out',
      }],
      ['animate-slide-in', {
        animation: 'slide-in 0.3s ease-out',
      }],
    ]
  }
})

function FadeInComponent({ children }) {
  return (
    <div className={pika('animate-fade-in')}>
      {children}
    </div>
  )
}
```

### Hover Transitions

```tsx
function HoverCard({ children }) {
  return (
    <div className={pika({
      padding: '1.5rem',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      transition: 'all 0.3s ease',
      '$:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
    })}>
      {children}
    </div>
  )
}
```

---

## Advanced Patterns

### Compound Component

```tsx
function Card({ children }) {
  return <div className={pika({ backgroundColor: 'white', borderRadius: '0.5rem' })}>{children}</div>
}

Card.Header = function CardHeader({ children }) {
  return <div className={pika({ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' })}>{children}</div>
}

Card.Body = function CardBody({ children }) {
  return <div className={pika({ padding: '1.5rem' })}>{children}</div>
}

Card.Footer = function CardFooter({ children }) {
  return <div className={pika({ padding: '1.5rem', borderTop: '1px solid #e5e7eb' })}>{children}</div>
}

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Render Props Pattern

```tsx
function StyleProvider({ children }) {
  const buttonClass = pika('btn-primary')
  const cardClass = pika({
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
  })
  
  return children({
    buttonClass,
    cardClass,
  })
}

// Usage
<StyleProvider>
  {({ buttonClass, cardClass }) => (
    <>
      <button className={buttonClass}>Button</button>
      <div className={cardClass}>Card</div>
    </>
  )}
</StyleProvider>
```

### Context + Styling

```tsx
const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useThemeStyles() {
  const { theme } = useContext(ThemeContext)
  
  return {
    background: pika({
      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    }),
    text: pika({
      color: theme === 'dark' ? '#f9fafb' : '#1f2937',
    }),
  }
}

// Usage
function Component() {
  const styles = useThemeStyles()
  return <div className={styles.background}>Themed content</div>
}
```

---

## Performance Tips

1. **Pre-define shortcuts** for frequently used styles
2. **Use CSS variables** for dynamic theming
3. **Leverage composition** with component compounds
4. **Cache style objects** in module scope
5. **Minimize inline pika() calls** in render methods

---

## Troubleshooting Examples

### Issue: Styles not applying

```tsx
// ❌ Wrong - forgot to import CSS
function Component() {
  return <div className={pika({ color: 'red' })}>Red text</div>
}

// ✅ Correct - import generated CSS
import 'pika.css'

function Component() {
  return <div className={pika({ color: 'red' })}>Red text</div>
}
```

### Issue: TypeScript autocomplete not working

```tsx
// ❌ Wrong - missing type reference
export default defineEngineConfig({...})

// ✅ Correct - add reference comment
/// <reference path="./src/pika.gen.ts" />

export default defineEngineConfig({...})
```

### Issue: Dynamic values not working

```tsx
// ❌ Wrong - runtime prop in pika()
function Component({ color }) {
  return <div className={pika({ color })}>Text</div>
}

// ✅ Correct - use CSS variables
const textStyles = pika({ color: 'var(--text-color)' })

function Component({ color }) {
  return <div className={textStyles} style={{ '--text-color': color }}>Text</div>
}
```

---

## API Reference Links

For detailed API information, see:
- [Complete API Reference](./api-reference.md)
- [Plugin Development](./plugin-hooks.md)
- [TypeScript Setup](../SKILL.md#typescript-support)

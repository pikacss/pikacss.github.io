---
title: Migration Guide
description: Step-by-step guides for migrating to PikaCSS from other CSS solutions
outline: deep
---

# Migration Guide

This guide helps you migrate from other CSS solutions to PikaCSS. We cover the most popular alternatives and provide practical examples for each.

## General Migration Strategy

Regardless of which solution you're migrating from, follow this general approach:

1. **Install PikaCSS** in your project
2. **Set up configuration** (create `pika.config.ts`)
3. **Migrate styles incrementally** (start with new components, then refactor existing ones)
4. **Test thoroughly** after each component migration
5. **Remove old dependencies** once migration is complete

## From Tailwind CSS

### Installation

```bash
# Install PikaCSS
pnpm add -D @pikacss/unplugin-pikacss

# You can keep Tailwind during migration, or remove it later
# pnpm remove tailwindcss
```

### Configuration Setup

```typescript
// pika.config.ts
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
  // You can recreate your Tailwind theme here using shortcuts
  shortcuts: {
    shortcuts: [
      // Colors (example)
      ['text-primary', { color: '#3b82f6' }],
      ['bg-primary', { backgroundColor: '#3b82f6' }],
      
      // Common utilities
      ['flex-center', {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }]
    ]
  }
})
```

### Migration Examples

#### Simple Utilities

**Before (Tailwind):**
```html
<div class="flex items-center justify-center p-4 bg-blue-500 text-white rounded">
  Hello
</div>
```

**After (PikaCSS):**
```tsx
<div className={pika({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  borderRadius: '0.25rem'
})}>
  Hello
</div>
```

#### Responsive Design

**Before (Tailwind):**
```html
<div class="w-full md:w-1/2 lg:w-1/3">
  Content
</div>
```

**After (PikaCSS):**
```tsx
<div className={pika({
  'width': '100%',
  '@media (min-width: 768px)': {
    width: '50%'
  },
  '@media (min-width: 1024px)': {
    width: '33.333%'
  }
})}>
  Content
</div>
```

Or create a shortcut:

```typescript
// pika.config.ts
shortcuts: [
  [/^w-full$/, () => ({ width: '100%' })],
  [/^md:w-1\/2$/, () => ({ '@media (min-width: 768px)': { width: '50%' } })],
  // etc.
]
```

#### Hover and Focus States

**Before (Tailwind):**
```html
<button class="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
  Click Me
</button>
```

**After (PikaCSS):**
```tsx
<button className={pika({
  'backgroundColor': '#3b82f6',
  '$:hover': {
    backgroundColor: '#2563eb'
  },
  '$:focus': {
    outline: '2px solid #93c5fd'
  }
})}>
  Click Me
</button>
```

#### Dark Mode

**Before (Tailwind):**
```html
<div class="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

**After (PikaCSS):**
```tsx
<div className={pika({
  'backgroundColor': '#ffffff',
  'color': '#000000',
  '@media (prefers-color-scheme: dark)': {
    backgroundColor: '#111827',
    color: '#ffffff'
  }
})}>
  Content
</div>
```

### Tailwind-to-PikaCSS Cheat Sheet

| Tailwind | PikaCSS |
|----------|---------|
| `flex` | `{ display: 'flex' }` |
| `items-center` | `{ alignItems: 'center' }` |
| `justify-between` | `{ justifyContent: 'space-between' }` |
| `p-4` | `{ padding: '1rem' }` |
| `px-4` | `{ paddingLeft: '1rem', paddingRight: '1rem' }` |
| `py-2` | `{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }` |
| `m-4` | `{ margin: '1rem' }` |
| `w-full` | `{ width: '100%' }` |
| `h-screen` | `{ height: '100vh' }` |
| `text-center` | `{ textAlign: 'center' }` |
| `font-bold` | `{ fontWeight: 'bold' }` |
| `text-lg` | `{ fontSize: '1.125rem' }` |
| `rounded` | `{ borderRadius: '0.25rem' }` |
| `shadow` | `{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }` |
| `hover:bg-blue-600` | `{ '$:hover': { backgroundColor: '#2563eb' } }` |

## From Styled-components

### Installation

```bash
# Install PikaCSS
pnpm add -D @pikacss/unplugin-pikacss

# You can remove styled-components later
# pnpm remove styled-components
```

### Migration Examples

#### Basic Component

**Before (Styled-components):**
```tsx
import styled from 'styled-components'

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  
  &:hover {
    background-color: #2563eb;
  }
`

export default function App() {
  return <Button>Click Me</Button>
}
```

**After (PikaCSS):**
```tsx
function Button({ children }) {
  return (
    <button className={pika({
      'padding': '0.5rem 1rem',
      'backgroundColor': '#3b82f6',
      'color': 'white',
      'border': 'none',
      'borderRadius': '0.25rem',
      'cursor': 'pointer',
      '$:hover': {
        backgroundColor: '#2563eb'
      }
    })}>
      {children}
    </button>
  )
}

export default function App() {
  return <Button>Click Me</Button>
}
```

Or use shortcuts for reusability:

```typescript
// pika.config.ts
shortcuts: [
  ['btn', {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    '$:hover': {
      backgroundColor: '#2563eb'
    }
  }]
]
```

```tsx
// Usage
<button className={pika('btn')}>Click Me</button>
```

#### Props-based Styling

**Before (Styled-components):**
```tsx
const Button = styled.button<{ $primary?: boolean }>`
  background-color: ${props => props.$primary ? '#3b82f6' : '#6b7280'};
  color: white;
`

<Button $primary>Primary</Button>
<Button>Secondary</Button>
```

**After (PikaCSS):**

Use multiple shortcuts or conditional logic:

```tsx
function Button({ primary, children }) {
  return (
    <button className={pika({
      backgroundColor: primary ? '#3b82f6' : '#6b7280',
      color: 'white'
    })}>
      {children}
    </button>
  )
}
```

Wait! ❌ This won't work because PikaCSS evaluates at build time.

**Correct approach using shortcuts:**

```typescript
// pika.config.ts
shortcuts: [
  ['btn-base', { color: 'white', padding: '0.5rem 1rem' }],
  ['btn-primary', { __shortcut: 'btn-base', backgroundColor: '#3b82f6' }],
  ['btn-secondary', { __shortcut: 'btn-base', backgroundColor: '#6b7280' }]
]
```

```tsx
function Button({ primary, children }) {
  return (
    <button className={pika(primary ? 'btn-primary' : 'btn-secondary')}>
      {children}
    </button>
  )
}
```

#### Theming

**Before (Styled-components):**
```tsx
import { ThemeProvider } from 'styled-components'

const theme = {
  colors: {
    primary: '#3b82f6'
  }
}

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
`

<ThemeProvider theme={theme}>
  <Button>Click</Button>
</ThemeProvider>
```

**After (PikaCSS with CSS Variables):**
```tsx
// Set CSS variables at root
document.documentElement.style.setProperty('--color-primary', '#3b82f6')

// Use in PikaCSS
<button className={pika({
  backgroundColor: 'var(--color-primary)'
})}>
  Click
</button>
```

Or define in preflights:

```typescript
// pika.config.ts
export default defineEngineConfig({
  preflights: [
    ':root { --color-primary: #3b82f6; --color-secondary: #6b7280; }'
  ]
})
```

## From Emotion

### Installation

```bash
# Install PikaCSS
pnpm add -D @pikacss/unplugin-pikacss

# You can remove Emotion later
# pnpm remove @emotion/react @emotion/styled
```

### Migration Examples

#### css Prop / css Function

**Before (Emotion):**
```tsx
import { css } from '@emotion/react'

<div className={css`
  display: flex;
  padding: 1rem;
  background-color: #3b82f6;
  
  &:hover {
    background-color: #2563eb;
  }
`}>
  Content
</div>
```

**After (PikaCSS):**
```tsx
<div className={pika({
  'display': 'flex',
  'padding': '1rem',
  'backgroundColor': '#3b82f6',
  '$:hover': {
    backgroundColor: '#2563eb'
  }
})}>
  Content
</div>
```

#### Object Styles

**Before (Emotion):**
```tsx
import { css } from '@emotion/react'

<div className={css({
  display: 'flex',
  padding: '1rem',
  backgroundColor: '#3b82f6',
  '&:hover': {
    backgroundColor: '#2563eb'
  }
})}>
  Content
</div>
```

**After (PikaCSS):**
```tsx
<div className={pika({
  'display': 'flex',
  'padding': '1rem',
  'backgroundColor': '#3b82f6',
  '$:hover': { // Use $ instead of &
    backgroundColor: '#2563eb'
  }
})}>
  Content
</div>
```

**Key difference**: Replace `&` with `$` for selector references.

#### Style Composition

**Before (Emotion):**
```tsx
const baseStyles = css`
  padding: 0.5rem;
  border-radius: 0.25rem;
`

const primaryStyles = css`
  ${baseStyles}
  background-color: #3b82f6;
  color: white;
`
```

**After (PikaCSS with shortcuts):**
```typescript
// pika.config.ts
shortcuts: [
  ['base-styles', {
    padding: '0.5rem',
    borderRadius: '0.25rem'
  }],
  ['primary-styles', {
    __shortcut: 'base-styles',
    backgroundColor: '#3b82f6',
    color: 'white'
  }]
]
```

```tsx
<button className={pika('primary-styles')}>Click</button>
```

## From UnoCSS

### Installation

```bash
# Install PikaCSS
pnpm add -D @pikacss/unplugin-pikacss

# You can remove UnoCSS later
# pnpm remove unocss
```

### Migration Examples

#### Basic Utilities

**Before (UnoCSS):**
```html
<div class="flex items-center justify-center p-4 bg-blue-500 text-white">
  Hello
</div>
```

**After (PikaCSS):**
```tsx
<div className={pika({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  backgroundColor: '#3b82f6',
  color: 'white'
})}>
  Hello
</div>
```

#### Shortcuts

**Before (UnoCSS):**
```typescript
// uno.config.ts
shortcuts: {
  'btn': 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
}
```

**After (PikaCSS):**
```typescript
// pika.config.ts
shortcuts: [
  ['btn', {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.25rem',
    '$:hover': {
      backgroundColor: '#2563eb'
    }
  }]
]
```

#### Dynamic Rules

**Before (UnoCSS):**
```typescript
// uno.config.ts
rules: [
  [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })]
]
```

**After (PikaCSS):**
```typescript
// pika.config.ts
shortcuts: [
  [/^m-(\d+)$/, m => ({ margin: `${m[1]}px` }), ['m-4', 'm-8', 'm-16']]
]
```

## Common Pitfalls

### ❌ Runtime Variables

```tsx
// ❌ This won't work - runtime variable
function Component({ color }) {
  return <div className={pika({ color })} />
}

// ✅ Use CSS variables instead
function Component({ color }) {
  return (
    <div 
      className={pika({ color: 'var(--dynamic-color)' })}
      style={{ '--dynamic-color': color }}
    />
  )
}
```

### ❌ Function Calls

```tsx
// ❌ This won't work - function call
const getColor = () => '#3b82f6'
<div className={pika({ color: getColor() })} />

// ✅ Use static value
const COLOR = '#3b82f6'
<div className={pika({ color: COLOR })} />
```

### ❌ Props Interpolation

```tsx
// ❌ This won't work - props are runtime
<div className={pika({ padding: props.spacing })} />

// ✅ Use predefined shortcuts
const classes = {
  small: pika({ padding: '0.5rem' }),
  medium: pika({ padding: '1rem' }),
  large: pika({ padding: '1.5rem' })
}
<div className={classes[props.size]} />
```

## Migration Checklist

- [ ] Install PikaCSS and configure bundler plugin
- [ ] Create `pika.config.ts` with initial configuration
- [ ] Import `pika.css` in your entry file
- [ ] Set up TypeScript references
- [ ] Migrate theme/design tokens to shortcuts or CSS variables
- [ ] Start migrating components (new ones first)
- [ ] Test each migrated component thoroughly
- [ ] Update tests to use new class names
- [ ] Remove old CSS solution dependencies
- [ ] Clean up unused configuration files
- [ ] Update documentation and style guides

## Getting Help

If you encounter issues during migration:

1. Check the [Troubleshooting Guide](/advanced/troubleshooting)
2. Review [Build-Time Constraints](/getting-started/what-is-pikacss#zero-runtime)
3. Search [GitHub Issues](https://github.com/pikacss/pikacss/issues)
4. Ask in [GitHub Discussions](https://github.com/pikacss/pikacss/discussions)

## Next Steps

After migrating:

- Explore [Plugin System](/guide/plugin-system) for icons, reset, typography
- Learn about [Shortcuts](/guide/shortcuts) for reusable styles
- Optimize with [Performance Guide](/advanced/performance)
- Share your experience with the community!

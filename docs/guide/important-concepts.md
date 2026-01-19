# Important Concepts

## Build-Time Evaluation Constraint

**This is the most critical concept to understand before using PikaCSS.**

All arguments passed to `pika()` must be **statically analyzable** at build time. This means PikaCSS cannot evaluate runtime variables, function calls, or any dynamic expressions.

### Why This Matters

Because PikaCSS transforms styles at build time (before your application runs), it needs to determine:
1. What CSS properties and values are used
2. Generate atomic class names for each property-value combo
3. Output the CSS file with all necessary styles

This is only possible if the style definitions are **static** and deterministic.

### Valid Examples

```typescript
// ✅ Static values
const styles = pika({ color: 'red' })

// ✅ Static string literals
const primary = pika({ color: '#3b82f6' })

// ✅ Static variables
const COLOR = 'blue'
const styles2 = pika({ color: COLOR })

// ✅ Static module imports
import { COLORS } from './constants'
const text = pika({ color: COLORS.primary })
```

### Invalid Examples

```typescript
// ❌ Runtime variables
function Component({ color }) {
  const styles = pika({ color }) // ❌ color comes from props
}

// ❌ Function calls
const userColor = getUserColor() // Runtime
const styles = pika({ color: userColor })

// ❌ Dynamic expressions
const size = props.size // Runtime
const styles = pika({ fontSize: size })

// ❌ Array/object spreading from runtime
const userStyles = getUserStyles() // Runtime
const styles = pika({ ...userStyles })
```

### Solution: Use CSS Variables

For dynamic values that change at runtime, use CSS variables:

```typescript
// ✅ Static style definition with CSS variable
const styles = pika({ color: 'var(--user-color)' })

// Set variable at runtime
<div style={{ color: '#3b82f6' }} className={styles}>
  Content
</div>

// Or with custom property
<div style={{ '--user-color': userColor }} className={styles}>
  Content
</div>
```

### Framework-Specific Patterns

**React**:
```tsx
function Button({ color }) {
  const styles = pika({ color: 'var(--btn-color)' })
  return <button style={{ '--btn-color': color }} className={styles} />
}
```

**Vue**:
```vue
<script setup>
const styles = pika({ color: 'var(--btn-color)' })
const color = ref('blue')
</script>

<template>
  <button :style="{ '--btn-color': color }" :class="styles">
    Button
  </button>
</template>
```

**Svelte**:
```svelte
<script>
  const styles = pika({ color: 'var(--btn-color)' })
  export let color = 'blue'
</script>

<button style="--btn-color: {color}" class={styles}>
  Button
</button>
```

## Zero Runtime Philosophy

Because of the build-time constraint, PikaCSS has **zero runtime overhead**:

- No JavaScript is executed for style generation during app runtime
- All styles are computed at build time
- The output is just class names and CSS files
- App performance is identical to hand-written atomic CSS

This makes PikaCSS different from runtime CSS-in-JS solutions like styled-components or Emotion, which compute styles during application execution.

### Trade-offs

**Advantages of zero runtime**:
- ✅ No runtime performance cost
- ✅ Smaller JavaScript bundle
- ✅ Works in any environment (browser, SSR, SSG, static)
- ✅ Works with any framework

**Constraints**:
- ❌ All styles must be known at build time
- ❌ Cannot use runtime variables directly in styles
- ❌ Must use CSS variables for dynamic values

## Build-Time Processing Steps

When you use `pika()` in your code, here's what happens:

```
1. Source Code Analysis (Build-time)
   ↓ pika({ color: 'red' }) is detected
   ↓
2. Code Evaluation (Build-time)
   ↓ { color: 'red' } is evaluated to determine value
   ↓
3. Class Name Generation (Build-time)
   ↓ Atomic class generated (e.g., 'a')
   ↓
4. Code Transformation (Build-time)
   ↓ pika({ color: 'red' }) → 'a'
   ↓
5. CSS Generation (Build-time)
   ↓ .a { color: red; } added to output CSS
   ↓
6. Output
   ↓ Runtime: Just a string 'a' with pre-generated CSS
```

## Static vs Runtime Values

### Testing if a Value is Static

Ask yourself: **"Is this value known before my app starts running?"**

| Value | Static? | Example |
|-------|---------|---------|
| String literal | ✅ Yes | `'red'`, `'16px'` |
| Number literal | ✅ Yes | `0`, `16` |
| Module constant | ✅ Yes | `COLORS.primary` |
| Environment variable | ✅ Yes | `process.env.PRIMARY_COLOR` |
| Function call | ❌ No | `getColor()` |
| Component prop | ❌ No | `props.color` |
| State variable | ❌ No | `state.color` |
| DOM element property | ❌ No | `document.getElementById('btn').color` |
| User input | ❌ No | Any value from user interaction |

## Related Topics

- [Shortcuts](/guide/shortcuts.md) - Reusable static style combinations
- [Configuration](/guide/configuration.md) - Configuring PikaCSS behavior
- [Troubleshooting](/advanced/troubleshooting.md) - Common issues and solutions
- [Architecture](/advanced/architecture.md) - How PikaCSS works internally

---

**Key Takeaway**: Remember that PikaCSS transforms styles at build time, so use static values in `pika()` and CSS variables for runtime customization.

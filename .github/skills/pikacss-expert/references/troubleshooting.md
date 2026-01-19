# Troubleshooting Guide

## Common Issues and Solutions

### Style Not Applied

**Problem**: Styles defined with `pika()` don't appear in the browser.

**Possible Causes:**

1. **PikaCSS CSS not loaded**
   ```
   Check if pika.gen.css is imported in your project
   
   ✅ Correct:
   import 'pika.gen.css'
   
   or Vite automatically handles it
   ```

2. **Build not run**
   ```bash
   # Run build if changes don't appear
   pnpm build
   npm run build
   ```

3. **CSS specificity issue**
   ```typescript
   // ❌ Specificity conflict
   pika({ color: 'blue' })
   /* Your CSS: .p { color: red !important; } */
   
   // ✅ Solution: Use more specific selectors
   pika({ color: 'blue !important' })
   ```

**Solution Checklist:**
- [ ] CSS file is imported/linked
- [ ] Build process ran successfully
- [ ] Generated class name exists in HTML
- [ ] Browser dev tools show generated CSS
- [ ] No CSS specificity conflicts

### Runtime Value Error

**Problem**: Getting error like "Cannot use runtime variable in pika()"

**Example:**
```typescript
// ❌ Error: color is runtime variable
function Button({ color }) {
  const styles = pika({ color })
}
```

**Root Cause**: PikaCSS evaluates `pika()` calls at build time. Runtime variables aren't available yet.

**Solutions:**

**1. Use CSS Variables (Recommended)**
```typescript
const styles = pika({
  color: 'var(--button-color)',
  backgroundColor: 'var(--button-bg)'
})

function Button({ color, bg }) {
  return (
    <button 
      className={styles.className}
      style={{
        '--button-color': color,
        '--button-bg': bg
      }}
    >
      Click
    </button>
  )
}
```

**2. Move to Constants**
```typescript
const COLOR_RED = '#ef4444'
const COLOR_BLUE = '#3b82f6'

const redButton = pika({ color: COLOR_RED })
const blueButton = pika({ color: COLOR_BLUE })

function Button({ variant }) {
  const styles = variant === 'red' ? redButton : blueButton
  return <button className={styles.className}>Click</button>
}
```

**3. Use Shortcuts for Variants**
```typescript
// In plugin
engine.registerShortcut('btn-primary', {
  backgroundColor: '#3b82f6',
  color: 'white'
})
engine.registerShortcut('btn-danger', {
  backgroundColor: '#ef4444',
  color: 'white'
})

// In component
function Button({ variant = 'primary' }) {
  const key = `btn-${variant}`
  const styles = pika({ [key]: true })
  return <button className={styles.className}>Click</button>
}
```

### Class Name Collision

**Problem**: Multiple `pika()` calls generate the same class name or classes conflict.

**Example:**
```typescript
// Two definitions produce same output
pika({ color: 'blue' })
pika({ color: 'blue' })

// These might conflict
const btn1 = pika({ padding: '1rem', color: 'white' })
const btn2 = pika({ padding: '1rem', color: 'red' })
```

**Solution**: PikaCSS automatically handles this through:
1. **Atomic CSS** - Each property generates unique class
2. **Specificity** - Later styles override earlier ones

```typescript
// Safe - PikaCSS generates different classes
const btn1 = pika({ color: 'white' })      // .color-white
const btn2 = pika({ color: 'red' })        // .color-red

// Safe - Combined into one class
const styles = pika({ color: 'blue', padding: '1rem' })
// Generates: .color-blue .padding-1rem
```

### Performance Issues

**Problem**: Build or runtime is slow.

**Causes:**

1. **Too many pika() calls**
   ```typescript
   // ❌ Inefficient: creates separate classes
   return (
     <>
       {items.map(item => pika({ color: item.color }))}
     </>
   )
   
   // ✅ Efficient: use CSS variables
   const styles = pika({ color: 'var(--item-color)' })
   return (
     <>
       {items.map(item => (
         <div style={{ '--item-color': item.color }} 
              className={styles.className} />
       ))}
     </>
   )
   ```

2. **Unoptimized plugin**
   ```typescript
   // ❌ Slow: runs for every style
   async transformStyleDefinitions(defs) {
     return await expensiveProcessing(defs)
   }
   
   // ✅ Fast: runs once during setup
   async configureEngine(engine) {
     engine.registerShortcut('btn', 
       expensiveComputedShortcut())
   }
   ```

3. **Large CSS bundle**
   - Check `pika.gen.css` file size
   - Verify unused styles are tree-shaken
   - Consider splitting into multiple bundles

**Solutions:**
- Use CSS variables for dynamic values
- Cache expensive computations
- Use shortcuts instead of inline definitions
- Verify build optimization settings

### Type Errors

**Problem**: TypeScript errors when using `pika()`.

**Examples:**

**1. Property not recognized**
```typescript
// ❌ Error: 'colr' is not a valid property
pika({ colr: 'red' })  // typo!

// ✅ Correct
pika({ color: 'red' })
```

**2. Invalid media query selector**
```typescript
// ❌ Error: unknown selector format
pika({ '@media mobile': { color: 'red' } })

// ✅ Correct
pika({ '@media (min-width: 640px)': { color: 'red' } })
```

**3. Missing plugin types**
```typescript
// ❌ Error: 'icon' shortcut not recognized
pika({ icon: { name: 'check' } })

// ✅ Add plugin import to get types
import 'from @pikacss/plugin-icons'
pika({ icon: { name: 'check' } })
```

**Solution Checklist:**
- [ ] Check property spelling (camelCase)
- [ ] Verify media query syntax
- [ ] Ensure plugins are imported
- [ ] Run `pnpm typecheck`
- [ ] Restart TypeScript server in editor

### Media Query Not Working

**Problem**: Responsive styles don't apply at different screen sizes.

**Example:**
```typescript
// ❌ Not working
pika({
  '@media (max-width: 768px)': {
    fontSize: '14px'
  }
})

// ❌ Syntax error
pika({
  '@media mobile': {
    fontSize: '14px'
  }
})
```

**Correct Syntax:**
```typescript
// ✅ Correct
pika({
  fontSize: '16px',
  '@media (max-width: 768px)': {
    fontSize: '14px'
  }
})

// ✅ Multiple breakpoints
pika({
  fontSize: '14px',
  '@media (min-width: 640px)': {
    fontSize: '16px'
  },
  '@media (min-width: 1024px)': {
    fontSize: '18px'
  }
})
```

**Common Media Query Patterns:**
```typescript
// Screen size
'@media (min-width: 640px)'
'@media (max-width: 768px)'
'@media (min-width: 640px) and (max-width: 1024px)'

// Device preference
'@media (prefers-color-scheme: dark)'
'@media (prefers-reduced-motion: reduce)'
'@media (prefers-contrast: more)'

// Orientation
'@media (orientation: portrait)'
'@media (orientation: landscape)'
```

### Pseudo-Classes Not Working

**Problem**: Hover, active, focus states don't work.

**Example:**
```typescript
// ❌ Incorrect syntax
pika({
  color: 'blue',
  'hover': { color: 'red' }  // Missing &
})

// ✅ Correct
pika({
  color: 'blue',
  '&:hover': { color: 'red' }
})
```

**Common Pseudo-Classes:**
```typescript
pika({
  backgroundColor: 'white',
  
  '&:hover': { backgroundColor: '#f5f5f5' },
  '&:active': { transform: 'scale(0.95)' },
  '&:focus': { outline: '2px solid blue' },
  '&:focus-visible': { outline: '2px solid blue' },
  '&:disabled': { opacity: '0.5' },
  '&:visited': { color: 'purple' },
  '&:checked': { backgroundColor: 'blue' }
})
```

### Pseudo-Elements Not Rendering

**Problem**: `$before`, `$after` pseudo-elements don't appear.

**Example:**
```typescript
// ❌ Missing content property
pika({
  $before: {
    color: 'gray'  // No content!
  }
})

// ✅ Correct
pika({
  $before: {
    content: '"→ "',
    color: 'gray'
  }
})
```

**Note**: Pseudo-elements always need `content` property (even if empty).

```typescript
pika({
  $after: {
    content: '""',  // Empty content still required
    display: 'block',
    height: '1px',
    backgroundColor: '#ddd'
  }
})
```

### Plugin Not Loading

**Problem**: Registered shortcuts don't work.

**Causes:**

1. **Plugin not activated**
   ```typescript
   // ❌ Plugin not in array
   const engine = createEngine({
     plugins: []  // Missing iconPlugin!
   })
   
   // ✅ Plugin activated
   const engine = createEngine({
     plugins: [iconPlugin()]
   })
   ```

2. **Plugin not initialized**
   ```typescript
   // ❌ Missing parentheses
   plugins: [myPlugin]  // Wrong!
   
   // ✅ Correct
   plugins: [myPlugin()]
   ```

3. **Import statement missing**
   ```typescript
   // ❌ Not imported
   pika({ icon: { name: 'check' } })
   
   // ✅ Import plugin
   import { iconPlugin } from '@pikacss/plugin-icons'
   ```

**Debug:**
```typescript
// Check if plugin is loaded
const engine = createEngine({
  plugins: [iconPlugin()]
})

const result = await engine.process({
  icon: { name: 'check' }
})

console.log(result.css)  // Should contain icon styles
```

### Browser Compatibility

**Problem**: Styles don't work in older browsers.

**Check:**
1. CSS properties used are browser-compatible
2. Add vendor prefixes if needed
3. Use fallback values

```typescript
// ✅ With fallback
pika({
  display: 'flex',
  display: 'grid',  // Fallback to flex in old browsers
  
  // Vendor prefix for older Safari
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '3'
})
```

**Common Compatibility Issues:**
- `grid` - IE 11 limited support
- `gap` - IE 11 not supported
- CSS custom properties - IE 11 not supported
- `@supports` - IE 11 not supported

## Getting Help

If the issue persists:

1. **Check the API Reference** - [references/API-REFERENCE.md](references/API-REFERENCE.md)
2. **Review examples** - Look for similar patterns in docs
3. **Enable debug mode** - Set `DEBUG=pikacss:*` environment variable
4. **Check generated files** - Inspect `pika.gen.css` and `pika.gen.ts`
5. **Create minimal reproduction** - Isolate the issue in a small example

## Known Limitations

### Build-Time Only

All `pika()` arguments must be statically analyzable at build time:

```typescript
// ❌ Not supported
const Component = ({ theme }) => (
  <div className={pika({ color: theme.primary }).className} />
)
```

### CSS Variables Required for Dynamic Values

For runtime-determined styles, use CSS variables:

```typescript
// ✅ Supported
const styles = pika({ color: 'var(--primary)' })
<div style={{ '--primary': color }} className={styles.className} />
```

### Circular Dependencies

If pika.gen files don't generate:
- Check for circular package dependencies
- Verify build order in monorepo
- Use `pnpm --filter` to isolate affected package

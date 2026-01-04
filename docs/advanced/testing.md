---
title: Testing and Debugging
description: Comprehensive guide for testing components and debugging issues with PikaCSS
outline: deep
---

# Testing and Debugging

This guide covers strategies for testing components that use PikaCSS and debugging common issues.

## Testing Strategies

### Unit Testing Components

PikaCSS transforms styles at build time, so your tests see the transformed class names.

#### With Vitest + React Testing Library

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct classes', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')
    
    // PikaCSS generates atomic class names
    expect(button.className).toBeTruthy()
    expect(button.className).toMatch(/\w+/) // Has classes
  })

  it('applies styles correctly', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')
    
    // Check computed styles instead of class names
    const styles = window.getComputedStyle(button)
    expect(styles.backgroundColor).toBe('rgb(59, 130, 246)') // #3b82f6
  })
})
```

**Key insight**: Test computed styles, not class names (atomic classes are implementation details).

#### Testing with Shortcuts

```typescript
// Button.tsx
export function Button({ variant = 'primary' }) {
  return (
    <button className={pika(`btn-${variant}`)}>
      Click
    </button>
  )
}
```

```typescript
// Button.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Button variants', () => {
  it('renders primary variant', () => {
    const { container } = render(<Button variant="primary" />)
    const button = container.querySelector('button')
    
    // Test computed styles
    const styles = window.getComputedStyle(button!)
    expect(styles.backgroundColor).toBe('rgb(59, 130, 246)')
  })

  it('renders secondary variant', () => {
    const { container } = render(<Button variant="secondary" />)
    const button = container.querySelector('button')
    
    const styles = window.getComputedStyle(button!)
    expect(styles.backgroundColor).toBe('rgb(107, 114, 128)')
  })
})
```

### Integration Testing

Test that styles are generated and applied correctly:

```typescript
// integration.test.ts
import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('PikaCSS Integration', () => {
  it('generates CSS file', () => {
    const cssPath = path.join(__dirname, '../src/pika.gen.css')
    expect(fs.existsSync(cssPath)).toBe(true)
  })

  it('generates TypeScript definitions', () => {
    const tsPath = path.join(__dirname, '../src/pika.gen.ts')
    expect(fs.existsSync(tsPath)).toBe(true)
  })

  it('CSS contains expected styles', () => {
    const cssPath = path.join(__dirname, '../src/pika.gen.css')
    const css = fs.readFileSync(cssPath, 'utf-8')
    
    // Check for specific property-value pairs
    expect(css).toContain('color')
    expect(css).toContain('background-color')
  })
})
```

### E2E Testing

Use tools like Playwright or Cypress to test visual appearance:

```typescript
// button.spec.ts (Playwright)
import { expect, test } from '@playwright/test'

test('button has correct styles', async ({ page }) => {
  await page.goto('/components/button')
  
  const button = page.locator('button').first()
  
  // Check computed styles
  const bgColor = await button.evaluate(
    el => window.getComputedStyle(el).backgroundColor
  )
  expect(bgColor).toBe('rgb(59, 130, 246)')
  
  // Visual regression
  await expect(button).toHaveScreenshot('button.png')
})

test('hover state works', async ({ page }) => {
  await page.goto('/components/button')
  
  const button = page.locator('button').first()
  await button.hover()
  
  const bgColor = await button.evaluate(
    el => window.getComputedStyle(el).backgroundColor
  )
  expect(bgColor).toBe('rgb(37, 99, 235)') // hover color
})
```

### Snapshot Testing

```typescript
// Button.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Button snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(<Button>Click me</Button>)
    expect(container).toMatchSnapshot()
  })
})
```

**Note**: Atomic class names may change. Consider using `toMatchInlineSnapshot()` or testing computed styles instead.

## Debugging Techniques

### 1. Verify Generated Files

First step: Check if files are generated correctly.

```bash
# Check if files exist
ls -la src/pika.gen.css
ls -la src/pika.gen.ts

# View content
cat src/pika.gen.css
cat src/pika.gen.ts
```

### 2. Browser DevTools

#### Inspect Elements

```
1. Right-click element → Inspect
2. Check "Styles" panel for applied CSS
3. Look for atomic class names (.a, .b, .c, etc.)
4. Verify properties are applied
```

#### Check CSS Loading

```javascript
// Open browser console
console.log(document.styleSheets)

// Check if pika.gen.css is loaded
Array.from(document.styleSheets).forEach(sheet => {
  console.log(sheet.href)
})
```

#### Debug Style Specificity

```javascript
// Get computed styles for an element
const el = document.querySelector('.my-component')
const styles = window.getComputedStyle(el)
console.log(styles.backgroundColor) // Current value
console.log(styles.color) // Current value

// Check all applied styles
for (let prop of styles) {
  console.log(prop, styles.getPropertyValue(prop))
}
```

### 3. Enable Debug Logging

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    pikacss({
      // Add logging
      scan: {
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['node_modules/**']
      }
    })
  ],
  // Enable debug mode
  logLevel: 'info'
})
```

```bash
# Run with debug flag
DEBUG=pikacss:* pnpm dev
```

### 4. Check Transformation

Verify that `pika()` calls are being transformed:

```typescript
// Original code
const styles = pika({ color: 'red' })

// After transformation (check browser sources)
const styles = "a" // Should be transformed to class name
```

**How to check:**
1. Open browser DevTools → Sources
2. Find your component file
3. Look at the transformed code
4. `pika()` calls should be replaced with strings

### 5. Inspect Network Tab

Check if CSS is loading correctly:

```
1. Open DevTools → Network
2. Filter by "CSS"
3. Look for pika.gen.css
4. Check Status: 200 OK
5. Check Size: Should be non-zero
6. Preview: Should contain CSS rules
```

## Common Issues and Solutions

### Issue: Styles Not Applied

#### Symptom
Elements have class names but no visual styles.

#### Debugging Steps

1. **Check if CSS is imported:**
```tsx
// ✅ Must be imported in entry file
import 'pika.css'
```

2. **Verify CSS file exists:**
```bash
ls -la src/pika.gen.css
```

3. **Check browser DevTools:**
   - Network tab: Is `pika.gen.css` loaded?
   - Elements tab: Are classes applied?
   - Console: Any CSS loading errors?

4. **Check for CSS conflicts:**
```css
/* Another stylesheet might override */
* { color: black !important; } /* Kills all colors */
```

#### Solutions

- Import `pika.css` in root/entry file
- Check build configuration includes PikaCSS plugin
- Verify no CSS resets are overriding styles
- Use `__important: true` if needed

### Issue: `pika is not defined`

#### Symptom
```
ReferenceError: pika is not defined
```

#### Debugging Steps

1. **Check TypeScript reference:**
```typescript
/// <reference path="./pika.gen.ts" />
```

2. **Verify generated file:**
```bash
cat src/pika.gen.ts
# Should export: export function pika(...)
```

3. **Check imports:**
```typescript
// If not using Nuxt, import explicitly
import { pika } from './pika.gen'
```

#### Solutions

- Ensure `pika.gen.ts` is generated (run dev server once)
- Add TypeScript reference in config file
- For Nuxt: Check module is loaded in `nuxt.config.ts`
- Restart TypeScript server: `Cmd+Shift+P` → "Restart TS Server"

### Issue: Build Fails

#### Symptom
```
Error: Cannot find module 'pika.css'
```

#### Debugging Steps

1. **Check plugin configuration:**
```typescript
// vite.config.ts
plugins: [
  pikacss() // Must be present
]
```

2. **Verify file generation:**
```bash
# Run dev mode first to generate files
pnpm dev
# Then build
pnpm build
```

3. **Check for syntax errors:**
```typescript
// pika.config.ts
export default defineEngineConfig({
  // Make sure no syntax errors
})
```

#### Solutions

- Add PikaCSS plugin to build configuration
- Run dev mode once before building
- Fix any syntax errors in config
- Clear cache: `rm -rf node_modules/.vite`

### Issue: TypeScript Errors

#### Symptom
```typescript
Property 'pika' does not exist on type 'Window'
```

#### Debugging Steps

1. **Check reference directive:**
```typescript
/// <reference path="./src/pika.gen.ts" />
```

2. **Verify in tsconfig.json:**
```json
{
  "include": ["src/**/*", "pika.gen.ts"]
}
```

3. **Check file generation:**
```bash
cat src/pika.gen.ts
```

#### Solutions

- Add reference directive to config or entry file
- Update `tsconfig.json` include patterns
- Restart TypeScript server
- Regenerate files: `rm src/pika.gen.ts && pnpm dev`

### Issue: Styles Flicker (FOUC)

#### Symptom
Flash of Unstyled Content on page load.

#### Debugging Steps

1. **Check CSS loading order:**
```html
<head>
  <!-- PikaCSS should load early -->
  <link rel="stylesheet" href="/pika.gen.css">
</head>
```

2. **Verify critical CSS:**
```typescript
// Check if CSS is inlined or loaded externally
```

#### Solutions

- Inline critical CSS in HTML head
- Use preload hint: `<link rel="preload" href="/pika.gen.css">`
- Ensure CSS loads before JavaScript
- For SSR: Import CSS in layout component

### Issue: HMR Not Working

#### Symptom
Changes to styles don't hot reload.

#### Debugging Steps

1. **Check plugin configuration:**
```typescript
plugins: [
  pikacss({
    scan: {
      include: ['src/**/*.{ts,tsx}'] // Must include your files
    }
  })
]
```

2. **Verify file watching:**
```bash
# Check if files are being watched
# Output should show file changes
```

3. **Check browser console:**
```
[vite] hmr update /src/Component.tsx
```

#### Solutions

- Ensure files are in `scan.include` pattern
- Restart dev server
- Clear browser cache
- Check for syntax errors blocking HMR

### Issue: Wrong Styles Applied

#### Symptom
Styles different from expected.

#### Debugging Steps

1. **Check CSS specificity:**
```css
/* More specific selector wins */
.parent .child { color: blue; } /* Wins over */
.child { color: red; }
```

2. **Inspect element in DevTools:**
   - Which styles are applied?
   - Which are overridden?
   - Check specificity

3. **Check for !important:**
```css
.other { color: green !important; } /* Overrides everything */
```

#### Solutions

- Use `__important: true` to override
- Increase specificity with selectors
- Check for conflicting global styles
- Use `$.classname` for more specific selectors

## Debugging Workflow

### Step-by-Step Debugging Process

1. **Verify Files Generated**
```bash
ls src/pika.gen.css src/pika.gen.ts
```

2. **Check Import**
```typescript
import 'pika.css' // Present in entry?
```

3. **Inspect Element**
   - Right-click → Inspect
   - Check classes applied
   - Check computed styles

4. **Check Network**
   - Is CSS loaded?
   - Status 200?
   - Non-zero size?

5. **Check Console**
   - Any errors?
   - Any warnings?

6. **Check Sources**
   - Is code transformed?
   - Are pika() calls replaced?

7. **Check Config**
   - Plugin loaded?
   - Scan patterns correct?
   - Syntax errors?

## Best Practices for Testing

1. ✅ **Test computed styles**, not class names
2. ✅ **Use data-testid** for reliable selectors
3. ✅ **Test behavior**, not implementation
4. ✅ **Use E2E for visual testing**
5. ✅ **Mock styles in unit tests** when needed
6. ✅ **Test responsive behavior** with viewport changes
7. ✅ **Visual regression testing** for critical components
8. ✅ **Test accessibility** alongside styles

## Advanced Debugging Tools

### Custom Debug Component

```tsx
// DebugStyles.tsx
export function DebugStyles({ children, label }: { 
  children: React.ReactNode
  label?: string 
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const styles = window.getComputedStyle(ref.current)
      console.group(label || 'Debug Styles')
      console.log('Classes:', ref.current.className)
      console.log('Computed styles:', {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        padding: styles.padding,
        margin: styles.margin
      })
      console.groupEnd()
    }
  }, [label])

  return <div ref={ref}>{children}</div>
}

// Usage
<DebugStyles label="My Button">
  <Button>Click me</Button>
</DebugStyles>
```

### Style Inspector Hook

```typescript
// useStyleDebug.ts
export function useStyleDebug(ref: RefObject<HTMLElement>, enabled = true) {
  useEffect(() => {
    if (!enabled || !ref.current) return

    const el = ref.current
    const styles = window.getComputedStyle(el)

    console.group('Style Debug')
    console.log('Element:', el)
    console.log('Classes:', el.className)
    console.log('Styles:', {
      display: styles.display,
      position: styles.position,
      width: styles.width,
      height: styles.height,
      padding: styles.padding,
      margin: styles.margin,
      backgroundColor: styles.backgroundColor,
      color: styles.color
    })
    console.groupEnd()
  }, [ref, enabled])
}

// Usage
const ref = useRef<HTMLDivElement>(null)
useStyleDebug(ref, process.env.NODE_ENV === 'development')

return <div ref={ref} className={pika({ color: 'red' })}>Debug me</div>
```

## Troubleshooting Checklist

When something goes wrong, check:

- [ ] `pika.gen.css` exists and is non-empty
- [ ] `pika.gen.ts` exists and exports `pika` function
- [ ] `import 'pika.css'` is present in entry file
- [ ] Plugin is configured in build tool
- [ ] Files are in `scan.include` patterns
- [ ] No syntax errors in `pika.config.ts`
- [ ] TypeScript reference is present
- [ ] Dev server is running (for HMR)
- [ ] Browser cache is cleared
- [ ] CSS is loaded in Network tab
- [ ] Elements have class names
- [ ] Computed styles are correct
- [ ] No conflicting CSS
- [ ] Console has no errors

## Getting Help

If you're still stuck:

1. Check [GitHub Issues](https://github.com/pikacss/pikacss/issues)
2. Review [API Reference](/advanced/api-reference)
3. Ask in [GitHub Discussions](https://github.com/pikacss/pikacss/discussions)
4. Provide:
   - PikaCSS version
   - Build tool and version
   - Framework and version
   - Minimal reproduction
   - Error messages
   - Configuration files

## Next Steps

- Review [Troubleshooting Guide](/advanced/troubleshooting) for more solutions
- Check [Performance Guide](/advanced/performance) for optimization
- Explore [Examples](/examples/components) for working patterns

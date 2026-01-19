# Troubleshooting & Common Issues

Solutions for common problems encountered while using PikaCSS.

## Table of Contents

- [Setup & Installation Issues](#setup--installation-issues)
- [Styling Not Applied](#styling-not-applied)
- [Build Errors](#build-errors)
- [TypeScript Issues](#typescript-issues)
- [Framework Integration Issues](#framework-integration-issues)
- [Performance Issues](#performance-issues)
- [Advanced Troubleshooting](#advanced-troubleshooting)

---

## Setup & Installation Issues

### Module Not Found Error

**Problem:**
```
Error: Cannot find module '@pikacss/core'
```

**Solution:**

1. Verify installation:
```bash
npm list @pikacss/core
# or
pnpm list @pikacss/core
```

2. Reinstall if missing:
```bash
npm install @pikacss/core
# or
pnpm add @pikacss/core
```

3. Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Version Mismatch

**Problem:**
```
Error: Incompatible PikaCSS version
```

**Solution:**

Ensure all PikaCSS packages use the same version:

```json
{
  "dependencies": {
    "@pikacss/core": "^0.0.39",
    "@pikacss/unplugin-pikacss": "^0.0.39",
    "@pikacss/plugin-icons": "^0.0.39"
  }
}
```

Update to latest:
```bash
npm update @pikacss/*
```

---

### Configuration File Not Found

**Problem:**
```
Error: Cannot find pika.config.ts
```

**Solution:**

Create `pika.config.ts` in project root:

```typescript
// pika.config.ts
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  prefix: 'app-',
})
```

Ensure it's in the correct location (project root, not src/).

---

## Styling Not Applied

### CSS File Not Imported

**Problem:**
- Styles are generated but not visible in browser
- `pika()` returns class names but no CSS

**Solution:**

Import the generated CSS in your entry file:

```typescript
// main.ts or main.tsx
import 'pika.css'

// Then rest of your code
import App from './App'
```

**For different frameworks:**

```typescript
// Next.js (pages/_app.tsx or app/layout.tsx)
import 'pika.css'

// Nuxt (nuxt.config.ts)
css: ['pika.css']

// Vite (main.ts)
import 'pika.css'

// Webpack (entry.js)
require('pika.css')
```

---

### Generated Files Not Found

**Problem:**
```
Error: pika.gen.css not found
Error: pika.gen.ts not found
```

**Solution:**

1. Run build:
```bash
npm run build
# or
pnpm build
```

2. Check build output:
```bash
ls src/pika.gen.*
# or
ls dist/pika.gen.*
```

3. Verify bundler plugin is configured:

```typescript
// vite.config.ts
import pikacss from '@pikacss/unplugin-pikacss/vite'

export default {
  plugins: [pikacss()]
}
```

4. Check pika.config.ts exists in root

---

### Specificity Issues

**Problem:**
- Styles applied but overridden by other styles
- CSS cascade not working as expected

**Solution:**

PikaCSS generates atomic classes with low specificity. If other styles override them:

```typescript
// ❌ Problem: Other stylesheet has higher specificity
// some-library.css: .card { color: red !important; }
<div className={pika({ color: 'blue' })}>Text</div>  // Doesn't work

// ✅ Solution 1: Reorder stylesheet imports
import 'pika.css'  // Import after other libraries
import 'some-library.css'

// ✅ Solution 2: Use inline styles for overrides
<div 
  className={pika({ color: 'var(--color)' })}
  style={{ '--color': 'blue' }}
>
  Text
</div>

// ✅ Solution 3: Use !important if necessary
<div className={pika({ color: 'blue !important' })}>
  Text
</div>
```

---

## Build Errors

### Configuration Parsing Error

**Problem:**
```
SyntaxError: Unexpected token in JSON at position 0
```

**Solution:**

Check pika.config.ts syntax:

```typescript
// ❌ Wrong - invalid JavaScript
export default defineEngineConfig({
  shortcuts: [
    ['btn', { invalid }]  // Syntax error
  ]
})

// ✅ Correct
export default defineEngineConfig({
  shortcuts: {
    shortcuts: [
      ['btn', { padding: '1rem' }]
    ]
  }
})
```

---

### Build Plugin Not Running

**Problem:**
- `pika.gen.css` not generated
- Bundler output doesn't include PikaCSS

**Solution:**

Verify plugin configuration:

```typescript
// vite.config.ts
import pikacss from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    pikacss(),  // Must be before other plugins
    react(),
  ]
})
```

Check import order: PikaCSS plugin should be first.

---

### Memory or Timeout Errors

**Problem:**
```
Error: JavaScript heap out of memory
Error: Build timeout exceeded
```

**Solution:**

1. Increase Node.js memory:
```bash
node --max-old-space-size=4096 <build-command>
```

2. Check for infinite loops in shortcuts:
```typescript
// ❌ Problem: Circular shortcut reference
shortcuts: [
  ['btn', { __shortcut: 'btn-base' }],
  ['btn-base', { __shortcut: 'btn' }],  // Infinite loop!
]

// ✅ Correct: Linear chain
shortcuts: [
  ['btn', { padding: '1rem' }],
  ['btn-base', { __shortcut: 'btn' }],
]
```

3. Optimize shortcuts regex:
```typescript
// ❌ Inefficient
shortcuts: [
  [/.*/, () => ({ color: 'red' })]  // Too broad!
]

// ✅ Better
shortcuts: [
  [/^color-(\w+)$/, ([, color]) => ({ color })]  // Specific pattern
]
```

---

## TypeScript Issues

### pika.gen.ts Not Found

**Problem:**
```
error TS2307: Cannot find module 'pika.gen.ts'
```

**Solution:**

Add reference comment to config file:

```typescript
// pika.config.ts
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  // ...
})
```

Ensure build has generated the file:
```bash
npm run build
```

---

### No Autocomplete for CSS Properties

**Problem:**
- IDE doesn't suggest CSS properties
- No type hints for pika()

**Solution:**

1. Verify reference path:
```typescript
/// <reference path="./src/pika.gen.ts" />
```

2. Build to generate types:
```bash
npm run build
```

3. Restart IDE to reload types

4. Check tsconfig.json includes correct path:
```json
{
  "include": ["src"]
}
```

---

### Type Errors in Config

**Problem:**
```
Type 'string' is not assignable to type 'CSSProperties'
```

**Solution:**

Ensure property names are valid CSS:

```typescript
// ❌ Wrong: invalid property name
shortcuts: [
  ['card', {
    invalid-prop: '1rem',  // Syntax error
  }]
]

// ✅ Correct: valid CSS property (camelCase)
shortcuts: [
  ['card', {
    padding: '1rem',
    marginTop: '2rem',
  }]
]
```

---

## Framework Integration Issues

### Vite: Module Not Updating on Changes

**Problem:**
- Changes to pika.config.ts not reflected
- Dev server shows stale styles

**Solution:**

1. Restart dev server:
```bash
npm run dev
```

2. Check HMR is enabled in vite.config.ts:
```typescript
export default {
  server: {
    hmr: true
  }
}
```

3. Clear Vite cache:
```bash
rm -rf .vite
npm run dev
```

---

### Nuxt: Styles Not Loading

**Problem:**
- Nuxt project doesn't include PikaCSS styles
- pika.css not found in build output

**Solution:**

1. Verify module configured:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pikacss/nuxt-pikacss']
})
```

2. Check pika.config.ts in root:
```bash
ls pika.config.ts
```

3. Rebuild Nuxt:
```bash
rm -rf .nuxt dist
npm run build
```

---

### Webpack: Plugin Errors

**Problem:**
```
TypeError: pikacss is not a function
```

**Solution:**

Use correct import for Webpack:

```typescript
// webpack.config.mjs
import pikacss from '@pikacss/unplugin-pikacss/webpack'

export default {
  plugins: [pikacss()]
}
```

For CommonJS:
```javascript
// webpack.config.js
const pikacss = require('@pikacss/unplugin-pikacss/webpack').default

module.exports = {
  plugins: [pikacss()]
}
```

---

## Performance Issues

### Large CSS Output

**Problem:**
- Generated pika.gen.css is too large
- Page load is slow

**Solution:**

1. Use shortcuts to reduce duplication:
```typescript
// ❌ Before: All styles inline
pika({ display: 'flex', gap: '1rem', padding: '1rem' })
pika({ display: 'flex', gap: '1rem', padding: '1rem' })
pika({ display: 'flex', gap: '1rem', padding: '1rem' })

// ✅ After: Define once, reuse
shortcuts: [
  ['card', { display: 'flex', gap: '1rem', padding: '1rem' }]
]
pika('card')
pika('card')
pika('card')
```

2. Disable preflights if not needed:
```typescript
export default defineEngineConfig({
  disable: {
    preflight: true
  }
})
```

3. Tree-shake unused styles (if using build tool that supports it):
```typescript
// Only styles used in pika() calls are included
// Unused shortcuts are removed
```

---

### TypeScript Compilation Slow

**Problem:**
- Type checking takes too long
- IDE becomes unresponsive

**Solution:**

1. Split configuration:
```typescript
// pika.config.ts (smaller for faster type checking)
export default defineEngineConfig({
  prefix: 'app-'
})

// pika.shortcuts.ts (separate file for shortcuts)
export const shortcuts = [...]
```

2. Limit reference scope:
```typescript
/// <reference path="./src/pika.gen.ts" />
```

3. Use type narrowing:
```typescript
import type { CSSProperties } from '@pikacss/core'

// Explicitly type to avoid inference overhead
const myStyles: CSSProperties = { color: 'red' }
```

---

## Advanced Troubleshooting

### pika() Calls Not Being Scanned

**Problem:**
- Some `pika()` calls aren't generating CSS
- Generated classes are missing for some components

**Solution:**

Ensure pika() calls are statically analyzable:

```typescript
// ❌ Won't be scanned: inside template string
const className = `${pika({ color: 'red' })}`

// ✅ Will be scanned: direct usage
const className = pika({ color: 'red' })
```

- Not inside variable interpolation
- Not inside template expressions
- Direct function calls only

---

### Custom Plugins Not Loading

**Problem:**
```
Error: Plugin not found or failed to load
```

**Solution:**

1. Verify plugin export:
```typescript
// my-plugin.ts
export const myPlugin = defineEnginePlugin({
  name: 'my-plugin',
  async configureEngine(engine) {
    // Plugin logic
  }
})
```

2. Register in config:
```typescript
import { myPlugin } from './my-plugin'

export default defineEngineConfig({
  plugins: [myPlugin()]
})
```

3. Check plugin order:
```typescript
plugins: [
  prePlugins(),    // order: 'pre'
  normalPlugins(), // no order specified
  postPlugins(),   // order: 'post'
]
```

---

### Build-Time Evaluation Failures

**Problem:**
```
Error: Cannot evaluate pika() call at build time
```

**Solution:**

Ensure all arguments are evaluable at build time:

```typescript
// ❌ Not evaluable: runtime prop
const myStyles = pika({ color: props.color })

// ✅ Evaluable: static string
const myStyles = pika({ color: 'red' })

// ✅ Evaluable: module-level constant
const COLOR = 'red'
const myStyles = pika({ color: COLOR })

// ✅ Evaluable: template with static values
const myStyles = pika({
  color: `rgb(255, 0, 0)`
})

// ❌ Not evaluable: function call
const myStyles = pika({ color: getColor() })
```

---

### Icons Not Displaying

**Problem:**
- Icon plugin loaded but no icons show
- Icon class names appear but no SVG

**Solution:**

1. Verify plugin loaded:
```typescript
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
  plugins: [icons()]
})
```

2. Check icon name format:
```typescript
// Format: i-<library>:<icon-name>
pika('i-mdi:home')           // ✅ Correct
pika('i-heroicons:star')     // ✅ Correct
pika('i-home')               // ❌ Missing library
pika('mdi:home')             // ❌ Missing prefix
```

3. Verify icon exists:
- Check https://icones.js.org/
- Ensure library is installed
- Try alternative icon names

4. Check CSS is loaded:
```bash
# Verify pika.css includes icon styles
grep "i-" pika.gen.css
```

---

## Getting More Help

If your issue isn't listed here:

1. **Check the Complete API Reference**: [api-reference.md](./api-reference.md)
2. **Review Code Examples**: [examples.md](./examples.md)
3. **Check Plugin Hooks**: [plugin-hooks.md](./plugin-hooks.md)
4. **Development Debugging**: For build/dev issues, see pikacss-dev debugging guide
5. **Report Issues**: Open an issue at https://github.com/anomalyco/pikacss/issues

---

## Performance Checklist

- [ ] pika.css is imported in entry file
- [ ] Using shortcuts for repeated styles
- [ ] Using CSS variables for dynamic values
- [ ] TypeScript reference added to config
- [ ] Build completes without errors
- [ ] Dev server HMR works on changes
- [ ] CSS size is reasonable (check pika.gen.css)
- [ ] No console errors in browser DevTools
- [ ] Styles apply correctly to components

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module 'pika.css'` | CSS not imported | Add `import 'pika.css'` to entry file |
| `pika is not defined` | Forgot to import pika | Add `import { pika } from '@pikacss/core'` |
| `Module not found: @pikacss/core` | Package not installed | Run `npm install @pikacss/core` |
| `SyntaxError in pika.config.ts` | Invalid config syntax | Check TypeScript/JavaScript syntax |
| `Cannot find pika.gen.ts` | Types not generated | Run build: `npm run build` |
| `Styles not appearing` | CSS not imported or specificity issue | Check import order, verify class names in CSS |


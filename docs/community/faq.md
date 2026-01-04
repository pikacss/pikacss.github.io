---
title: FAQ
description: Frequently Asked Questions about PikaCSS
outline: deep
---

# Frequently Asked Questions

## General Questions

### What is PikaCSS?

PikaCSS is an Atomic CSS-in-JS engine that lets you write styles using familiar CSS-in-JS syntax while outputting optimized Atomic CSS. It combines the developer experience of CSS-in-JS with the performance benefits of Atomic CSS, all with zero runtime overhead.

### How is PikaCSS different from Tailwind CSS?

**PikaCSS:**
- Write standard CSS property names
- CSS-in-JS syntax (objects, not classes)
- No utility class names to memorize
- Full TypeScript autocomplete for CSS properties

**Tailwind:**
- Utility class names (`flex`, `items-center`)
- Classes in HTML/JSX
- Requires learning utility naming conventions
- Autocomplete for class names

See [Comparison Guide](/getting-started/comparison) for detailed comparison.

### Is PikaCSS production-ready?

PikaCSS is still in active development (v0.x). The API may change before v1.0. However, it's being used in production projects. We recommend:

- ✅ Use for new projects willing to adapt to changes
- ⚠️ Pin versions and test thoroughly before upgrading
- ❌ Not recommended for critical production apps yet (until v1.0)

### Can I use PikaCSS with any framework?

Yes! PikaCSS is framework-agnostic and works with:

- React, Vue, Svelte, Solid
- Next.js, Nuxt, SvelteKit, Remix, Astro
- Vanilla JavaScript
- Any framework that supports CSS classes

### Does PikaCSS work with SSR/SSG?

Yes! PikaCSS works perfectly with Server-Side Rendering and Static Site Generation because all transformations happen at build time. See [SSR/SSG Guide](/advanced/ssr).

## Technical Questions

### Why can't I use runtime variables?

PikaCSS transforms styles at **build time**, not runtime. This means:

```tsx
// ❌ Won't work - runtime variable
const color = getUserColor()
pika({ color }) // ERROR

// ✅ Solution - Use CSS variables
pika({ color: 'var(--user-color)' })
// Set at runtime:
<div style={{ '--user-color': color }} />
```

**Why?** Build-time transformation ensures:
- Zero runtime overhead
- Optimal bundle size
- Better performance

### How do I handle dynamic styling?

Use one of these approaches:

**1. CSS Variables (Recommended)**
```tsx
pika({ backgroundColor: 'var(--dynamic-bg)' })
<div style={{ '--dynamic-bg': userColor }} />
```

**2. Conditional Shortcuts**
```tsx
const classes = {
  primary: pika('btn-primary'),
  secondary: pika('btn-secondary')
}
<button className={classes[variant]} />
```

**3. Multiple `pika()` Calls**
```tsx
const baseStyles = pika({ padding: '1rem' })
const variantStyles = variant === 'primary' 
  ? pika({ backgroundColor: 'blue' })
  : pika({ backgroundColor: 'gray' })

<button className={`${baseStyles} ${variantStyles}`} />
```

### How do atomic classes work?

PikaCSS generates one class per CSS property-value pair:

```typescript
pika({
  color: 'red',
  fontSize: '16px',
  padding: '1rem'
})
// Generates: "a b c"

// CSS Output:
// .a { color: red; }
// .b { font-size: 16px; }
// .c { padding: 1rem; }
```

**Benefits:**
- Automatic deduplication (same styles reuse classes)
- Small CSS bundle (each style defined once)
- Efficient caching

### Can I inspect generated class names?

Yes! Check the generated files:

```bash
# CSS output
cat src/pika.gen.css

# TypeScript definitions
cat src/pika.gen.ts
```

Or use browser DevTools to inspect elements.

**Note:** Don't rely on specific class names - they're implementation details and may change.

### How do I debug styles?

1. **Check generated files exist**
   ```bash
   ls src/pika.gen.{css,ts}
   ```

2. **Verify CSS is imported**
   ```tsx
   import 'pika.css' // Must be present
   ```

3. **Inspect in browser**
   - DevTools → Elements → Check applied styles
   - DevTools → Network → Verify CSS loaded

4. **Check computed styles**
   ```javascript
   const el = document.querySelector('.my-el')
   console.log(window.getComputedStyle(el))
   ```

See [Testing & Debugging Guide](/advanced/testing) for more.

### Why are my TypeScript types not working?

**Solutions:**

1. **Add reference directive**
   ```typescript
   /// <reference path="./src/pika.gen.ts" />
   ```

2. **Update tsconfig.json**
   ```json
   {
     "include": ["src/**/*", "pika.gen.ts"]
   }
   ```

3. **Restart TypeScript server**
   - VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

4. **Regenerate files**
   ```bash
   rm src/pika.gen.ts
   pnpm dev
   ```

### Can I use PikaCSS without TypeScript?

Yes! TypeScript is optional, but highly recommended for:
- CSS property autocomplete
- Type safety
- Better developer experience

Without TypeScript, you'll still get:
- Full functionality
- Build-time transformation
- Atomic CSS output

## Usage Questions

### How do I add custom shortcuts?

Define shortcuts in `pika.config.ts`:

```typescript
export default defineEngineConfig({
  shortcuts: {
    shortcuts: [
      // Static shortcut
      ['btn', {
        padding: '0.5rem 1rem',
        borderRadius: '0.25rem'
      }],
      
      // Dynamic shortcut
      [/^m-(\d+)$/, m => ({ margin: `${m[1]}px` }), ['m-4', 'm-8']]
    ]
  }
})
```

See [Shortcuts Guide](/guide/shortcuts) for more.

### Can I use pseudo-classes like :hover?

Yes! Use `$` to represent the current element:

```typescript
pika({
  'color': 'blue',
  '$:hover': {
    color: 'red'
  },
  '$:focus': {
    outline: '2px solid blue'
  }
})
```

See [Selectors Guide](/guide/selectors) for more.

### How do I add global styles?

Use `preflights` in config:

```typescript
export default defineEngineConfig({
  preflights: [
    '* { box-sizing: border-box; }',
    ':root { --primary: #3b82f6; }',
    '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }'
  ]
})
```

### Can I use media queries?

Yes!

```typescript
pika({
  'width': '100%',
  '@media (min-width: 768px)': {
    width: '50%'
  },
  '@media (min-width: 1024px)': {
    width: '33.333%'
  }
})
```

### How do I implement dark mode?

Use `prefers-color-scheme` media query:

```typescript
pika({
  'backgroundColor': '#ffffff',
  'color': '#000000',
  '@media (prefers-color-scheme: dark)': {
    backgroundColor: '#000000',
    color: '#ffffff'
  }
})
```

Or use CSS variables:

```typescript
// In preflights:
`:root {
  --bg: #ffffff;
  --text: #000000;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000000;
    --text: #ffffff;
  }
}`

// In components:
pika({
  backgroundColor: 'var(--bg)',
  color: 'var(--text)'
})
```

### Can I use animations?

Yes! Define keyframes in preflights:

```typescript
export default defineEngineConfig({
  preflights: [
    `@keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }`
  ]
})
```

Then use:

```typescript
pika({
  animation: 'spin 1s linear infinite'
})
```

### How do I share styles between components?

Use shortcuts:

```typescript
// pika.config.ts
shortcuts: [
  ['card-base', {
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }]
]

// Component A
pika('card-base', { backgroundColor: 'white' })

// Component B
pika('card-base', { backgroundColor: 'gray' })
```

## Performance Questions

### What's the CSS bundle size?

PikaCSS generates very small CSS bundles due to Atomic CSS deduplication:

- Small app: 5-20 KB
- Medium app: 20-50 KB  
- Large app: 50-100 KB

Much smaller than traditional CSS-in-JS!

### Does PikaCSS affect build time?

Build time impact is minimal:

- **Initial build:** Slightly longer (scanning + transformation)
- **Incremental builds:** Fast (only changed files)
- **HMR:** Very fast (instant style updates)

See [Performance Guide](/advanced/performance) for optimization tips.

### How can I optimize performance?

1. **Limit file scanning**
   ```typescript
   scan: {
     include: ['src/**/*.{ts,tsx}'],
     exclude: ['**/*.test.ts']
   }
   ```

2. **Use shortcuts** for repeated styles
3. **Inline critical CSS** for faster FCP
4. **Enable CSS minification** in production

See [Performance Guide](/advanced/performance) for more.

### Is there runtime overhead?

No! PikaCSS has **zero runtime overhead**. Everything happens at build time:

- No JavaScript in your bundle for styling
- No runtime style injection
- No style computation at runtime
- Pure CSS classes

## Plugin Questions

### What plugins are available?

**Official plugins:**

- `@pikacss/plugin-icons` - 100,000+ icons from Iconify
- `@pikacss/plugin-reset` - CSS reset options
- `@pikacss/plugin-typography` - Typography system

See [Plugin System](/guide/plugin-system) for more.

### How do I create a custom plugin?

See [Plugin Development Guide](/advanced/plugin-development) for complete instructions.

Quick start:

```bash
pnpm newplugin my-plugin
```

### Can I publish my plugin?

Yes! We encourage community plugins:

1. Create your plugin
2. Add tests and documentation
3. Publish to npm as `@your-org/pikacss-plugin-name`
4. Share in GitHub Discussions

## Troubleshooting

### Styles not applied?

Check:
- [ ] `import 'pika.css'` is present
- [ ] `pika.gen.css` exists
- [ ] Plugin is configured in build tool
- [ ] CSS is loaded (check Network tab)
- [ ] No CSS conflicts

See [Troubleshooting Guide](/advanced/troubleshooting) for more.

### Build fails?

Check:
- [ ] Plugin is in build config
- [ ] No syntax errors in `pika.config.ts`
- [ ] Files match `scan.include` patterns
- [ ] Dependencies are installed

### HMR not working?

Check:
- [ ] Files are in `scan.include`
- [ ] Dev server is running
- [ ] No syntax errors blocking HMR
- [ ] Browser cache is cleared

## Migration Questions

### How do I migrate from Tailwind?

See [Migration Guide](/guide/migration#from-tailwind-css) for step-by-step instructions.

**Quick comparison:**

```html
<!-- Tailwind -->
<div class="flex items-center justify-center p-4">

<!-- PikaCSS -->
<div className={pika({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem'
})}>
```

### Can I use PikaCSS alongside other CSS solutions?

Yes, but not recommended for the same components. PikaCSS works best when used exclusively or in clearly separated areas.

**OK:**
- PikaCSS for new features + existing CSS for legacy code
- PikaCSS for app + Tailwind for marketing pages

**Not recommended:**
- Mixing in same component
- Overlapping utility classes

## Contributing

### How can I contribute?

Many ways to help:

- Report bugs
- Suggest features
- Fix issues
- Improve docs
- Create plugins
- Help others

See [Contributing Guide](/community/contributing) for details.

### Where should I report bugs?

[GitHub Issues](https://github.com/pikacss/pikacss/issues/new)

Include:
- Description
- Reproduction
- Expected vs actual behavior
- Environment details

### Can I suggest features?

Yes! Start a [GitHub Discussion](https://github.com/pikacss/pikacss/discussions/new) to discuss your idea.

## Still Have Questions?

- 📖 Check [Documentation](/guide/basics)
- 💬 Ask in [GitHub Discussions](https://github.com/pikacss/pikacss/discussions)
- 🐛 Report bugs in [GitHub Issues](https://github.com/pikacss/pikacss/issues)
- 📧 Contact maintainers (see GitHub profile)

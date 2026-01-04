---
title: Performance Optimization
description: Optimize PikaCSS for maximum performance and minimal bundle size
outline: deep
---

# Performance Optimization

PikaCSS is designed for optimal performance by default, but there are strategies to further optimize your setup for production.

## Build-Time Performance

### 1. Optimize File Scanning

Limit the files PikaCSS needs to scan:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    pikacss({
      scan: {
        // ✅ Only scan necessary directories
        include: ['src/**/*.{ts,tsx,vue}'],
        
        // ✅ Explicitly exclude large directories
        exclude: [
          'node_modules/**',
          'dist/**',
          'coverage/**',
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}'
        ]
      }
    })
  ]
})
```

**Impact**: Faster builds and HMR (Hot Module Replacement)

### 2. Use Shortcuts Wisely

**❌ Bad - Duplicate styles everywhere:**
```tsx
// Repeated in many components
<button className={pika({
  padding: '0.5rem 1rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  borderRadius: '0.25rem',
  cursor: 'pointer'
})} />
```

**✅ Good - Define once, reuse everywhere:**
```typescript
// pika.config.ts
shortcuts: [
  ['btn', {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.25rem',
    cursor: 'pointer'
  }]
]
```

```tsx
// Usage
<button className={pika('btn')} />
```

**Benefits**:
- Faster build time (less code to analyze)
- Smaller source code
- Better maintainability

### 3. Minimize Dynamic Shortcuts

**❌ Slower - Complex regex patterns:**
```typescript
shortcuts: [
  // This runs on every potential match
  [/^m-(\d+)$/, m => ({
    margin: `${m[1]}px`,
    padding: `${m[1]}px`,
    // ... complex logic
  }), ['m-4', 'm-8', 'm-16', /* ... hundreds of options */]]
]
```

**✅ Faster - Static shortcuts when possible:**
```typescript
shortcuts: [
  ['m-4', { margin: '4px' }],
  ['m-8', { margin: '8px' }],
  ['m-16', { margin: '16px' }],
  // Only create what you actually use
]
```

## Runtime Performance

### 1. CSS Bundle Size

PikaCSS automatically generates atomic CSS, which is highly optimized:

```css
/* Each property-value pair becomes a unique class */
.a { color: red; }
.b { font-size: 16px; }
.c { padding: 1rem; }

/* Reused across your entire application */
<div class="a b c">...</div>
<span class="a">...</span>  <!-- "a" reused -->
```

**Automatic optimizations:**
- ✅ Deduplication (same styles share classes)
- ✅ Short class names (`.a`, `.b`, `.c`)
- ✅ Minimal specificity (single class selectors)

### 2. Analyzing Bundle Size

Check your generated CSS file:

```bash
# View generated CSS size
ls -lh src/pika.gen.css

# Or use a bundler analyzer
pnpm add -D vite-bundle-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    pikacss(),
    visualizer({ open: true })
  ]
})
```

### 3. Minimize Unused Styles

PikaCSS only generates CSS for styles you actually use:

```typescript
// pika.config.ts with unused shortcuts
shortcuts: [
  ['btn-primary', { /* used */ }],
  ['btn-secondary', { /* used */ }],
  ['btn-tertiary', { /* NEVER USED - still in config */ }],  // ❌
]
```

**Solution**: Regularly audit and remove unused shortcuts

```bash
# Search for shortcut usage
grep -r "btn-tertiary" src/
# If no results, remove from config
```

## Loading Performance

### 1. Critical CSS Inline

For optimal First Contentful Paint (FCP):

```html
<!-- Inline critical CSS in HTML head -->
<head>
  <style>
    /* Inline pika.gen.css content */
    .a{color:red}.b{font-size:16px}...
  </style>
</head>
```

**Next.js example:**
```tsx
// app/layout.tsx
import fs from 'fs'
import path from 'path'

// Read generated CSS at build time
const pikaCSS = fs.readFileSync(
  path.join(process.cwd(), 'src/pika.gen.css'),
  'utf-8'
)

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: pikaCSS }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Benefits:**
- ⚡ Eliminates CSS request
- ⚡ Faster FCP
- ⚡ No render-blocking CSS

**Trade-off:** Slightly larger HTML (usually worth it for critical styles)

### 2. Preload CSS

If not inlining, preload for faster loading:

```html
<head>
  <link rel="preload" href="/pika.gen.css" as="style">
  <link rel="stylesheet" href="/pika.gen.css">
</head>
```

### 3. CSS Minification

Enable CSS minification in production:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    cssMinify: true // Default in production
  }
})
```

PikaCSS output is already minimal, but minification removes whitespace:

```css
/* Before minification */
.a { color: red; }
.b { font-size: 16px; }

/* After minification */
.a{color:red}.b{font-size:16px}
```

## Code Splitting Strategies

### 1. Route-Based Splitting (Automatic)

Most bundlers automatically split CSS by route:

```typescript
// pages/index.tsx
<div className={pika({ color: 'red' })} />

// pages/about.tsx
<div className={pika({ color: 'blue' })} />
```

Each route gets only the CSS it needs (automatic with PikaCSS's atomic approach).

### 2. Component-Based Splitting

Use dynamic imports for large components:

```tsx
// Heavy component loaded on-demand
const HeavyFeature = lazy(() => import('./HeavyFeature'))

function App() {
  return (
    <Suspense fallback={<div className={pika({ padding: '2rem' })}>Loading...</div>}>
      <HeavyFeature />
    </Suspense>
  )
}
```

### 3. Preflight Optimization

Move global styles to preflights:

```typescript
// pika.config.ts
export default defineEngineConfig({
  preflights: [
    // ✅ Good - Global CSS in preflights
    `* { box-sizing: border-box; margin: 0; padding: 0; }`,
    `:root { 
      --color-primary: #3b82f6;
      --color-secondary: #6b7280;
    }`
  ]
})
```

**Don't** use pika() for truly global styles:

```tsx
// ❌ Bad - Global styles via pika()
const globalStyles = pika({
  '*': {
    boxSizing: 'border-box',
    margin: '0',
    padding: '0'
  }
})
```

## Developer Experience Optimization

### 1. Hot Module Replacement (HMR)

PikaCSS supports HMR out of the box. Optimize by:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: true // Enabled by default
  },
  plugins: [
    pikacss({
      // Faster HMR with focused scanning
      scan: {
        include: ['src/**/*.{ts,tsx}']
      }
    })
  ]
})
```

### 2. TypeScript Performance

Generated `pika.gen.ts` provides autocomplete. Keep it fast:

```typescript
// pika.config.ts
export default defineEngineConfig({
  // ✅ Limit shortcuts to what you need
  shortcuts: {
    shortcuts: [
      // 50 shortcuts: Fast
      // 500 shortcuts: Slower TypeScript
      // 5000 shortcuts: Very slow
    ]
  }
})
```

**Rule of thumb**: Keep shortcuts under 200 for optimal TypeScript performance.

### 3. Build Tool Caching

Enable persistent caching:

```typescript
// vite.config.ts
export default defineConfig({
  cacheDir: '.vite-cache', // Cache build artifacts
  optimizeDeps: {
    force: false // Use cache when possible
  }
})
```

## Production Optimization Checklist

- [ ] **Scan Optimization**: Limit `include` patterns to necessary files
- [ ] **Exclude Tests**: Don't scan test files (`**/*.test.ts`)
- [ ] **Use Shortcuts**: Extract repeated styles into shortcuts
- [ ] **Remove Unused Shortcuts**: Audit and clean config regularly
- [ ] **CSS Minification**: Enable in production build
- [ ] **Consider Inlining**: Inline CSS for critical pages
- [ ] **Preload CSS**: If not inlining, add preload hint
- [ ] **Lazy Load**: Use dynamic imports for heavy components
- [ ] **Limit Complexity**: Keep shortcuts under 200
- [ ] **Use Preflights**: Move global styles to preflights
- [ ] **Enable Caching**: Use build tool caching
- [ ] **Monitor Bundle**: Use bundle analyzers

## Measuring Performance

### 1. Build Time

```bash
# Measure build time
time pnpm build
```

### 2. Bundle Size

```bash
# Check generated CSS size
ls -lh dist/assets/*.css

# Check total bundle size
du -sh dist/
```

### 3. Lighthouse Audit

```bash
# Run Lighthouse on production build
pnpm build
pnpm preview
# Open Chrome DevTools > Lighthouse > Run audit
```

**Key metrics to watch:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

### 4. Runtime Performance

```typescript
// Measure style application time
console.time('pika-styles')
const classes = pika({ /* ... */ })
console.timeEnd('pika-styles') // Should be instant (build-time)
```

PikaCSS has **zero runtime cost** - all processing happens at build time.

## Comparison: Before and After Optimization

### Before Optimization

```typescript
// ❌ Scanning everything
scan: { include: ['**/*'] }

// ❌ No shortcuts, repeated styles
<Button className={pika({ 
  padding: '0.5rem 1rem',
  backgroundColor: '#3b82f6',
  color: 'white',
  borderRadius: '0.25rem'
})} />
// Repeated 50+ times across codebase

// ❌ Complex dynamic shortcuts
[/^m-(\d{1,3})$/, m => ({ margin: `${m[1]}px` }), 
  Array.from({length: 1000}, (_, i) => `m-${i}`)] // 1000 suggestions!

// Result:
// - Build time: 8s
// - CSS size: 150KB
// - TypeScript slow
```

### After Optimization

```typescript
// ✅ Focused scanning
scan: { 
  include: ['src/**/*.{ts,tsx}'],
  exclude: ['**/*.test.ts']
}

// ✅ Shortcuts for common patterns
shortcuts: [
  ['btn-primary', {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.25rem'
  }]
]

<Button className={pika('btn-primary')} />

// ✅ Limited dynamic shortcuts
[/^m-(\d+)$/, m => ({ margin: `${m[1]}px` }), 
  ['m-4', 'm-8', 'm-16', 'm-24']] // Only common values

// Result:
// - Build time: 3s (62% faster)
// - CSS size: 45KB (70% smaller)
// - TypeScript fast
```

## Advanced Optimization Techniques

### 1. Conditional Plugin Loading

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    // Only run PikaCSS in development and production builds
    process.env.NODE_ENV !== 'test' && pikacss()
  ].filter(Boolean)
})
```

### 2. Parallel Build Processing

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor and app CSS
          'pika-styles': ['pika.css']
        }
      }
    }
  }
})
```

### 3. CSS Purging (Advanced)

For extremely large applications, consider additional purging:

```bash
pnpm add -D purgecss
```

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    process.env.NODE_ENV === 'production' && require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.{ts,tsx}'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ].filter(Boolean)
}
```

**Note**: Usually not needed due to PikaCSS's atomic nature.

## Troubleshooting Performance Issues

### Issue: Slow Build Times

**Diagnose:**
```bash
# Enable verbose logging
VITE_DEBUG=pikacss pnpm build
```

**Solutions:**
1. Narrow `scan.include` patterns
2. Add more to `scan.exclude`
3. Reduce number of shortcuts
4. Simplify dynamic shortcut patterns

### Issue: Large CSS Bundle

**Diagnose:**
```bash
ls -lh src/pika.gen.css
```

**Solutions:**
1. Remove unused shortcuts
2. Avoid overly specific selectors
3. Use CSS variables instead of many color variations
4. Enable production minification

### Issue: Slow TypeScript

**Diagnose:**
Check `pika.gen.ts` file size:
```bash
wc -l src/pika.gen.ts
```

**Solutions:**
1. Reduce number of shortcuts (< 200)
2. Limit dynamic shortcut autocomplete arrays
3. Restart TypeScript server

## Best Practices Summary

1. ✅ **Scan only what's needed** - Focused include/exclude patterns
2. ✅ **Use shortcuts for repetition** - DRY principle
3. ✅ **Keep shortcuts manageable** - Under 200 for best TypeScript perf
4. ✅ **Inline critical CSS** - For optimal FCP
5. ✅ **Enable minification** - Always in production
6. ✅ **Monitor bundle size** - Regular audits
7. ✅ **Leverage atomic CSS** - Natural deduplication
8. ✅ **Use preflights for globals** - Cleaner separation
9. ✅ **Measure regularly** - Build time, bundle size, Lighthouse
10. ✅ **Profile and iterate** - Continuous optimization

## Next Steps

- Review [Troubleshooting Guide](/advanced/troubleshooting) for common issues
- Explore [SSR/SSG Guide](/advanced/ssr) for server-side optimization
- Check [Examples](/examples/components) for optimized patterns

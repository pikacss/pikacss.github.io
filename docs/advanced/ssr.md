---
title: SSR and SSG Considerations
description: Using PikaCSS with Server-Side Rendering and Static Site Generation
outline: deep
---

# SSR and SSG Considerations

PikaCSS works seamlessly with Server-Side Rendering (SSR) and Static Site Generation (SSG) frameworks because all style transformations happen at build time. This guide covers best practices and framework-specific considerations.

## Why PikaCSS Works Well with SSR/SSG

✅ **Build-Time Transformation**: Styles are processed during build, not at runtime  
✅ **No Hydration Issues**: No JavaScript needed for styles to work  
✅ **Critical CSS Included**: All CSS is generated and can be inlined  
✅ **Zero Flash of Unstyled Content (FOUC)**: Styles are present from initial render  
✅ **Framework Agnostic**: Works with any SSR/SSG framework

## General Principles

### 1. Import CSS in Layout/Root

Always import the virtual CSS module in your root/layout component:

```typescript
// app/layout.tsx (Next.js App Router)
// app.vue (Nuxt)
// src/App.tsx (other frameworks)
import 'pika.css'
```

### 2. Ensure Build-Time Generation

Make sure your build process includes PikaCSS plugin:

```typescript
// Build tools must include PikaCSS
export default {
  plugins: [
    pikacss() // Vite, Webpack, etc.
  ]
}
```

### 3. Critical CSS Strategy

PikaCSS generates atomic CSS which is naturally small. Consider inlining it for optimal performance:

```html
<!-- Generated HTML -->
<head>
  <style>
    /* Inline atomic CSS for critical path */
    .a{color:red}.b{font-size:16px}
  </style>
</head>
```

## Next.js Integration

### App Router (Next.js 13+)

```bash
# Install
pnpm add -D @pikacss/unplugin-pikacss
```

```typescript
// next.config.mjs
import pikacss from '@pikacss/unplugin-pikacss/webpack'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(
      pikacss({
        scan: {
          include: ['app/**/*.{js,ts,jsx,tsx}', 'components/**/*.{js,ts,jsx,tsx}']
        }
      })
    )
    return config
  }
}

export default nextConfig
```

```tsx
// app/layout.tsx
import 'pika.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'App with PikaCSS'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main className={pika({
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })}>
      <h1 className={pika({ fontSize: '2rem', color: '#3b82f6' })}>
        Hello Next.js + PikaCSS
      </h1>
    </main>
  )
}
```

### Pages Router (Next.js 12 and below)

```tsx
// pages/_app.tsx
import 'pika.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

```tsx
// pages/index.tsx
export default function Home() {
  return (
    <div className={pika({
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })}>
      <h1>Hello Next.js</h1>
    </div>
  )
}
```

## Nuxt Integration

Nuxt has first-class PikaCSS support through the official module.

```bash
# Install
pnpm add -D @pikacss/nuxt-pikacss
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pikacss/nuxt-pikacss'],
  
  pikacss: {
    // Options (all optional)
    scan: {
      include: ['**/*.vue', '**/*.tsx', '**/*.jsx'],
      exclude: ['node_modules/**']
    }
  }
})
```

```vue
<!-- app.vue -->
<template>
  <div :class="pika({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  })">
    <h1 :class="pika({ fontSize: '2rem', color: '#3b82f6' })">
      Hello Nuxt + PikaCSS
    </h1>
  </div>
</template>
```

**Features:**
- ✅ Auto-imports `pika()` function globally (no import needed)
- ✅ Auto-imports `pika.css` virtual module
- ✅ Works with Nuxt's SSR and SSG modes
- ✅ Hot Module Replacement (HMR) support

## Astro Integration

Astro works great with PikaCSS through Vite.

```bash
# Install
pnpm add -D @pikacss/unplugin-pikacss
```

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import pikacss from '@pikacss/unplugin-pikacss/vite'

export default defineConfig({
  vite: {
    plugins: [pikacss()]
  }
})
```

```astro
---
// src/pages/index.astro
import 'pika.css'
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Astro + PikaCSS</title>
  </head>
  <body>
    <main class={pika({
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })}>
      <h1 class={pika({ fontSize: '2rem', color: '#3b82f6' })}>
        Hello Astro + PikaCSS
      </h1>
    </main>
  </body>
</html>
```

### Using with Astro Components

```astro
---
// src/components/Card.astro
interface Props {
  title: string
}

const { title } = Astro.props
---

<div class={pika({
  backgroundColor: 'white',
  padding: '1.5rem',
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
})}>
  <h2 class={pika({ fontSize: '1.5rem', fontWeight: '600' })}>
    {title}
  </h2>
  <slot />
</div>
```

## Remix Integration

```bash
# Install
pnpm add -D @pikacss/unplugin-pikacss
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { vitePlugin as remix } from '@remix-run/dev'
import pikacss from '@pikacss/unplugin-pikacss/vite'

export default defineConfig({
  plugins: [
    remix(),
    pikacss()
  ]
})
```

```tsx
// app/root.tsx
import 'pika.css'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
```

```tsx
// app/routes/_index.tsx
export default function Index() {
  return (
    <div className={pika({
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })}>
      <h1 className={pika({ fontSize: '2rem', color: '#3b82f6' })}>
        Hello Remix + PikaCSS
      </h1>
    </div>
  )
}
```

## SvelteKit Integration

```bash
# Install
pnpm add -D @pikacss/unplugin-pikacss
```

```typescript
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite'
import pikacss from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    pikacss()
  ]
})
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import 'pika.css'
</script>

<slot />
```

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  const mainClass = pika({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  })
  
  const titleClass = pika({
    fontSize: '2rem',
    color: '#3b82f6'
  })
</script>

<main class={mainClass}>
  <h1 class={titleClass}>
    Hello SvelteKit + PikaCSS
  </h1>
</main>
```

## Static Site Generation (SSG)

### Vite-based SSG (VitePress, etc.)

```typescript
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import pikacss from '@pikacss/unplugin-pikacss/vite'

export default defineConfig({
  vite: {
    plugins: [pikacss()]
  }
})
```

### Gatsby Integration

```bash
# Install
pnpm add -D @pikacss/unplugin-pikacss
```

```javascript
// gatsby-node.js
const pikacss = require('@pikacss/unplugin-pikacss/webpack')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [pikacss()]
  })
}
```

```jsx
// gatsby-browser.js
import 'pika.css'
```

## Performance Optimization for SSR/SSG

### 1. Inline Critical CSS

For optimal First Contentful Paint (FCP):

```html
<!-- Option 1: Inline all PikaCSS (it's small!) -->
<head>
  <style>
    /* Inline pika.gen.css content */
    .a{color:red}.b{font-size:16px}...
  </style>
</head>

<!-- Option 2: Link external CSS -->
<head>
  <link rel="stylesheet" href="/pika.gen.css">
</head>
```

### 2. Preload CSS

```html
<head>
  <link rel="preload" href="/pika.gen.css" as="style">
  <link rel="stylesheet" href="/pika.gen.css">
</head>
```

### 3. Use CSS Modules for Code Splitting

```typescript
// Create page-specific CSS files
// index.pika.css - only styles for index page
// about.pika.css - only styles for about page
```

This is automatic with PikaCSS's atomic generation - unused styles are never generated!

## Common SSR/SSG Patterns

### Conditional Server/Client Rendering

```tsx
'use client' // Next.js App Router

import { useState, useEffect } from 'react'

export function ClientComponent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Styles work on both server and client
  return (
    <div className={pika({
      backgroundColor: mounted ? '#3b82f6' : '#6b7280',
      transition: 'background-color 0.3s'
    })}>
      {mounted ? 'Client Rendered' : 'Server Rendered'}
    </div>
  )
}
```

### Dynamic Imports with SSR

```tsx
// Next.js dynamic import
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  ssr: false,
  loading: () => (
    <div className={pika({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px'
    })}>
      Loading...
    </div>
  )
})
```

## Troubleshooting SSR/SSG Issues

### Issue: Styles not appearing on first render

**Solution**: Ensure `pika.css` is imported in root/layout component:

```tsx
// ✅ Correct - in layout/root
import 'pika.css'

// ❌ Wrong - in individual pages
```

### Issue: Build fails with "pika is not defined"

**Solution**: Ensure plugin is configured in build tool:

```typescript
// vite.config.ts / next.config.js / etc.
plugins: [pikacss()] // Must be present
```

### Issue: Different styles on server vs client

**Cause**: This shouldn't happen with PikaCSS since styles are static.

**Debug**:
1. Check that `pika.gen.css` is being generated
2. Verify CSS is loaded in browser DevTools
3. Ensure no CSS conflicts with other styles

### Issue: Large CSS bundle

**Solution**: PikaCSS uses atomic CSS which is naturally small. If concerned:
1. Remove unused shortcuts from config
2. Use tree-shaking (automatic with most bundlers)
3. Enable CSS minification in production

## Best Practices

1. ✅ **Import `pika.css` once** in root/layout component
2. ✅ **Use shortcuts** for commonly repeated style patterns
3. ✅ **Enable CSS minification** in production builds
4. ✅ **Consider inlining** critical CSS for fastest FCP
5. ✅ **Test both SSR and CSR** modes during development
6. ✅ **Use preflights** for global styles and CSS variables
7. ✅ **Leverage atomic CSS** - it's naturally optimized for code splitting

## Framework Comparison

| Framework | Support | Setup Difficulty | Notes |
|-----------|---------|------------------|-------|
| **Nuxt** | ⭐⭐⭐⭐⭐ | Easy | Official module, zero config |
| **Next.js** | ⭐⭐⭐⭐⭐ | Easy | Works with both routers |
| **Astro** | ⭐⭐⭐⭐⭐ | Easy | Perfect for content sites |
| **Remix** | ⭐⭐⭐⭐⭐ | Easy | Vite integration |
| **SvelteKit** | ⭐⭐⭐⭐⭐ | Easy | Vite integration |
| **Gatsby** | ⭐⭐⭐⭐ | Medium | Webpack config needed |

## Next Steps

- Review [Performance Guide](/advanced/performance) for optimization tips
- Check [Troubleshooting](/advanced/troubleshooting) for common issues
- Explore [Examples](/examples/components) for component patterns

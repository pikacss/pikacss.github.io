<!-- eslint-disable -->
# TypeScript Support

PikaCSS provides first-class TypeScript support with auto-generated type definitions and full IDE integration.

## Auto-Generated Type Definitions

When you run your dev server or build, PikaCSS generates a `pika.gen.ts` file with complete TypeScript types.

### Configuration

In `pika.config.ts`, always add this reference at the top:

```typescript
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	// your config
})
```

This tells TypeScript where to find the generated types.

### Generated Type File Location

By default: `src/pika.gen.ts` (customizable in plugin options)

```typescript
// Example generated file content
export function pika(styles: StyleDefinition): string
export function pika(
  shortcut: string | string[],
  styles?: StyleDefinition
): string

type StyleDefinition = {
  // All valid CSS properties with proper types
  color?: string
  fontSize?: string | number
  display?: 'flex' | 'grid' | 'block' | /* ... */

  // Nested selectors
  '$:hover'?: StyleDefinition
  '$.active'?: StyleDefinition
  '@media (min-width: 768px)'?: StyleDefinition

  // Special properties
  __important?: boolean
  __shortcut?: string | string[]
}
```

## TypeScript Features

### 1. CSS Property Autocomplete

```typescript
const styles = pika({
  c // Autocomplete shows: color, columnCount, cursor, etc.
  colorScheme
  containerType
})
```

### 2. Value Validation

```typescript
// Type-safe CSS values
const styles = pika({
  display: 'flex' // ✅ Valid
  display: 'xyz'  // ❌ TypeScript error
})
```

### 3. Selector Validation

```typescript
const styles = pika({
	'$:hover': { /* ... */ }, // ✅ Valid pseudo-class
	'$.active': { /* ... */ }, // ✅ Valid class selector
	'$:invalid': { /* ... */ }, // ✅ Valid pseudo-class
	'$:fake': { /* ... */ }, // ❌ TypeScript error
})
```

### 4. Plugin Type Integration

When you use plugins, types are automatically augmented:

```typescript
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
	plugins: [icons()]
})

// Now TypeScript knows about icon shortcuts:
const icon = pika('i-mdi:home') // ✅ Autocomplete for icons
const icon = pika('i-fake') // ❌ Type error
```

### 5. Configuration Validation

```typescript
export default defineEngineConfig({
	prefix: 'pika-', // ✅ Valid option
	unknownOption: 'value' // ❌ TypeScript error
})
```

## IDE Features

### Hover Preview

Hover over `pika()` function calls to see the generated CSS:

```typescript
const styles = pika({
	'color': 'red',
	'fontSize': '16px',
	'$:hover': { color: 'blue' }
})
// Hover shows: ".a { color: red; } .b { font-size: 16px; } .c:hover { color: blue; }"
```

### Autocomplete Suggestions

```typescript
pika({
  // Type first few letters and get autocomplete
  col    // → color, columnCount, columnGap, etc.
  flex   // → flex, flexBasis, flexDirection, flexGrow, etc.
  --my   // → Custom CSS property suggestions
})
```

### Go to Definition

Press Cmd/Ctrl + Click on `pika` function to see its definition and documentation.

### IntelliSense Parameters

```typescript
pika(
	// Parameter hints show what's accepted:
	// (styles: StyleDefinition) => string
	{ color: 'red' }
)
```

## Setup Guide

### Step 1: Generate Initial Types

```bash
# Run dev server once to generate types
pnpm dev
# or pnpm build

# Check that pika.gen.ts is created
ls src/pika.gen.ts
```

### Step 2: Update tsconfig.json

Ensure TypeScript can find the types:

```json
{
	"compilerOptions": {
		"target": "ES2020",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"lib": ["ES2020", "DOM"],
		"strict": true
	},
	"include": ["src/**/*", "pika.gen.ts"]
}
```

### Step 3: Reference Types in Config

```typescript
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	// your config
})
```

### Step 4: Restart TypeScript Server

If types aren't showing in IDE:

**VS Code:**
1. Press Cmd/Ctrl + Shift + P
2. Search "TypeScript: Restart TS Server"
3. Press Enter

**WebStorm/IntelliJ:**
1. Right-click project root
2. Select "TypeScript" → "Restart TypeScript Service"

## Common Issues

### Issue: "pika is not defined"

**Problem**: TypeScript can't find pika() function

**Solutions**:
1. Check `pika.gen.ts` exists: `ls src/pika.gen.ts`
2. Add reference to config: `/// <reference path="./src/pika.gen.ts" />`
3. Ensure file is in tsconfig include
4. Restart TypeScript server

### Issue: "Type '{ ... }' is not assignable to type 'StyleDefinition'"

**Problem**: Invalid CSS property or value

**Solutions**:
1. Check CSS property name (camelCase: `backgroundColor`, not `bg-color`)
2. Check value validity (e.g., `display` must be valid value)
3. For custom values, use string type: `'custom-value'`

### Issue: No Autocomplete for Shortcuts

**Problem**: Shortcuts don't show in autocomplete

**Solutions**:
1. Run build/dev to regenerate types
2. Verify shortcuts in `pika.config.ts`
3. Restart TypeScript server
4. Check shortcuts are registered in plugins

### Issue: "pika.gen.ts not found"

**Problem**: Generated types file missing

**Solutions**:
1. Run build at least once: `pnpm build` or `pnpm dev`
2. Check plugin is configured in your bundler config
3. Verify scan patterns include your files:
   ```typescript
   scan: {
     include: ['**/*.{tsx,ts,vue}'],
     exclude: ['node_modules/**']
   }
   ```

## Advanced TypeScript

### Custom Type Definitions

If you have custom shortcuts or selectors, add module augmentation:

```typescript
// src/types/pika.d.ts
declare module '@pikacss/core' {
	interface Shortcuts {
		'my-custom': any
	}
}
```

### Strict Mode

For better type safety, enable strict TypeScript:

```json
{
	"compilerOptions": {
		"strict": true,
		"noUncheckedIndexedAccess": true,
		"noImplicitThis": true
	}
}
```

### Type Checking Script

Add to `package.json`:

```json
{
	"scripts": {
		"typecheck": "tsc --noEmit"
	}
}
```

Run before commits to catch type errors early.

## Performance Tips

### 1. Avoid Regenerating Types Frequently

Types are only regenerated when:
- You modify `pika.config.ts`
- You add new shortcuts or plugins
- You run a clean build

### 2. Cache Type Checking

Use TypeScript incremental mode:

```json
{
	"compilerOptions": {
		"incremental": true
	}
}
```

### 3. Fast Type Checking

For CI/CD:
```bash
# Faster than full build
pnpm typecheck
# or
tsc --noEmit
```

## Related Topics

- [Configuration](/guide/configuration.md) - Configure PikaCSS options
- [Shortcuts](/guide/shortcuts.md) - Define reusable style combinations
- [Plugin Development](/advanced/plugin-development.md) - Create custom plugins with types
- [Troubleshooting](/advanced/troubleshooting.md) - Common issues and fixes

---

**Key Takeaway**: PikaCSS automatically generates TypeScript definitions. Use the `/// <reference path="./src/pika.gen.ts" />` comment in your config file for full IDE integration and autocomplete support.

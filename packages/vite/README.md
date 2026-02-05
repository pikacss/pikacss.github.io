# @pikacss/vite-plugin-pikacss

⚠️ **DEPRECATED - Use @pikacss/unplugin-pikacss/vite instead**

This package is now a compatibility wrapper. The package has been consolidated into `@pikacss/unplugin-pikacss` to support multiple bundlers from a unified codebase.

## Migration Guide

### Why This Change?

PikaCSS now uses [unplugin](https://github.com/unjs/unplugin) to provide universal bundler support. This means you get the same plugin for Vite, Webpack, Rspack, Esbuild, Rollup, Farm, and Rolldown from a single package.

### Step 1: Update Dependencies

```bash
# Remove the old package
pnpm remove @pikacss/vite-plugin-pikacss

# Install the new package
pnpm add -D @pikacss/unplugin-pikacss
```

### Step 2: Update Import Path

```diff
- import pikacss from '@pikacss/vite-plugin-pikacss'
+ import pikacss from '@pikacss/unplugin-pikacss/vite'
```

That's it! All options remain identical - no breaking changes to the API.

### Complete Before/After Example

**Before (deprecated):**
```typescript
// vite.config.ts
import pikacss from '@pikacss/vite-plugin-pikacss'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		pikacss({
			scan: {
				include: ['src/**/*.{ts,tsx,vue}']
			}
		})
	]
})
```

**After (current):**
```typescript
// vite.config.ts
import pikacss from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		pikacss({
			scan: {
				include: ['src/**/*.{ts,tsx,vue}']
			}
		})
	]
})
```

## Deprecation Timeline

- **Current version (0.0.39)**: Package maintained as compatibility wrapper
- **Future versions**: Package will continue to work but will not receive new features
- **Recommendation**: Migrate to `@pikacss/unplugin-pikacss/vite` for all new and existing projects

## Documentation

For complete documentation, visit:
- [Vite Integration Guide](https://pikacss.github.io/pikacss/integrations/vite.html)
- [PikaCSS Documentation](https://pikacss.github.io/pikacss/)

## Legacy Usage (Not Recommended)

This package still works as a wrapper. If you cannot migrate immediately:

```bash
pnpm add -D @pikacss/vite-plugin-pikacss
```

```typescript
// vite.config.ts
import pikacss from '@pikacss/vite-plugin-pikacss'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		pikacss({
			scan: {
				include: ['**/*.{js,ts,jsx,tsx,vue}'],
				exclude: ['node_modules/**', 'dist/**']
			},
			config: './pika.config.ts',
			autoCreateConfig: true,
			fnName: 'pika',
			transformedFormat: 'string',
			tsCodegen: true,
			cssCodegen: true
		})
	]
})
```

All options are re-exported from `@pikacss/unplugin-pikacss/vite`. See the [unplugin documentation](https://github.com/pikacss/pikacss/tree/main/packages/unplugin) for complete API reference.

## License

MIT © DevilTea

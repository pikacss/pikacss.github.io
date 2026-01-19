# API Reference Summary

For the complete API documentation, see `/docs/advanced/api-reference.md`

## Main Functions

- **`pika()`** - Create atomic styles (returns string)
- **`pika.arr()`** - Create atomic styles (returns array)
- **`pika.inl()`** - Inline template string usage (IDE preview)

## Configuration

- **`defineEngineConfig()`** - Define PikaCSS configuration
- **`createEngine()`** - Programmatically create engine instance

## Plugins

- **`icons()`** - Icon support (@pikacss/plugin-icons)
- **`reset()`** - CSS reset (@pikacss/plugin-reset)
- **`typography()`** - Typography styles (@pikacss/plugin-typography)

## Configuration Options

| Option | Type | Purpose |
|--------|------|---------|
| `prefix` | string | Prefix for generated class names |
| `plugins` | Plugin[] | Register plugins |
| `variables` | VariablesConfig | CSS custom properties |
| `keyframes` | KeyframesConfig | @keyframes definitions |
| `shortcuts` | ShortcutsConfig | Reusable style combinations |
| `selectors` | SelectorsConfig | Custom selector aliases |
| `important` | ImportantConfig | !important flag handling |

## TypeScript Types

All TypeScript types are automatically generated in `pika.gen.ts` by the build process. This provides:

- Full IDE autocomplete for CSS properties
- Type-safe style definitions
- Hover previews of generated CSS
- Editor go-to-definition support

See `/advanced/typescript.md` for setup details.

**Full API Reference**: https://pikacss.com/advanced/api-reference


# Sample API Documentation

This is a test fixture for parser tests.

## API Reference

### createEngine

Creates a new PikaCSS engine instance.

```ts
function createEngine(config?: EngineConfig): Promise<Engine>
```

### EngineConfig

Configuration interface for the engine.

```typescript
interface EngineConfig {
	plugins?: EnginePlugin[]
	presets?: Preset[]
}
```

### StyleValue

Type alias for style values.

```ts
type StyleValue = string | number | undefined
```

## Usage Example

This code block contains "// example" comment and should be skipped:

```ts
// example
function exampleFunction() {
	return 'This should be skipped'
}
```

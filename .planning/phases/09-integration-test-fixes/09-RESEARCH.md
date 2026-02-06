# Phase 9: Integration Test Fixes - Research

**Researched:** 2026-02-06
**Domain:** Integration Testing / Build-time Code Transformation
**Confidence:** HIGH

## Summary

Phase 9 addresses the critical gap identified in v1 Milestone Audit: the @pikacss/integration package contains only placeholder tests (`expect(true).toBe(true)`), providing no verification that the integration layer correctly transforms source code, communicates with the Core engine, or generates proper CSS output.

The integration layer is the bridge between build tools and the Core engine — it scans source files, finds `pika()` calls, evaluates them at build time using `new Function()`, transforms the code via MagicString, and generates both CSS and TypeScript type definitions. Without proper tests, the entire build pipeline (Source → Unplugin → Integration → Core → CSS) is critically unverified.

**Primary recommendation:** Replace fake tests with authentic integration tests that verify the complete transformation pipeline using in-memory file fixtures, mock filesystem operations, and assert against actual CSS generation output.

## Standard Stack

The established libraries/tools for this domain:

### Core Testing Infrastructure
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | ^4.0.16 | Test framework | Already used across all packages, supports TypeScript |
| @pikacss/core | workspace:* | Style engine | Source of truth for CSS generation |
| @pikacss/integration | workspace:* | Package under test | Integration layer to be verified |

### Testing Utilities (Already in Package)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| magic-string | ^0.30.17 | Code transformation | Testing transform operations |
| jiti | ^2.4.2 | Runtime TypeScript execution | Testing config loading |
| globby | ^14.0.2 | File scanning | Testing file discovery |

### Node.js Built-ins
| Module | Purpose | Why Standard |
|--------|---------|--------------|
| node:fs/promises | Mock filesystem operations | No dependencies, native async support |
| node:path | Path manipulation | Cross-platform path handling |
| node:os (tmpdir) | Temporary test directories | Isolated test environments |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vitest | Jest | Jest requires more configuration; Vitest is already standardized |
| In-memory mocks | Real filesystem | Real FS is slower, leaves artifacts, harder to clean up |
| Manual fixtures | Generated fixtures | Manual fixtures are more controllable for tests |

**Installation:**
No new packages needed — all required dependencies already exist in the monorepo.

## Architecture Patterns

### Recommended Test Structure
```
packages/integration/tests/
├── unit/                    # Pure function tests (existing utils)
│   ├── ctx.test.ts         # Context creation, config loading
│   ├── transform.test.ts   # Code transformation logic
│   └── codegen.test.ts     # CSS/TS generation
└── integration/             # End-to-end pipeline tests (NEW)
    ├── pipeline.test.ts    # Full transform pipeline
    ├── multi-file.test.ts  # Multiple files with usages
    └── edge-cases.test.ts  # Error handling, malformed code
```

### Pattern 1: Integration Context Testing
**What:** Test the complete `createCtx` → `transform` → `getCssCodegenContent` pipeline
**When to use:** Verifying the integration layer works end-to-end
**Example:**
```typescript
import { describe, expect, it } from 'vitest'
import { createCtx } from '../src/ctx'

describe('Integration Pipeline', () => {
  it('should transform pika() calls and generate CSS', async () => {
    const ctx = createCtx({
      cwd: '/mock/project',
      currentPackageName: '@pikacss/integration',
      scan: {
        include: ['**/*.ts'],
        exclude: ['node_modules/**']
      },
      configOrPath: null,
      fnName: 'pika',
      transformedFormat: 'string',
      tsCodegen: false,
      cssCodegen: 'pika.gen.css',
      autoCreateConfig: false
    })

    await ctx.setup()

    // Transform code with pika() calls
    const result = await ctx.transform(
      `const styles = pika({ color: 'red', display: 'flex' })`,
      'test.ts'
    )

    // Verify code transformation
    expect(result).toBeDefined()
    expect(result!.code).toContain('a b') // Atomic class names

    // Verify CSS generation
    const css = await ctx.getCssCodegenContent()
    expect(css).toContain('.a{color:red;}')
    expect(css).toContain('.b{display:flex;}')
  })
})
```

### Pattern 2: Multi-File Usage Collection
**What:** Test that the integration layer collects usages across multiple files
**When to use:** Verifying the scan and collect functionality
**Example:**
```typescript
it('should collect usages from multiple files', async () => {
  const ctx = createCtx(options)
  await ctx.setup()

  await ctx.transform('const s1 = pika({ color: "red" })', 'file1.ts')
  await ctx.transform('const s2 = pika({ color: "blue" })', 'file2.ts')

  expect(ctx.usages.size).toBe(2)
  expect(ctx.usages.has('file1.ts')).toBe(true)
  expect(ctx.usages.has('file2.ts')).toBe(true)

  const css = await ctx.getCssCodegenContent()
  expect(css).toContain('color:red')
  expect(css).toContain('color:blue')
})
```

### Pattern 3: Edge Case Handling
**What:** Test malformed code, nested calls, comments, strings
**When to use:** Ensuring robustness
**Example:**
```typescript
describe('Edge Cases', () => {
  it('should handle pika() in comments', async () => {
    const code = `
      // const styles = pika({ color: 'red' })
      const real = pika({ color: 'blue' })
    `
    const result = await ctx.transform(code, 'test.ts')
    const css = await ctx.getCssCodegenContent()
    
    expect(css).not.toContain('red') // Comment ignored
    expect(css).toContain('blue')    // Real call processed
  })

  it('should handle nested function calls', async () => {
    const code = `const s = pika({ color: 'red' }, pika({ display: 'flex' }))`
    // Should fail or handle gracefully
    await expect(ctx.transform(code, 'test.ts')).rejects.toThrow()
  })

  it('should handle malformed pika() calls', async () => {
    const code = `const s = pika({ color: })`
    await expect(ctx.transform(code, 'test.ts')).rejects.toThrow()
  })
})
```

### Pattern 4: Config Loading Tests
**What:** Test config file discovery, inline config, auto-creation
**When to use:** Verifying configuration system
**Example:**
```typescript
it('should load inline config', async () => {
  const ctx = createCtx({
    ...baseOptions,
    configOrPath: {
      plugins: [somePlugin()]
    }
  })
  await ctx.setup()
  
  expect(ctx.resolvedConfig).toBeDefined()
  expect(ctx.resolvedConfig!.plugins).toHaveLength(2) // +1 dev plugin
})

it('should auto-create config if not found', async () => {
  const tmpDir = mkdtempSync(join(tmpdir(), 'pikacss-test-'))
  const ctx = createCtx({
    ...baseOptions,
    cwd: tmpDir,
    autoCreateConfig: true
  })
  
  await ctx.setup()
  
  const configPath = join(tmpDir, 'pika.config.js')
  expect(existsSync(configPath)).toBe(true)
})
```

### Anti-Patterns to Avoid
- **Testing implementation details:** Don't test internal signals/computeds directly — test observable behavior
- **Mocking too much:** Don't mock @pikacss/core engine — use real engine for integration tests
- **Hardcoded paths:** Always use path.join() and tmpdir() for cross-platform compatibility
- **Shared state between tests:** Each test should create its own ctx instance
- **Forgetting cleanup:** Always remove temp directories in afterEach/finally blocks

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Temporary test directories | Manual mkdir/rmdir logic | `os.tmpdir()` + unique suffix | Race conditions, cleanup issues, platform differences |
| Code transformation verification | String matching | MagicString.generateMap() | Accurate source map validation |
| Async test setup/teardown | Manual promise chains | Vitest beforeEach/afterEach | Proper error handling, cleanup guarantees |
| File system mocking | Custom mock objects | In-memory string fixtures | Integration tests should use real FS operations in isolated dirs |
| Config file evaluation | eval() or vm.runInContext() | jiti (already in package) | Proper TypeScript support, error handling |

**Key insight:** Integration tests should test *integration*, not isolated units. Use real Core engine, real file operations (in temp dirs), real config loading — only mock external dependencies like network or system services.

## Common Pitfalls

### Pitfall 1: Testing Too Little (Current State)
**What goes wrong:** Placeholder tests (`expect(true).toBe(true)`) provide false confidence
**Why it happens:** Time pressure, complexity of integration testing, unclear requirements
**How to avoid:** 
- Follow the test pyramid: few E2E tests, more integration tests, many unit tests
- For integration layer: minimum 3-5 authentic tests covering happy path + error cases
- Each test must assert on observable output (transformed code, generated CSS)
**Warning signs:** 
- Tests that never fail
- Tests with no assertions
- Tests that don't call the code under test

### Pitfall 2: Over-Mocking
**What goes wrong:** Mocking @pikacss/core engine makes tests verify the mock, not reality
**Why it happens:** Fear of slow tests, desire for isolation
**How to avoid:**
- Integration tests SHOULD use real dependencies (Core engine)
- Only mock external I/O (network, system services)
- Use real filesystem operations in isolated temp directories
**Warning signs:**
- Test passes but production fails
- Mocking return values instead of behavior
- More mock code than test code

### Pitfall 3: Hardcoded Paths
**What goes wrong:** Tests fail on different machines, CI environments, Windows
**Why it happens:** Using absolute paths like `/tmp/test` or backslashes
**How to avoid:**
- Always use `path.join()` for path construction
- Use `os.tmpdir()` for temporary directories
- Use `path.resolve()` for relative → absolute conversion
**Warning signs:**
- Tests pass locally but fail in CI
- Different behavior on Windows vs Unix
- Path separator issues

### Pitfall 4: Shared State Between Tests
**What goes wrong:** Tests pass in isolation but fail when run together
**Why it happens:** Reusing ctx instances, shared temp directories, global state
**How to avoid:**
- Each test creates its own `createCtx()` instance
- Use unique temp directories per test (timestamp or UUID)
- Clear usages map between tests
**Warning signs:**
- Tests fail randomly depending on execution order
- `pnpm test --run` passes but `pnpm test` fails
- Cleanup errors

### Pitfall 5: Not Testing Error Cases
**What goes wrong:** Production errors are not caught by tests
**Why it happens:** Focusing only on happy path
**How to avoid:**
- Test malformed code: `pika({ color: })` (syntax error)
- Test invalid styles: `pika({ invalidProp: 'value' })`
- Test missing config files when `autoCreateConfig: false`
- Test file read failures (permissions)
**Warning signs:**
- No `expect().rejects.toThrow()` assertions
- No try/catch in test code
- No tests for error messages

## Code Examples

Verified patterns from existing codebase:

### Example 1: Engine Usage (from core/tests/unit/engine.test.ts)
```typescript
// Source: packages/core/tests/unit/engine.test.ts:28-34
it('should generate correct css', async () => {
  const engine = await createEngine()
  await engine.use({ display: 'flex' })
  const css = await engine.renderAtomicStyles(false)
  expect(css).toBe('.a{display:flex;}')
})
```

### Example 2: Integration Context Creation Pattern
```typescript
// Based on: packages/integration/src/ctx.ts:402-443
const ctx = createCtx({
  cwd: process.cwd(),
  currentPackageName: '@pikacss/integration',
  scan: {
    include: ['**/*.{ts,tsx,js,jsx,vue}'],
    exclude: ['node_modules/**', 'dist/**']
  },
  configOrPath: null, // or inline config object
  fnName: 'pika',
  transformedFormat: 'string', // or 'array' | 'inline'
  tsCodegen: 'pika.gen.ts', // or false
  cssCodegen: 'pika.gen.css',
  autoCreateConfig: false // Don't auto-create in tests
})

await ctx.setup() // Initialize engine, load config
```

### Example 3: Transform and Assert Pattern
```typescript
// Based on: packages/integration/src/ctx.ts:316-387
const sourceCode = `
  const buttonStyles = pika({ 
    color: 'red', 
    display: 'flex' 
  })
`

const result = await ctx.transform(sourceCode, 'Button.tsx')

// Assert transformation
expect(result).toBeDefined()
expect(result!.code).toMatch(/['"]a b['"]/) // Transformed to class names

// Assert CSS generation
const css = await ctx.getCssCodegenContent()
expect(css).toContain('.a{color:red;}')
expect(css).toContain('.b{display:flex;}')

// Assert usage tracking
expect(ctx.usages.has('Button.tsx')).toBe(true)
expect(ctx.usages.get('Button.tsx')).toHaveLength(1)
```

### Example 4: Multi-File Integration Test
```typescript
// Pattern for testing usage collection across files
describe('Multi-file Integration', () => {
  let ctx: IntegrationContext
  
  beforeEach(async () => {
    ctx = createCtx(testOptions)
    await ctx.setup()
  })
  
  it('should collect styles from multiple files', async () => {
    await ctx.transform('const s1 = pika({ color: "red" })', 'a.ts')
    await ctx.transform('const s2 = pika({ color: "blue" })', 'b.ts')
    await ctx.transform('const s3 = pika({ color: "green" })', 'c.ts')
    
    expect(ctx.usages.size).toBe(3)
    
    const css = await ctx.getCssCodegenContent()
    expect(css).toContain('color:red')
    expect(css).toContain('color:blue')
    expect(css).toContain('color:green')
  })
  
  it('should deduplicate atomic styles', async () => {
    // Both files use same style
    await ctx.transform('const s1 = pika({ color: "red" })', 'a.ts')
    await ctx.transform('const s2 = pika({ color: "red" })', 'b.ts')
    
    const css = await ctx.getCssCodegenContent()
    // CSS should contain .a{color:red;} only ONCE
    const matches = css.match(/\.a\{color:red;\}/g)
    expect(matches).toHaveLength(1)
  })
})
```

### Example 5: Error Handling Test
```typescript
// Pattern for testing error cases
describe('Error Handling', () => {
  it('should handle malformed JavaScript', async () => {
    const code = 'const s = pika({ color: })'
    
    await expect(
      ctx.transform(code, 'bad.ts')
    ).rejects.toThrow()
  })
  
  it('should handle missing engine gracefully', async () => {
    const ctx = createCtx(testOptions)
    // Don't call setup() — engine is null
    
    const result = await ctx.transform('const s = pika({ color: "red" })', 'test.ts')
    expect(result).toBeNull() // Gracefully returns null
  })
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual temp directory creation | `os.tmpdir()` + unique suffix | Node.js 10+ | Cross-platform, automatic cleanup |
| String replacement for transforms | MagicString with source maps | ~2020 | Accurate debugging, HMR support |
| vm.runInContext for config | jiti with TypeScript support | 2022 | ESM, TypeScript, modern syntax |
| Fake tests (`expect(true).toBe(true)`) | Authentic integration tests | **Phase 9 (NOW)** | Real verification of build pipeline |

**Deprecated/outdated:**
- **vm.runInContext:** Use jiti for TypeScript config files
- **Manual string manipulation:** Use MagicString for code transformation with source maps
- **Synchronous fs operations:** Use fs/promises for better async support

## Open Questions

Things that couldn't be fully resolved:

1. **Test Execution Time**
   - What we know: Integration tests will be slower than unit tests (need real engine, file I/O)
   - What's unclear: Acceptable timeout threshold (current: 2 minutes default)
   - Recommendation: Start with 10-30 second timeouts, increase if needed. Monitor CI performance.

2. **Config File Mocking Strategy**
   - What we know: Tests should not auto-create config in real project
   - What's unclear: Should we use tmpdir for all config tests, or mock filesystem?
   - Recommendation: Use tmpdir with `autoCreateConfig: false` by default, only enable in specific tests

3. **Coverage Targets**
   - What we know: Current state is 0% real integration coverage (only placeholder test)
   - What's unclear: What percentage is "enough" for Phase 9?
   - Recommendation: Minimum 70% coverage of ctx.ts critical paths (transform, getCssCodegenContent, setup)

## Sources

### Primary (HIGH confidence)
- PikaCSS monorepo codebase inspection (packages/integration/src/ctx.ts, packages/core/tests/)
- AGENTS.md - Monorepo architecture and testing strategy
- v1-MILESTONE-AUDIT.md - Gap identification (Phase 5 fake tests)
- Vitest documentation (test framework patterns)

### Secondary (MEDIUM confidence)
- Existing test patterns from packages/core/tests/unit/engine.test.ts
- Integration test example from packages/api-verifier/tests/integration/end-to-end.test.ts
- Node.js fs/promises and os.tmpdir() documentation

### Tertiary (LOW confidence)
- None (all findings verified against actual codebase)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies already in monorepo, no new packages needed
- Architecture: HIGH - Test patterns established by existing core tests, clear integration test requirements
- Pitfalls: HIGH - Identified from v1 audit findings and common integration testing issues
- Code examples: HIGH - All examples derived from actual codebase files

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days - stable domain, no fast-moving dependencies)

---

## Critical Gap Addressed

From v1-MILESTONE-AUDIT.md:

> ### 1. Phase 5: Fake Integration Tests
> **Impact:** Critical
> The "PASSED" status of Phase 5 is invalid. `packages/integration/tests/some.test.ts` contains only `expect(true).toBe(true)`. There is no automated proof that the integration layer correctly communicates with the Core layer or that the Unplugin adapters function correctly at runtime.

This research provides the foundation for creating authentic integration tests that verify:
1. ✅ Code transformation: `pika()` → class names
2. ✅ Core communication: Integration → Engine → CSS
3. ✅ Multi-file collection: Usage tracking across files
4. ✅ CSS generation: Atomic styles from collected usages
5. ✅ Error handling: Malformed code, invalid styles
6. ✅ Config loading: Inline config, file discovery, auto-creation

**Next step:** Use this research to plan Phase 9 tasks that replace `packages/integration/tests/some.test.ts` with authentic integration tests covering the complete transformation pipeline.

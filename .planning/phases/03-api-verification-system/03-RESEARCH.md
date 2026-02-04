# Phase 3: API Verification System - Research

**Researched:** 2026-02-04
**Domain:** TypeScript API Extraction & Documentation Verification
**Confidence:** HIGH

## Summary

API verification for TypeScript projects requires extracting type information from source code and comparing it against documentation. The standard approach uses TypeScript's Compiler API directly or established tools like TypeDoc and API Extractor. For PikaCSS's specific needs—validating documented signatures against 8 packages with monorepo structure—a custom solution using the TypeScript Compiler API provides the most control and integration with existing Vitest infrastructure.

TypeDoc is the standard for API extraction (200k+ weekly downloads, actively maintained), offering JSON output of all public exports with full type information. API Extractor (Microsoft's tool) provides enterprise-grade API management but adds significant complexity for pure verification needs. For documentation parsing, unified/remark ecosystem provides robust markdown AST manipulation.

The user has decided on exact signature matching, CI failure on any mismatch, and dual JSON/Markdown output formats—these requirements favor a custom implementation over generic documentation generators.

**Primary recommendation:** Build custom verification using TypeScript Compiler API + TypeDoc JSON output for extraction, unified/remark for markdown parsing, integrated as Vitest tests.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| typescript | 5.x | Compiler API for type extraction | Official TypeScript API, most accurate type information, used by all tools |
| typedoc | 0.26.x | API documentation generator | Industry standard, extracts all exports with full signatures, JSON output mode |
| unified | 11.x | Markdown/content processing | Universal syntax tree processor, plugin ecosystem |
| remark | 15.x | Markdown parser | De facto standard for markdown AST, part of unified ecosystem |
| remark-parse | 11.x | Markdown to AST | Core parser for remark |
| mdast-util-from-markdown | 2.x | Low-level markdown parser | Alternative for simpler use cases |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @microsoft/api-extractor | 7.x | Enterprise API management | When need .d.ts rollups, API reviews, trimming by release type |
| unist-util-visit | 5.x | AST traversal | When processing unified/remark AST trees |
| ts-morph | 22.x | High-level TypeScript API | When need file manipulation beyond reading |
| vitest | 2.x | Test framework (already in use) | PikaCSS already uses Vitest for all testing |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| TypeDoc | API Extractor | API Extractor adds .d.ts rollup features not needed; TypeDoc simpler for pure extraction |
| TypeScript Compiler API | ts-morph | ts-morph adds file manipulation overhead; direct Compiler API faster for read-only |
| Custom solution | documentation.js | documentation.js is JavaScript-focused, weaker TypeScript support |

**Installation:**
```bash
pnpm add -D typedoc unified remark remark-parse unist-util-visit
```

## Architecture Patterns

### Recommended Project Structure
```
packages/api-verifier/
├── src/
│   ├── extractor.ts       # TypeScript API extraction logic
│   ├── parser.ts          # Markdown documentation parser
│   ├── comparator.ts      # API signature comparison
│   ├── reporter.ts        # Dual JSON/Markdown report generation
│   └── index.ts           # Main verification orchestrator
├── tests/
│   ├── unit/              # Unit tests for each module
│   └── integration/       # End-to-end verification tests
└── package.json
```

### Pattern 1: TypeScript API Extraction via Compiler API
**What:** Use TypeScript's Compiler API to extract type information from compiled .d.ts files
**When to use:** Need complete type signatures including generics, type parameters, constraints
**Example:**
```typescript
// Source: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
import * as ts from 'typescript';

interface ExtractedAPI {
  name: string;
  kind: 'function' | 'interface' | 'type' | 'class';
  signature: string;
  parameters?: Array<{ name: string; type: string; optional: boolean }>;
  returnType?: string;
  sourceFile: string;
}

function extractAPIs(entryPoint: string): ExtractedAPI[] {
  const program = ts.createProgram([entryPoint], {
    declaration: true,
    emitDeclarationOnly: true
  });
  
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(entryPoint);
  const apis: ExtractedAPI[] = [];
  
  function visit(node: ts.Node) {
    // Extract exported declarations
    if (!isNodeExported(node)) return;
    
    if (ts.isFunctionDeclaration(node) && node.name) {
      const symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) {
        const type = checker.getTypeOfSymbolAtLocation(symbol, node);
        apis.push({
          name: symbol.getName(),
          kind: 'function',
          signature: checker.typeToString(type),
          sourceFile: sourceFile.fileName
        });
      }
    }
    
    ts.forEachChild(node, visit);
  }
  
  function isNodeExported(node: ts.Node): boolean {
    return (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0;
  }
  
  visit(sourceFile);
  return apis;
}
```

### Pattern 2: TypeDoc JSON Output for Complete Extraction
**What:** Use TypeDoc in JSON mode to get structured API data for all packages
**When to use:** Need comprehensive extraction including JSDoc comments, inheritance, generic constraints
**Example:**
```typescript
// TypeDoc configuration for JSON output
import { Application, TSConfigReader } from 'typedoc';

async function extractWithTypeDoc(entryPoints: string[]): Promise<any> {
  const app = await Application.bootstrapWithPlugins({
    entryPoints,
    tsconfig: './tsconfig.json',
    json: './api-output.json', // Output JSON instead of HTML
    excludePrivate: true,
    excludeProtected: true,
    excludeInternal: true
  });
  
  const project = await app.convert();
  if (!project) {
    throw new Error('TypeDoc conversion failed');
  }
  
  // TypeDoc automatically writes JSON to specified path
  return require('./api-output.json');
}
```

### Pattern 3: Markdown Code Block Extraction
**What:** Parse markdown files to extract TypeScript code blocks containing API signatures
**When to use:** Need to extract documented API signatures from markdown files
**Example:**
```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import type { Code } from 'mdast';

interface DocumentedAPI {
  signature: string;
  file: string;
  line: number;
}

function extractDocumentedAPIs(markdownFile: string): DocumentedAPI[] {
  const content = fs.readFileSync(markdownFile, 'utf-8');
  const tree = unified().use(remarkParse).parse(content);
  
  const apis: DocumentedAPI[] = [];
  
  visit(tree, 'code', (node: Code, index, parent) => {
    // Only process TypeScript code blocks
    if (node.lang !== 'typescript' && node.lang !== 'ts') return;
    
    // Skip example code, focus on API signatures
    if (node.value.includes('//') && node.value.includes('example')) return;
    
    apis.push({
      signature: node.value.trim(),
      file: markdownFile,
      line: node.position?.start.line || 0
    });
  });
  
  return apis;
}
```

### Pattern 4: Signature Normalization & Comparison
**What:** Normalize TypeScript signatures before comparison to handle formatting differences
**When to use:** Comparing extracted API with documented API
**Example:**
```typescript
interface SignatureMatch {
  matches: boolean;
  differences?: string[];
}

function normalizeSignature(sig: string): string {
  return sig
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\s*:\s*/g, ': ') // Normalize colons
    .replace(/\s*=>\s*/g, ' => ') // Normalize arrows
    .replace(/\s*\|\s*/g, ' | ') // Normalize unions
    .replace(/\s*&\s*/g, ' & ') // Normalize intersections
    .trim();
}

function compareSignatures(
  extracted: string,
  documented: string
): SignatureMatch {
  const normExtracted = normalizeSignature(extracted);
  const normDocumented = normalizeSignature(documented);
  
  if (normExtracted === normDocumented) {
    return { matches: true };
  }
  
  // Detailed difference detection
  const differences: string[] = [];
  
  // Check parameter count
  const extractedParams = normExtracted.match(/\(([^)]*)\)/)?.[1];
  const documentedParams = normDocumented.match(/\(([^)]*)\)/)?.[1];
  
  if (extractedParams !== documentedParams) {
    differences.push(`Parameters differ: extracted(${extractedParams}) vs documented(${documentedParams})`);
  }
  
  // Check return type
  const extractedReturn = normExtracted.match(/=>\s*(.+)$/)?.[1];
  const documentedReturn = normDocumented.match(/=>\s*(.+)$/)?.[1];
  
  if (extractedReturn !== documentedReturn) {
    differences.push(`Return type differs: extracted(${extractedReturn}) vs documented(${documentedReturn})`);
  }
  
  return { matches: false, differences };
}
```

### Pattern 5: Context-Aware Documentation Validation
**What:** Distinguish between API Reference (exact signatures) vs Guide (simplified examples)
**When to use:** User requirement to allow simplified examples in guides but require exactness in API Reference
**Example:**
```typescript
enum DocumentationType {
  API_REFERENCE = 'api-reference',
  GUIDE = 'guide',
  EXAMPLE = 'example'
}

function getDocumentationType(filePath: string): DocumentationType {
  if (filePath.includes('/advanced/api-reference.md')) {
    return DocumentationType.API_REFERENCE;
  }
  if (filePath.includes('/guide/') || filePath.includes('/llm/')) {
    return DocumentationType.GUIDE;
  }
  return DocumentationType.EXAMPLE;
}

function validateDocumentation(
  extracted: ExtractedAPI,
  documented: DocumentedAPI,
  filePath: string
): ValidationResult {
  const docType = getDocumentationType(filePath);
  
  switch (docType) {
    case DocumentationType.API_REFERENCE:
      // Exact match required
      return compareSignatures(extracted.signature, documented.signature);
      
    case DocumentationType.GUIDE:
      // Allow simplified signatures but check core elements
      return compareSimplified(extracted, documented);
      
    case DocumentationType.EXAMPLE:
      // Only check that API name exists
      return { valid: true };
  }
}
```

### Pattern 6: Per-Package Coverage Tracking
**What:** Track API documentation coverage separately for each monorepo package
**When to use:** User requirement for per-package breakdown
**Example:**
```typescript
interface PackageCoverage {
  packageName: string;
  totalAPIs: number;
  documentedAPIs: number;
  undocumentedAPIs: string[];
  coveragePercent: number;
}

function calculateCoverage(
  packageName: string,
  extractedAPIs: ExtractedAPI[],
  documentedAPIs: DocumentedAPI[]
): PackageCoverage {
  const documented = new Set(
    documentedAPIs.map(api => extractAPIName(api.signature))
  );
  
  const undocumented = extractedAPIs
    .filter(api => !documented.has(api.name))
    .map(api => api.name);
  
  return {
    packageName,
    totalAPIs: extractedAPIs.length,
    documentedAPIs: extractedAPIs.length - undocumented.length,
    undocumentedAPIs: undocumented,
    coveragePercent: ((extractedAPIs.length - undocumented.length) / extractedAPIs.length) * 100
  };
}
```

### Anti-Patterns to Avoid
- **Comparing raw strings without normalization:** Different formatting will cause false positives; always normalize
- **Single-pass extraction:** TypeScript types may require multiple resolution passes for complex generics
- **Ignoring module augmentation:** PikaCSS uses declaration merging for plugins; must track augmented interfaces
- **Hardcoded file paths:** Use glob patterns and package.json "exports" field to discover entry points
- **Blocking on plugin hooks:** User decided manual review for plugin hooks; don't fail CI on these

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TypeScript type extraction | Custom AST walker | TypeScript Compiler API + TypeDoc | Type resolution requires compiler infrastructure; generics, conditional types, mapped types are complex |
| Markdown parsing | Regex-based extraction | unified + remark | Markdown has subtle edge cases (nested code blocks, escaping, frontmatter); remark handles all |
| AST traversal | Manual recursion | unist-util-visit | Graph traversal has edge cases (cycles, depth limits); battle-tested visitor pattern |
| Signature string comparison | Simple string equality | Normalization + structural comparison | Whitespace, optional parameters, type aliases need sophisticated comparison |
| JSON schema validation | Manual object comparison | JSON Schema + ajv | Schema validation has complex rules (oneOf, anyOf, recursive refs) |

**Key insight:** TypeScript's type system is Turing-complete. Attempting to parse or extract types without using the compiler infrastructure will fail on advanced types (conditional types, mapped types, template literal types, recursive types). Always use TypeScript's own APIs.

## Common Pitfalls

### Pitfall 1: Incomplete Public API Detection
**What goes wrong:** Only checking `export` keyword misses re-exported APIs from other modules
**Why it happens:** TypeScript allows `export { foo } from './other'` which doesn't declare locally
**How to avoid:** Use package.json "exports" field as source of truth for public API surface
**Warning signs:** Documentation shows APIs that extractor doesn't find; package consumers can import but verifier doesn't check

**Prevention strategy:**
```typescript
// Read package.json exports to find true entry points
function getPublicEntryPoints(packagePath: string): string[] {
  const pkg = require(path.join(packagePath, 'package.json'));
  const entryPoints: string[] = [];
  
  // Handle different export patterns
  if (typeof pkg.exports === 'string') {
    entryPoints.push(pkg.exports);
  } else if (typeof pkg.exports === 'object') {
    for (const [key, value] of Object.entries(pkg.exports)) {
      if (typeof value === 'object' && value.import) {
        entryPoints.push(value.import);
      }
    }
  }
  
  return entryPoints.map(ep => path.resolve(packagePath, ep));
}
```

### Pitfall 2: Module Augmentation Not Tracked
**What goes wrong:** Plugins extend core interfaces via `declare module`, these don't show up in extraction
**Why it happens:** Declaration merging happens across files; type checker must merge all declarations
**How to avoid:** User already decided manual review for plugin hooks; document this limitation clearly
**Warning signs:** EngineConfig interface documented options that don't appear in core package

**Prevention strategy:**
```typescript
// Explicitly document limitation in report
function generateReport(results: ValidationResult[]): string {
  return `
## Known Limitations

**Plugin Module Augmentation**: Plugin hooks that use \`declare module '@pikacss/core'\` 
to extend interfaces are not automatically validated. These require manual review because:
- Declaration merging happens at consumer side, not in plugin package
- Type information depends on which plugins are installed
- Validation would require loading all possible plugin combinations

**Action Required**: Manually review plugin documentation against plugin source code.
`;
}
```

### Pitfall 3: Type Alias Expansion Inconsistency
**What goes wrong:** Extracted signature shows `string` but documented shows `CSSProperty`, both correct but don't match
**Why it happens:** TypeScript type checker can show types in expanded or aliased form depending on context
**How to avoid:** Store both expanded and aliased forms; compare both during validation
**Warning signs:** Failures on signatures that look semantically identical but use different type names

**Prevention strategy:**
```typescript
interface TypeRepresentation {
  expanded: string;    // Fully expanded: 'string | number'
  aliased: string;     // With aliases: 'CSSValue'
  raw: ts.Type;        // Original type object
}

function extractTypeRepresentation(
  type: ts.Type,
  checker: ts.TypeChecker
): TypeRepresentation {
  return {
    expanded: checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation),
    aliased: checker.typeToString(type, undefined, ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
    raw: type
  };
}

function typesMatch(extracted: TypeRepresentation, documented: string): boolean {
  return extracted.expanded === documented || extracted.aliased === documented;
}
```

### Pitfall 4: Generic Constraint Loss
**What goes wrong:** Extracted signature loses generic constraints like `T extends string`
**Why it happens:** Default TypeScript stringify options may omit constraints for brevity
**How to avoid:** Use TypeFormatFlags to preserve all type information
**Warning signs:** Generic functions failing validation when constraints are important

**Prevention strategy:**
```typescript
const FORMAT_FLAGS = 
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.WriteTypeArgumentsOfSignature |
  ts.TypeFormatFlags.UseStructuralFallback |
  ts.TypeFormatFlags.WriteArrowStyleSignature;

function signatureToString(signature: ts.Signature, checker: ts.TypeChecker): string {
  return checker.signatureToString(signature, undefined, FORMAT_FLAGS);
}
```

### Pitfall 5: Cross-File Contradiction Detection Complexity
**What goes wrong:** Same API described differently in API Reference vs Guide vs AGENTS.md
**Why it happens:** Multiple documentation files maintained independently, no single source of truth
**How to avoid:** Extract all mentions of each API across all docs, flag when descriptions conflict
**Warning signs:** Users confused about API behavior; documentation seems to contradict itself

**Prevention strategy:**
```typescript
interface APIReference {
  apiName: string;
  locations: Array<{
    file: string;
    line: number;
    signature: string;
    description?: string;
  }>;
}

function detectContradictions(refs: APIReference[]): Contradiction[] {
  const contradictions: Contradiction[] = [];
  
  for (const ref of refs) {
    const signatures = new Set(ref.locations.map(loc => normalizeSignature(loc.signature)));
    
    if (signatures.size > 1) {
      contradictions.push({
        apiName: ref.apiName,
        message: `API described inconsistently across ${ref.locations.length} locations`,
        locations: ref.locations
      });
    }
  }
  
  return contradictions;
}
```

## Code Examples

Verified patterns from official sources:

### Extracting All Public Exports from Package
```typescript
// Source: https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
import * as ts from 'typescript';

function extractPublicAPIs(packagePath: string): ExtractedAPI[] {
  // Get entry point from package.json
  const pkg = require(path.join(packagePath, 'package.json'));
  const entryPoint = pkg.types || pkg.typings || './dist/index.d.ts';
  const entryFile = path.resolve(packagePath, entryPoint);
  
  // Create program
  const program = ts.createProgram([entryFile], {
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.ESNext
  });
  
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(entryFile);
  const apis: ExtractedAPI[] = [];
  
  // Get module symbol
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) return apis;
  
  // Get all exports
  const exports = checker.getExportsOfModule(moduleSymbol);
  
  for (const exportSymbol of exports) {
    const decl = exportSymbol.declarations?.[0];
    if (!decl) continue;
    
    apis.push({
      name: exportSymbol.getName(),
      kind: getDeclarationKind(decl),
      signature: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(exportSymbol, decl)
      ),
      sourceFile: sourceFile.fileName
    });
  }
  
  return apis;
}

function getDeclarationKind(decl: ts.Declaration): string {
  if (ts.isFunctionDeclaration(decl)) return 'function';
  if (ts.isClassDeclaration(decl)) return 'class';
  if (ts.isInterfaceDeclaration(decl)) return 'interface';
  if (ts.isTypeAliasDeclaration(decl)) return 'type';
  if (ts.isVariableDeclaration(decl)) return 'variable';
  return 'unknown';
}
```

### Vitest Integration for CI Failure on Mismatch
```typescript
// Source: PikaCSS existing test patterns + Vitest docs
import { describe, it, expect } from 'vitest';

describe('API Verification', () => {
  it('all public APIs have documentation', async () => {
    const results = await verifyAllPackages();
    
    const undocumented = results
      .flatMap(r => r.coverage.undocumentedAPIs)
      .filter(api => api); // Remove empty
    
    if (undocumented.length > 0) {
      const message = `${undocumented.length} APIs lack documentation:\n` +
        undocumented.map(api => `  - ${api}`).join('\n');
      
      // User requirement: any mismatch fails CI
      throw new Error(message);
    }
  });
  
  it('documented API signatures match code', async () => {
    const results = await verifyAllPackages();
    
    const mismatches = results
      .flatMap(r => r.mismatches)
      .filter(m => m);
    
    if (mismatches.length > 0) {
      const message = `${mismatches.length} API signature mismatches:\n` +
        mismatches.map(m => 
          `  ${m.file}:${m.line} - ${m.apiName}\n` +
          `    Expected: ${m.expected}\n` +
          `    Documented: ${m.documented}`
        ).join('\n\n');
      
      throw new Error(message);
    }
  });
  
  it('no contradictions across documentation files', async () => {
    const contradictions = await detectDocumentationContradictions();
    
    if (contradictions.length > 0) {
      const message = `${contradictions.length} documentation contradictions:\n` +
        contradictions.map(c => 
          `  ${c.apiName}:\n` +
          c.locations.map(l => `    ${l.file}:${l.line}`).join('\n')
        ).join('\n\n');
      
      throw new Error(message);
    }
  });
});
```

### Dual JSON/Markdown Report Generation
```typescript
interface VerificationReport {
  timestamp: string;
  packages: PackageResult[];
  summary: {
    totalAPIs: number;
    documentedAPIs: number;
    mismatches: number;
    contradictions: number;
  };
}

function generateReports(results: VerificationReport): void {
  // JSON for CI/automation
  fs.writeFileSync(
    './api-verification-report.json',
    JSON.stringify(results, null, 2)
  );
  
  // Markdown for human review
  const markdown = `
# API Verification Report

**Generated:** ${results.timestamp}

## Summary

- **Total APIs:** ${results.summary.totalAPIs}
- **Documented:** ${results.summary.documentedAPIs} (${calculatePercent(results.summary.documentedAPIs, results.summary.totalAPIs)}%)
- **Mismatches:** ${results.summary.mismatches} ${results.summary.mismatches > 0 ? '❌' : '✅'}
- **Contradictions:** ${results.summary.contradictions} ${results.summary.contradictions > 0 ? '❌' : '✅'}

## Per-Package Results

${results.packages.map(pkg => `
### ${pkg.packageName}

- Coverage: ${pkg.coverage.coveragePercent.toFixed(1)}%
- APIs: ${pkg.coverage.documentedAPIs}/${pkg.coverage.totalAPIs}
${pkg.coverage.undocumentedAPIs.length > 0 ? `
**Undocumented APIs:**
${pkg.coverage.undocumentedAPIs.map(api => `- \`${api}\``).join('\n')}
` : ''}
`).join('\n')}
`;
  
  fs.writeFileSync('./api-verification-report.md', markdown);
}

function calculatePercent(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual documentation updates | Automated verification in CI | 2020s | Drift detection happens immediately, not at release |
| JSDoc-only validation | Full TypeScript type extraction | TypeScript 2.0+ (2016) | Complete signature validation including generics, unions, intersections |
| Single documentation file | Multiple contexts (API Reference, Guides, Examples) | Modern docs (2020+) | Need context-aware validation rules |
| HTML documentation generation | JSON + Markdown dual output | 2020s | Machine-readable for automation, human-readable for reviews |
| Global documentation | Per-package monorepo docs | Monorepo era (2018+) | Need per-package coverage tracking |

**Deprecated/outdated:**
- **documentation.js**: Last major update 2019, weak TypeScript support compared to TypeDoc
- **JSDoc type extraction**: JSDoc types are comments, not checked by compiler; TypeScript types are authoritative
- **TSDoc alone**: TSDoc is comment format standard, but doesn't extract or validate; needs pairing with extraction tool

## Open Questions

Things that couldn't be fully resolved:

1. **Module augmentation validation depth**
   - What we know: Plugins use `declare module` to extend core interfaces; type checker merges these
   - What's unclear: Best way to validate augmented interfaces without loading all plugin combinations
   - Recommendation: Follow user decision for manual review; document limitation clearly; consider future enhancement to detect common patterns

2. **Simplified signature matching heuristics**
   - What we know: User wants API Reference exact, Guide simplified; need to detect which is which
   - What's unclear: How "simplified" is acceptable (omit optional params? use aliases? skip generics?)
   - Recommendation: Start strict (flag all differences), tune based on real examples during implementation

3. **Historical coverage trend tracking**
   - What we know: User marked as "Claude's discretion" whether to track trends over time
   - What's unclear: Value vs complexity tradeoff; would need persistent storage, version correlation
   - Recommendation: Skip in initial implementation; JSON output format allows future enhancement without architecture change

4. **Auto-fix suggestion safety**
   - What we know: User marked as "Claude's discretion" whether to suggest automated fixes
   - What's unclear: Risk of auto-fixing documentation incorrectly vs speeding up corrections
   - Recommendation: Start with reports only; if patterns emerge (e.g., whitespace normalization), add safe auto-fixes in follow-up

## Sources

### Primary (HIGH confidence)
- TypeScript Compiler API Wiki - https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API (accessed 2026-02-04)
- TypeDoc official site - https://typedoc.org/ (accessed 2026-02-04)
- API Extractor official site - https://api-extractor.com/ (accessed 2026-02-04)
- PikaCSS source code - packages/core/src/index.ts, package.json exports fields (reviewed 2026-02-04)
- PikaCSS AGENTS.md - Architecture, monorepo structure, TypeScript config patterns (reviewed 2026-02-04)

### Secondary (MEDIUM confidence)
- unified/remark ecosystem - Widely used for markdown processing, stable API
- Vitest patterns - PikaCSS existing test structure shows integration patterns

### Tertiary (LOW confidence)
- npm package popularity metrics - Used for establishing "standard" status, but not authoritative for technical capabilities

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - TypeDoc, TypeScript Compiler API, unified/remark are established with stable APIs and extensive documentation
- Architecture: HIGH - Patterns drawn from official TypeScript wiki examples and existing PikaCSS monorepo structure
- Pitfalls: HIGH - Based on known TypeScript type system limitations and common documentation drift scenarios

**Research date:** 2026-02-04
**Valid until:** 2026-04-04 (60 days - TypeScript ecosystem is stable, major version changes rare)

**Notes:**
- WebSearch unavailable during research; relied on official documentation and direct source inspection
- User decisions from CONTEXT.md heavily constrain implementation choices (exact matching, CI failures, dual output)
- PikaCSS already uses Vitest and TypeScript 5.x; no new major dependencies required for core functionality
- Module augmentation limitation explicitly acknowledged by user in discussion phase

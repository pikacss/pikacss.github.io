---
title: Contributing Guide
description: How to contribute to PikaCSS
outline: deep
---

# Contributing to PikaCSS

Thank you for your interest in contributing to PikaCSS! This guide will help you get started.

## Ways to Contribute

There are many ways to contribute to PikaCSS:

- 🐛 **Report bugs** - Found a bug? [Open an issue](https://github.com/pikacss/pikacss/issues/new)
- ✨ **Suggest features** - Have an idea? [Start a discussion](https://github.com/pikacss/pikacss/discussions/new)
- 📖 **Improve documentation** - Fix typos, add examples, clarify explanations
- 🔧 **Fix issues** - Browse [open issues](https://github.com/pikacss/pikacss/issues) and submit PRs
- 🎨 **Create plugins** - Share your custom plugins with the community
- 💬 **Help others** - Answer questions in [Discussions](https://github.com/pikacss/pikacss/discussions)
- 🌟 **Spread the word** - Write blog posts, create tutorials, share on social media

## Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 10.24.0+
- Git

### Getting Started

1. **Fork the repository**

   Visit [pikacss/pikacss](https://github.com/pikacss/pikacss) and click "Fork"

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/pikacss.git
   cd pikacss
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Set up git hooks**

   ```bash
   pnpm prepare
   ```

5. **Create a branch**

   ```bash
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/my-bugfix
   ```

## Project Structure

```
pikacss/
├── packages/
│   ├── core/              # Core engine
│   ├── integration/       # Build-time integration
│   ├── unplugin/          # Universal plugin
│   ├── vite/              # Vite plugin
│   ├── nuxt/              # Nuxt module
│   ├── plugin-icons/      # Icons plugin
│   ├── plugin-reset/      # CSS reset plugin
│   └── plugin-typography/ # Typography plugin
├── docs/                  # Documentation site
├── demo/                  # Demo application
└── scripts/               # Build scripts
```

## Development Workflow

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @pikacss/core build

# Watch mode
pnpm --filter @pikacss/core build:watch
```

### Testing

```bash
# Run all tests
pnpm test

# Test specific package
pnpm --filter @pikacss/core test

# Watch mode
pnpm --filter @pikacss/core test:watch

# Coverage
pnpm test:coverage
```

### Type Checking

```bash
# Check all packages
pnpm typecheck
```

### Linting

```bash
# Lint and auto-fix
pnpm lint
```

### Documentation

```bash
# Start docs dev server
pnpm docs:dev

# Build docs
pnpm docs:build

# Preview built docs
pnpm docs:preview
```

## Making Changes

### Code Style

PikaCSS uses ESLint with `@antfu/eslint-config`. The linter runs automatically on commit via lint-staged.

**Key conventions:**

- Use TypeScript for all code
- Use tabs for indentation (configured in ESLint)
- Follow existing code style
- Add JSDoc comments for public APIs
- Write tests for new features

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `chore`: Build process or tooling changes
- `ci`: CI/CD changes

**Examples:**

```bash
feat(core): add support for container queries

fix(unplugin): resolve HMR issue in webpack

docs(guide): add migration guide from tailwind

test(integration): add tests for nuxt module
```

### Adding Features

1. **Check existing issues** - Someone might already be working on it
2. **Create an issue** - Discuss the feature first (for large changes)
3. **Write tests** - Add tests before or alongside implementation
4. **Update docs** - Document new features thoroughly
5. **Add types** - Ensure full TypeScript support
6. **Create PR** - Submit for review

### Fixing Bugs

1. **Create a test** - Add a failing test that reproduces the bug
2. **Fix the bug** - Make the test pass
3. **Check side effects** - Ensure fix doesn't break other features
4. **Update docs** - If behavior changed
5. **Create PR** - Submit for review

### Adding Tests

Tests are written with Vitest:

```typescript
// packages/core/tests/my-feature.test.ts
import { createEngine, defineEngineConfig } from '@pikacss/core'
import { describe, expect, it } from 'vitest'

describe('myFeature', () => {
  it('should work correctly', async () => {
    const engine = await createEngine(defineEngineConfig({}))
    
    const result = await engine.use({ color: 'red' })
    
    expect(result).toBeDefined()
  })
})
```

### Creating Plugins

See [Plugin Development Guide](/advanced/plugin-development) for detailed instructions.

Use the scaffolding tool:

```bash
pnpm newplugin my-plugin
```

This creates:
- `packages/plugin-my-plugin/` directory
- Package configuration
- Basic plugin structure
- Tests setup

## Pull Request Process

### Before Submitting

- [ ] Tests pass: `pnpm test`
- [ ] Types are correct: `pnpm typecheck`
- [ ] Linter passes: `pnpm lint`
- [ ] Docs are updated (if needed)
- [ ] AGENTS.md is updated (if major changes)
- [ ] All commits follow convention
- [ ] Branch is up to date with main

### Submitting

1. **Push your branch**

   ```bash
   git push origin feat/my-feature
   ```

2. **Create Pull Request**

   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill out the PR template
   - Link related issues

3. **PR Title Format**

   Use conventional commit format:
   
   ```
   feat(core): add new feature
   fix(unplugin): resolve bug
   ```

4. **PR Description**

   - Describe what changed and why
   - Include screenshots/demos (if applicable)
   - List breaking changes (if any)
   - Reference related issues

### Review Process

1. **Automated checks** - CI runs tests, linting, type checking
2. **Code review** - Maintainers review your changes
3. **Feedback** - Address any requested changes
4. **Approval** - Once approved, PR will be merged
5. **Release** - Changes included in next release

## Issue Guidelines

### Reporting Bugs

When reporting bugs, include:

- **Description** - Clear description of the bug
- **Reproduction** - Minimal code to reproduce
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Environment**:
  - PikaCSS version
  - Node.js version
  - Build tool and version
  - Framework and version
  - OS

**Example:**

```markdown
## Description
Styles are not applied when using shortcuts

## Reproduction
\`\`\`typescript
// pika.config.ts
shortcuts: [
  ['btn', { padding: '1rem' }]
]

// Component
pika('btn') // No styles applied
\`\`\`

## Expected
Button should have 1rem padding

## Actual
No padding applied

## Environment
- PikaCSS: 0.0.37
- Vite: 5.0.0
- Node: 18.17.0
- OS: macOS 13.5
```

### Suggesting Features

When suggesting features:

- **Use case** - Describe the problem you're solving
- **Proposal** - Describe your solution
- **Alternatives** - Other solutions you considered
- **Examples** - Show code examples

## Documentation Contributions

Documentation is just as important as code!

### Types of Documentation

- **Guides** - Step-by-step tutorials
- **API Reference** - Detailed API docs
- **Examples** - Practical code examples
- **Troubleshooting** - Common issues and solutions
- **Blog posts** - External tutorials and guides

### Documentation Style

- Use clear, simple language
- Include code examples
- Show both good and bad patterns
- Add warnings for edge cases
- Keep examples minimal and focused

### Updating Docs

Docs are in `docs/` directory and built with VitePress:

```bash
# Start dev server
pnpm docs:dev

# Edit markdown files in docs/
# Changes are hot-reloaded

# Build to verify
pnpm docs:build
```

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions
- No harassment or discrimination

### Getting Help

- **GitHub Discussions** - Ask questions, share ideas
- **GitHub Issues** - Report bugs, request features
- **Documentation** - Check docs first
- **Search** - Someone might have asked before

### Helping Others

- Be patient and welcoming
- Point to relevant documentation
- Provide working examples
- Explain the "why" not just the "how"

## Recognition

Contributors are recognized in:

- **GitHub contributors list**
- **Release notes** (significant contributions)
- **Documentation** (plugin authors, tutorial creators)

## Release Process

Releases are managed by maintainers:

1. Run tests and checks: `pnpm test && pnpm typecheck && pnpm lint`
2. Build all packages: `pnpm build`
3. Verify exports: `pnpm publint`
4. Build docs: `pnpm docs:build`
5. Version bump: `pnpm release` (uses bumpp)
6. Publish to npm: `pnpm publish:packages`
7. Update changelog
8. Create GitHub release

## Questions?

- Check [FAQ](/community/faq)
- Ask in [Discussions](https://github.com/pikacss/pikacss/discussions)
- Read [Troubleshooting](/advanced/troubleshooting)

## Thank You!

Every contribution, no matter how small, makes PikaCSS better. Thank you for being part of the community! 🎉

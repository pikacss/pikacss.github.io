# Documentation Templates

Ready-to-use templates for creating different types of documentation quickly and consistently.

## Guide/Tutorial Template

Use for `/docs/guide/` files - step-by-step user guides:

```markdown
---
title: [Feature Name]
description: [One-sentence description of what user will learn]
outline: deep
---

# [Feature Name]

[One paragraph: What this feature does and why users should care]

## Overview

[Section explaining the concept and when to use it]

### Key Concepts

- **Concept 1**: Definition
- **Concept 2**: Definition

## Basic Usage

[Simplest example to get started]

\`\`\`typescript
// Simple example
\`\`\`

## Step-by-Step Guide

### 1. [First Step]

[Explanation and example]

\`\`\`typescript
// Example code
\`\`\`

### 2. [Second Step]

[Explanation and example]

\`\`\`typescript
// Example code
\`\`\`

### 3. [Third Step]

[Explanation and example]

\`\`\`typescript
// Example code
\`\`\`

## Advanced Usage

[More complex scenarios]

\`\`\`typescript
// Advanced example
\`\`\`

## Configuration

[All available options]

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | 'value' | Description |

## Common Issues

**Q: [Common question]**

A: [Answer with code if needed]

**Q: [Another common issue]**

A: [Solution]

## Best Practices

- ✅ Practice 1: [Explanation]
- ✅ Practice 2: [Explanation]
- ❌ Avoid: [What not to do]

## Next Steps

- [Related feature guide]
- [API reference]
- [Example component]

## See Also

- [Related concept]
- [Advanced topic]
```

---

## API Reference Template

Use for `/docs/advanced/` API documentation:

```markdown
---
title: [API Name] Reference
description: Complete reference for [API Name]
outline: deep
---

# [API Name]

[Brief description of what this API does]

## Table of Contents

- [Functions](#functions)
- [Types](#types)
- [Configuration](#configuration)
- [Examples](#examples)

## Functions

### functionName()

[One-sentence description]

**Syntax:**

\`\`\`typescript
function functionName(param: Type): ReturnType
\`\`\`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| param1 | string | Yes | What this does |
| param2 | number | No | Optional parameter |

**Returns:**

Description of return value

**Examples:**

\`\`\`typescript
// Example 1
const result = functionName('value')

// Example 2
const result2 = functionName('value', 42)
\`\`\`

**See Also:**

- Related function
- Related type

---

### anotherFunction()

[Description]

\`\`\`typescript
function anotherFunction(): void
\`\`\`

[Details...]

---

## Types

### TypeName

[Description]

\`\`\`typescript
interface TypeName {
  property1: string
  property2?: number
  property3: boolean
}
\`\`\`

**Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| property1 | string | Yes | Description |
| property2 | number | No | Optional property |
| property3 | boolean | Yes | Description |

---

## Configuration

[Configuration options]

\`\`\`typescript
interface ConfigOptions {
  option1: string
  option2: number
}
\`\`\`

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | 'default' | What it does |
| option2 | number | 42 | What it does |

---

## Examples

### Basic Example

\`\`\`typescript
// [Description]
const result = functionName({
  option1: 'value',
  option2: 10
})
\`\`\`

### Advanced Example

\`\`\`typescript
// [Description]
const advanced = functionName({
  option1: 'complex',
  option2: 99
})
\`\`\`

### Real-World Example

\`\`\`typescript
// [Practical use case]
\`\`\`

---

## Best Practices

- ✅ Best practice 1
- ✅ Best practice 2
- ❌ Avoid doing this

---

## See Also

- [Related API]
- [Related guide]
```

---

## Integration Guide Template

Use for `/docs/integrations/` bundler/framework guides:

```markdown
---
title: [Framework/Bundler] Integration
description: How to set up PikaCSS with [Framework/Bundler]
outline: deep
---

# [Framework/Bundler] Integration

[One paragraph: Why use PikaCSS with this framework and key benefits]

## Prerequisites

- [Requirement 1]
- [Requirement 2]
- Version compatibility info

## Installation

### 1. Install PikaCSS

\`\`\`bash
npm install @pikacss/core @pikacss/unplugin-pikacss
\`\`\`

### 2. [Framework-specific setup]

\`\`\`typescript
// [Config file]
// Framework-specific configuration
\`\`\`

## Configuration

### Create pika.config.ts

\`\`\`typescript
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  prefix: 'app-',
  plugins: [],
  shortcuts: { shortcuts: [] }
})
\`\`\`

### Update [Configuration File]

\`\`\`typescript
// [Specific config for this framework]
\`\`\`

## Basic Usage

\`\`\`tsx
// Component example
function Component() {
  return <div className={pika({ color: 'red' })}>Text</div>
}
\`\`\`

## Development Workflow

\`\`\`bash
# Start dev server
npm run dev

# Make changes and see HMR
# Styles update automatically
\`\`\`

## Building for Production

\`\`\`bash
# Build project
npm run build

# CSS is optimized and included
\`\`\`

## Framework-Specific Features

[Features specific to this framework]

### Feature 1

[Explanation with example]

### Feature 2

[Explanation with example]

## Performance Tips

- Tip 1
- Tip 2
- Tip 3

## Troubleshooting

**Issue: [Common problem]**

Solution: [How to fix it]

**Issue: [Another problem]**

Solution: [How to fix it]

## Examples

[Link to example projects]

## Next Steps

- [Related integration]
- [Plugin documentation]
- [API reference]

## See Also

- [General configuration guide]
- [Troubleshooting guide]
```

---

## Plugin Documentation Template

Use for `/docs/plugins/` plugin guides:

```markdown
---
title: [Plugin Name] Plugin
description: [Brief description of what plugin does]
outline: deep
---

# [Plugin Name]

[One paragraph: What this plugin does and when to use it]

## Installation

\`\`\`bash
npm install @pikacss/plugin-[name]
\`\`\`

## Configuration

\`\`\`typescript
import { [pluginName] } from '@pikacss/plugin-[name]'

export default defineEngineConfig({
  plugins: [[pluginName]()]
})
\`\`\`

## Options

\`\`\`typescript
[pluginName]({
  option1: 'value',
  option2: true
})
\`\`\`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | 'default' | Description |
| option2 | boolean | true | Description |

## Features

- Feature 1: Description
- Feature 2: Description

## Usage

### Basic Usage

\`\`\`typescript
const styles = pika('[plugin-shortcut]')
\`\`\`

### Advanced Usage

\`\`\`typescript
// More complex pattern
\`\`\`

## Examples

\`\`\`tsx
function Component() {
  return <div className={pika('[plugin-feature]')}>Content</div>
}
\`\`\`

## Customization

[How to customize plugin behavior]

## Performance Considerations

[Performance notes and optimization tips]

## Troubleshooting

[Common issues and solutions]

## See Also

- [Other plugins]
- [Configuration guide]
```

---

## FAQ Template

Use for `/docs/community/faq.md`:

```markdown
---
title: Frequently Asked Questions
description: Common questions about PikaCSS
outline: deep
---

# Frequently Asked Questions

## General Questions

### Q: What is PikaCSS?

A: [Answer]

### Q: Why should I use PikaCSS?

A: [Answer with benefits]

### Q: Is PikaCSS production-ready?

A: [Answer]

## Usage Questions

### Q: How do I use PikaCSS with [framework]?

A: [Answer with example]

See [Integration guide](/integrations/[framework]) for details.

### Q: Can I use dynamic values in pika()?

A: No, all values must be statically analyzable. Use CSS variables instead:

\`\`\`typescript
const styles = pika({ color: 'var(--my-color)' })
\`\`\`

### Q: How do I create reusable styles?

A: Use shortcuts in your config:

\`\`\`typescript
shortcuts: {
  shortcuts: [
    ['btn', { padding: '1rem' }]
  ]
}
\`\`\`

## Performance Questions

### Q: How large is PikaCSS?

A: [Package size info]

### Q: Will PikaCSS slow down my app?

A: [Performance explanation]

## Advanced Questions

### Q: Can I write custom plugins?

A: Yes! See [Plugin Development](/advanced/plugin-development)

### Q: How do I contribute?

A: See [Contributing](/community/contributing)

## Support

Can't find your answer here?

- [GitHub Discussions]
- [GitHub Issues]
- [Community Discord]
```

---

## Example Component Template

Use for `/docs/examples/`:

```markdown
---
title: [Component Name] Example
description: Complete example of [Component Name]
outline: deep
---

# [Component Name]

[Description of what this component does]

## Configuration

[pika.config.ts setup needed]

\`\`\`typescript
// pika.config.ts
shortcuts: {
  shortcuts: [
    ['[component-shortcut]', { /* styles */ }],
  ]
}
\`\`\`

## Component Code

\`\`\`tsx
function [ComponentName]({ prop1, prop2 }) {
  return (
    <div className={pika('...')}>
      {/* Component content */}
    </div>
  )
}
\`\`\`

## Usage

\`\`\`tsx
<[ComponentName] prop1="value" />
\`\`\`

## Features

- Feature 1
- Feature 2
- Feature 3

## Variants

### Variant 1

[Description and usage]

### Variant 2

[Description and usage]

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | string | 'default' | Description |
| prop2 | boolean | false | Description |

## Customization

[How to customize the component]

## Accessibility

[a11y considerations]

## See Also

- [Related component]
- [Pattern guide]
```

---

## Usage Notes

### Choosing a Template

- **User learning something new** → Guide/Tutorial
- **Looking up API details** → API Reference  
- **Setting up with framework** → Integration Guide
- **Using a plugin** → Plugin Documentation
- **Answering questions** → FAQ
- **Learning by example** → Example Component

### Customization

All templates are starting points. Customize based on your content:

- Add/remove sections as needed
- Adjust table formats for your content
- Expand examples based on complexity
- Add framework-specific details

### Best Practices

1. Keep sections in logical order
2. Use consistent formatting
3. Include practical examples
4. Link to related content
5. Test all code examples
6. Review for clarity and grammar


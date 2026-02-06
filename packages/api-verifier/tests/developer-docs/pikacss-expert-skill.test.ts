/* eslint-disable ts/ban-ts-comment */
// @ts-nocheck - Test file with extensive regex matching where TypeScript cannot infer non-null
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('pikacss-expert SKILL.md Validation', () => {
	const monorepoRoot = resolve(__dirname, '../../../..')
	const skillPath = join(monorepoRoot, 'skills/pikacss-expert/SKILL.md')
	const skillContent = readFileSync(skillPath, 'utf-8')

	it('imports reference correct package names', () => {
		// Extract all import statements
		const importMatches = Array.from(skillContent.matchAll(/import\s+\{[^}]+\}\s+from\s+['"]([^'"]+)['"]/g))
		const imports = importMatches.map(m => m[1])

		// Verify @pikacss/core imports are correct
		const coreImports = imports.filter(imp => imp.startsWith('@pikacss/core'))
		expect(coreImports.length, 'Should have examples importing from @pikacss/core')
			.toBeGreaterThan(0)

		// Verify core package exists
		const corePackagePath = join(monorepoRoot, 'packages/core/package.json')
		expect(existsSync(corePackagePath), '@pikacss/core package should exist')
			.toBe(true)

		// Verify package name matches
		const corePackageJson = JSON.parse(readFileSync(corePackagePath, 'utf-8'))
		expect(corePackageJson.name)
			.toBe('@pikacss/core')
	})

	it('pika() API examples use valid property names', () => {
		// Extract all pika() style definitions
		const pikaCallMatches = Array.from(skillContent.matchAll(/pika\(\{([\s\S]*?)\}\)/g))

		expect(pikaCallMatches.length, 'Should have multiple pika() examples')
			.toBeGreaterThan(5)

		// List of common valid CSS properties (subset for basic validation)
		const validCSSProperties = [
			'display',
			'flexDirection',
			'gap',
			'padding',
			'margin',
			'color',
			'backgroundColor',
			'borderRadius',
			'border',
			'width',
			'height',
			'minHeight',
			'maxWidth',
			'fontSize',
			'fontWeight',
			'lineHeight',
			'content',
			'transform',
			'outline',
			'gridTemplateColumns',
		]

		// Check that documented properties are valid CSS properties or special selectors
		for (const match of pikaCallMatches) {
			const content = match[1]
			// More precise property matching: look for property names at start of line or after comma/brace
			const propertyMatches = Array.from(content.matchAll(/(?:^|\{|,)\s*['"]?([a-z$&@][\w-]*)['"]?\s*:/gim))

			for (const propMatch of propertyMatches) {
				const prop = propMatch[1].trim()

				// Skip if it's a special selector or media query
				if (prop.startsWith('$') || prop.startsWith('&') || prop.startsWith('@media') || prop === 'icon' || prop === 'h1' || prop === 'btn' || prop === 'variant' || prop === 'size' || prop === 'name') {
					continue
				}

				// Should be a valid CSS property
				const isValid = validCSSProperties.includes(prop)
					|| prop.includes('-') // kebab-case properties
					|| /^[a-z][a-zA-Z]*$/.test(prop) // camelCase properties

				expect(isValid, `Property "${prop}" should be a valid CSS property or special selector`)
					.toBe(true)
			}
		}
	})

	it('pseudo-element examples use correct $ syntax', () => {
		// Find pseudo-element section
		const pseudoElementMatch = skillContent.match(/### Pseudo-Elements[\s\S]*?```typescript([\s\S]*?)```/)
		expect(pseudoElementMatch, 'Pseudo-Elements section should exist')
			.toBeTruthy()

		const pseudoCode = pseudoElementMatch![1]

		// Verify correct $ prefixes are used
		expect(pseudoCode)
			.toMatch(/\$before/)
		expect(pseudoCode)
			.toMatch(/\$after/)

		// Verify NOT using incorrect syntax
		expect(pseudoCode).not.toMatch(/::before/)
		expect(pseudoCode).not.toMatch(/::after/)
		expect(pseudoCode).not.toMatch(/&:before/)
		expect(pseudoCode).not.toMatch(/&:after/)
	})

	it('pseudo-class examples use correct & syntax', () => {
		// Find pseudo-class section
		const pseudoClassMatch = skillContent.match(/### Pseudo-Classes[\s\S]*?```typescript([\s\S]*?)```/)
		expect(pseudoClassMatch, 'Pseudo-Classes section should exist')
			.toBeTruthy()

		const pseudoCode = pseudoClassMatch![1]

		// Verify & prefix is used
		expect(pseudoCode)
			.toMatch(/&:hover/)
		expect(pseudoCode)
			.toMatch(/&:active/)
		expect(pseudoCode)
			.toMatch(/&:focus-visible/)
	})

	it('responsive design examples use correct media query syntax', () => {
		// Find responsive section
		const responsiveMatch = skillContent.match(/### Responsive Design[\s\S]*?```typescript([\s\S]*?)```/)
		expect(responsiveMatch, 'Responsive Design section should exist')
			.toBeTruthy()

		const responsiveCode = responsiveMatch![1]

		// Verify @media syntax
		expect(responsiveCode)
			.toMatch(/@media \(min-width: \d+px\)/)

		// Verify proper nested structure
		expect(responsiveCode)
			.toMatch(/@media[^{]*\{[^}]+\}/)
	})

	it('dark mode example uses correct prefers-color-scheme syntax', () => {
		// Find dark mode section
		const darkModeMatch = skillContent.match(/### Dark Mode[\s\S]*?```typescript([\s\S]*?)```/)
		expect(darkModeMatch, 'Dark Mode section should exist')
			.toBeTruthy()

		const darkModeCode = darkModeMatch![1]

		// Verify correct media query
		expect(darkModeCode)
			.toMatch(/@media \(prefers-color-scheme: dark\)/)
	})

	it('references official plugins that exist', () => {
		// Find shortcuts section
		const shortcutsMatch = skillContent.match(/### Using Built-in Shortcuts[\s\S]*?```typescript([\s\S]*?)```/)

		if (shortcutsMatch) {
			const shortcutsCode = shortcutsMatch[1]

			// If icons plugin is referenced, verify it exists
			if (shortcutsCode.includes('@pikacss/plugin-icons')) {
				const iconsPackagePath = join(monorepoRoot, 'packages/plugin-icons/package.json')
				expect(existsSync(iconsPackagePath), '@pikacss/plugin-icons should exist')
					.toBe(true)
			}

			// If typography plugin is referenced, verify it exists
			if (shortcutsCode.includes('@pikacss/plugin-typography')) {
				const typographyPackagePath = join(monorepoRoot, 'packages/plugin-typography/package.json')
				expect(existsSync(typographyPackagePath), '@pikacss/plugin-typography should exist')
					.toBe(true)
			}

			// If reset plugin is referenced, verify it exists
			if (shortcutsCode.includes('@pikacss/plugin-reset')) {
				const resetPackagePath = join(monorepoRoot, 'packages/plugin-reset/package.json')
				expect(existsSync(resetPackagePath), '@pikacss/plugin-reset should exist')
					.toBe(true)
			}
		}
	})

	it('code examples are syntactically valid TypeScript', () => {
		// Extract all TypeScript code blocks
		const codeBlocks = Array.from(skillContent.matchAll(/```(?:typescript|ts)\n([\s\S]*?)```/g))

		expect(codeBlocks.length, 'Should have multiple TypeScript examples')
			.toBeGreaterThan(5)

		for (const block of codeBlocks) {
			const code = block[1]

			// Skip if code is undefined (shouldn't happen, but TypeScript strict null check)
			if (!code)
				continue

			// Basic syntax checks
			// Check balanced braces
			const openBraces = (code.match(/\{/g) || []).length
			const closeBraces = (code.match(/\}/g) || []).length
			expect(openBraces, 'Open braces should equal close braces')
				.toBe(closeBraces)

			// Check balanced parentheses
			const openParens = (code.match(/\(/g) || []).length
			const closeParens = (code.match(/\)/g) || []).length
			expect(openParens, 'Open parentheses should equal close parentheses')
				.toBe(closeParens)

			// Check balanced brackets
			const openBrackets = (code.match(/\[/g) || []).length
			const closeBrackets = (code.match(/\]/g) || []).length
			expect(openBrackets, 'Open brackets should equal close brackets')
				.toBe(closeBrackets)
		}
	})

	it('static evaluation examples clearly distinguish allowed vs not allowed', () => {
		// Find static evaluation section
		const staticEvalMatch = skillContent.match(/### Static Evaluation Requirement[\s\S]*?```typescript([\s\S]*?)```/)
		expect(staticEvalMatch, 'Static Evaluation Requirement section should exist')
			.toBeTruthy()

		const staticEvalCode = staticEvalMatch![1]

		// Verify examples use ✅ and ❌ markers
		expect(staticEvalCode)
			.toContain('✅')
		expect(staticEvalCode)
			.toContain('❌')

		// Verify allowed pattern is shown
		expect(staticEvalCode)
			.toMatch(/const styles = pika\(\{ color: ['"]red['"] \}\)/)

		// Verify not-allowed pattern is shown (runtime variable)
		// Use dotAll flag to match across newlines
		expect(staticEvalCode)
			.toMatch(/function Component[\s\S]*?pika[\s\S]*?color/)

		// Verify solution is shown (CSS variables)
		expect(staticEvalCode)
			.toMatch(/var\(--/)
	})

	it('generated output section references correct file names', () => {
		// Find generated output section
		const outputMatch = skillContent.match(/### Generated Output[\s\S]*?```/)
		expect(outputMatch, 'Generated Output section should exist')
			.toBeTruthy()

		const outputText = outputMatch![0]

		// Verify correct generated file names
		expect(outputText)
			.toContain('pika.gen.css')
		expect(outputText)
			.toContain('pika.gen.ts')
	})

	it('all framework examples use correct APIs', () => {
		// Extract Vue/Nuxt section
		const vueMatch = skillContent.match(/\*\*Vue\/Nuxt:\*\*[\s\S]*?```vue([\s\S]*?)```/)
		if (vueMatch) {
			const vueCode = vueMatch[1]
			expect(vueCode)
				.toContain('import { pika }')
			expect(vueCode)
				.toContain('styles.className')
			expect(vueCode)
				.toContain(':class=')
		}

		// Extract React section
		const reactMatch = skillContent.match(/\*\*React:\*\*[\s\S]*?```(?:typescript|tsx)([\s\S]*?)```/)
		if (reactMatch) {
			const reactCode = reactMatch[1]
			expect(reactCode)
				.toContain('import { pika }')
			expect(reactCode)
				.toContain('styles.className')
			expect(reactCode)
				.toContain('className=')
		}
	})
})

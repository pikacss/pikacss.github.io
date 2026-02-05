import * as fs from 'node:fs'
import * as path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('plugin-development.md API documentation', () => {
	const docPath = path.join(__dirname, '../../../../docs/advanced/plugin-development.md')
	const pluginTypesPath = path.join(__dirname, '../../../core/src/internal/plugin.ts')

	it('should document defineEnginePlugin helper', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')
		const source = fs.readFileSync(pluginTypesPath, 'utf-8')

		expect(doc)
			.toContain('defineEnginePlugin')
		expect(source)
			.toMatch(/export.*function defineEnginePlugin/)
	})

	it('should document all valid plugin order values', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')
		const source = fs.readFileSync(pluginTypesPath, 'utf-8')

		// Order: 'pre' | 'post' | undefined
		expect(doc)
			.toContain('\'pre\'')
		expect(doc)
			.toContain('\'post\'')
		expect(doc)
			.toContain('undefined')

		// Verify in source
		expect(source)
			.toMatch(/order\?:.*'pre'.*'post'/)
	})

	it('should document all EnginePlugin hooks', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')
		const source = fs.readFileSync(pluginTypesPath, 'utf-8')

		// Extract hook names from EngineHooksDefinition
		const hooksMatch = source.match(/type EngineHooksDefinition = DefineHooks<\{([^}]+)\}>/)
		expect(hooksMatch)
			.toBeDefined()

		const hookLines = hooksMatch![1].split('\n')
			.filter(line => line.includes(':'))
		const hooks = hookLines.map((line) => {
			const match = line.match(/(\w+):/)
			return match ? match[1] : null
		})
			.filter(Boolean)

		// Common hooks that should be documented
		const commonHooks = ['configureEngine', 'transformStyleDefinitions', 'configureRawConfig']

		commonHooks.forEach((hook) => {
			if (hooks.includes(hook)) {
				// If hook exists in interface, must be documented
				expect(doc)
					.toContain(hook)
			}
		})
	})

	it('should show module augmentation pattern', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')

		expect(doc)
			.toContain('declare module')
		expect(doc)
			.toContain('@pikacss/core')
		expect(doc)
			.toContain('EngineConfig')
	})

	it('should reference official plugins as examples', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')

		// Should reference at least one official plugin
		const officialPlugins = ['plugin-reset', 'plugin-typography', 'plugin-icons']
		const referencesPlugin = officialPlugins.some(plugin => doc.includes(plugin))

		expect(referencesPlugin)
			.toBe(true)
	})

	it('should document plugin testing approaches', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')

		// Should mention testing
		expect(doc.toLowerCase())
			.toMatch(/test/i)

		// Should cover type testing or module augmentation verification
		const mentionsTypeTesting = doc.includes('expectTypeOf')
			|| doc.includes('type test')
			|| doc.toLowerCase()
				.includes('type testing')
		expect(mentionsTypeTesting)
			.toBe(true)
	})

	it('should have correct code syntax in all examples', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')
		const codeBlocks = doc.match(/```typescript\n([\s\S]*?)\n```/g)

		expect(codeBlocks)
			.toBeDefined()
		expect(codeBlocks!.length)
			.toBeGreaterThan(0)

		codeBlocks!.forEach((block) => {
			// Must use defineEnginePlugin correctly (either with return, assignment, or direct call)
			if (block.includes('defineEnginePlugin')) {
				const hasCorrectUsage = block.match(/return\s+defineEnginePlugin\(/)
					|| block.match(/\n\s*defineEnginePlugin\(\{/)
					|| block.match(/=\s*defineEnginePlugin\(/)
				expect(hasCorrectUsage)
					.toBeTruthy()
			}

			// Plugin functions must return EnginePlugin type or use defineEnginePlugin
			if (block.match(/export function \w+\(\)/)) {
				const hasEnginePluginReturn = block.includes(': EnginePlugin') || block.includes('defineEnginePlugin')
				expect(hasEnginePluginReturn)
					.toBe(true)
			}
		})
	})

	it('should show complete plugin workflow (augmentation + implementation)', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')

		// Complete workflow includes:
		// 1. Declare module augmentation
		expect(doc)
			.toContain('declare module')

		// 2. Export plugin function
		expect(doc)
			.toMatch(/export function \w+\(\)/)

		// 3. Use defineEnginePlugin
		expect(doc)
			.toContain('defineEnginePlugin')

		// 4. Show usage in config
		expect(doc)
			.toContain('defineEngineConfig')
	})

	it('should document Available Plugin Hooks section', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')

		expect(doc)
			.toContain('## Available Plugin Hooks')

		// Should categorize hooks
		expect(doc)
			.toMatch(/Configuration Hooks|Transform Hooks|Event Hooks/)
	})

	it('should document Testing Plugins section', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')

		expect(doc)
			.toContain('## Testing Plugins')

		// Should cover different testing types
		expect(doc)
			.toContain('Functional Testing')
		expect(doc)
			.toContain('Type Testing')
		expect(doc)
			.toContain('API Verification')
	})

	it('should include hooks reference table', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')

		// Check for table structure
		expect(doc)
			.toMatch(/\| Hook \| Type \| Description \|/)

		// Verify key hooks are listed
		const keyHooks = ['configureEngine', 'configureRawConfig', 'transformStyleDefinitions']
		keyHooks.forEach((hook) => {
			expect(doc)
				.toContain(hook)
		})
	})

	it('should reference TypeScript expectTypeOf for type tests', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')

		expect(doc)
			.toContain('expectTypeOf')
	})

	it('should link to official plugin repositories', () => {
		const doc = fs.readFileSync(docPath, 'utf-8')

		// Should provide GitHub links or references
		const hasGitHubLinks = doc.includes('github.com') || doc.includes('packages/plugin-')
		expect(hasGitHubLinks)
			.toBe(true)
	})
})

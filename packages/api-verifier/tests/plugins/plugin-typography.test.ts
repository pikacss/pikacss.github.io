import * as fs from 'node:fs'
import * as path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('plugin-typography API documentation', () => {
	const readmePath = path.join(__dirname, '../../../plugin-typography/README.md')
	const sourcePath = path.join(__dirname, '../../../plugin-typography/src/index.ts')
	const stylesPath = path.join(__dirname, '../../../plugin-typography/src/styles.ts')

	it('should document typography() function', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const source = fs.readFileSync(sourcePath, 'utf-8')

		expect(readme)
			.toContain('typography()')
		expect(source)
			.toMatch(/export function typography/)
	})

	it('should document all prose shortcuts', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const source = fs.readFileSync(sourcePath, 'utf-8')

		const baseShortcuts = [
			'prose-base',
			'prose-paragraphs',
			'prose-links',
			'prose-emphasis',
			'prose-kbd',
			'prose-lists',
			'prose-hr',
			'prose-headings',
			'prose-quotes',
			'prose-media',
			'prose-code',
			'prose-tables',
			'prose',
		]

		baseShortcuts.forEach((shortcut) => {
			expect(readme)
				.toContain(shortcut)
			// Verify registered in source (shortcuts.add pattern)
			expect(source)
				.toMatch(new RegExp(`['"]${shortcut}['"]`))
		})
	})

	it('should document size modifier shortcuts', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const source = fs.readFileSync(sourcePath, 'utf-8')

		const sizeModifiers = ['prose-sm', 'prose-lg', 'prose-xl', 'prose-2xl']

		sizeModifiers.forEach((shortcut) => {
			expect(readme)
				.toContain(shortcut)
			// Size modifiers are generated dynamically from sizes object
			const sizeKey = shortcut.replace('prose-', '')
			expect(source)
				.toMatch(new RegExp(`['"]${sizeKey}['"]`))
		})
	})

	it('should document all CSS variables', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const styles = fs.readFileSync(stylesPath, 'utf-8')

		// Extract all variables from typographyVariables object
		const variablePattern = /'(--pk-prose-[^']+)':/g
		const sourceVariables = Array.from(styles.matchAll(variablePattern), m => m[1])

		expect(sourceVariables.length)
			.toBeGreaterThan(0)

		sourceVariables.forEach((varName) => {
			// All variables in source must be documented
			expect(readme)
				.toContain(varName)
		})
	})

	it('should show module augmentation example', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		expect(readme)
			.toContain('declare module')
		expect(readme)
			.toContain('@pikacss/core')
		expect(readme)
			.toContain('EngineConfig')
		expect(readme)
			.toContain('typography')
		expect(readme)
			.toContain('variables')
	})

	it('should have correct function call syntax in examples', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const codeBlocks = readme.match(/```typescript\n([\s\S]*?)\n```/g)

		expect(codeBlocks)
			.toBeDefined()
		expect(codeBlocks!.length)
			.toBeGreaterThan(0)

		codeBlocks!.forEach((block) => {
			if (block.includes('typography') && block.includes('plugins')) {
				// Must be typography() not typography in plugin arrays
				expect(block)
					.toMatch(/typography\(\)/)
			}
		})
	})

	it('should document TypographyPluginOptions interface', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const source = fs.readFileSync(sourcePath, 'utf-8')

		// Check source defines the interface
		expect(source)
			.toContain('export interface TypographyPluginOptions')
		expect(source)
			.toContain('variables?')

		// Check README documents the variables configuration
		expect(readme)
			.toContain('variables')
		expect(readme)
			.toContain('--pk-prose-')
	})

	it('should cross-reference shortcuts between README and implementation', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const source = fs.readFileSync(sourcePath, 'utf-8')

		// Extract shortcuts from implementation
		const shortcutMatches = source.matchAll(/shortcuts\.add\(\['([^']+)'/g)
		const implementedShortcuts = Array.from(shortcutMatches, m => m[1])

		// Filter out size modifiers (they're generated dynamically)
		const explicitShortcuts = implementedShortcuts.filter(s => s && !s.match(/prose-(sm|lg|xl|2xl)/))

		expect(explicitShortcuts.length)
			.toBeGreaterThan(0)

		explicitShortcuts.forEach((shortcut) => {
			expect(readme)
				.toContain(shortcut)
		})
	})
})

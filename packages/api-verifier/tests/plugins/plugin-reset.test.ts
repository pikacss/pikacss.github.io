import * as fs from 'node:fs'
import * as path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('plugin-reset API documentation', () => {
	const readmePath = path.join(__dirname, '../../../plugin-reset/README.md')
	const sourcePath = path.join(__dirname, '../../../plugin-reset/src/index.ts')

	it('should document all exported functions', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const source = fs.readFileSync(sourcePath, 'utf-8')

		// Verify reset() function documented
		expect(readme)
			.toContain('reset()')
		expect(source)
			.toMatch(/export function reset/)
	})

	it('should document all ResetStyle values', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const source = fs.readFileSync(sourcePath, 'utf-8')

		const resetStyles = ['modern-normalize', 'normalize', 'andy-bell', 'eric-meyer', 'the-new-css-reset']

		resetStyles.forEach((style) => {
			expect(readme)
				.toContain(style)
			expect(source)
				.toContain(style)
		})
	})

	it('should show module augmentation pattern', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		expect(readme)
			.toContain('declare module')
		expect(readme)
			.toContain('@pikacss/core')
		expect(readme)
			.toContain('EngineConfig')
	})

	it('should have working code examples', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		// Extract TypeScript code blocks
		const codeBlocks = readme.match(/```typescript\n([\s\S]*?)\n```/g)
		expect(codeBlocks)
			.toBeDefined()
		expect(codeBlocks!.length)
			.toBeGreaterThan(0)

		// Verify reset() is called as function in usage examples (not in type declarations)
		codeBlocks!.forEach((block) => {
			// Skip type declaration blocks
			if (block.includes('declare module')) {
				return
			}
			// In actual usage examples, reset must be called as function
			if (block.includes('plugins') && block.includes('reset')) {
				expect(block)
					.toMatch(/reset\(\)/)
			}
		})
	})
})

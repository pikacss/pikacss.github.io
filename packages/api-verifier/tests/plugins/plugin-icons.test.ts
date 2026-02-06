import * as fs from 'node:fs'
import * as path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('plugin-icons API documentation', () => {
	const readmePath = path.join(__dirname, '../../../plugin-icons/README.md')
	const sourcePath = path.join(__dirname, '../../../plugin-icons/src/index.ts')

	it('should document icons() function', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const source = fs.readFileSync(sourcePath, 'utf-8')

		expect(readme)
			.toContain('icons()')
		expect(source)
			.toMatch(/export function icons/)
	})

	it('should document all three usage methods', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		// Method 1: Direct shortcut
		expect(readme)
			.toContain('pika(\'i-mdi:home\')')

		// Method 2: With additional styles
		expect(readme)
			.toMatch(/pika\('i-[^']+',\s*\{/)

		// Method 3: __shortcut property
		expect(readme)
			.toContain('__shortcut')
		expect(readme)
			.toContain('__shortcut: \'i-mdi:home\'')
	})

	it('should document all rendering modes', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const source = fs.readFileSync(sourcePath, 'utf-8')

		const modes = ['auto', 'mask', 'bg']

		modes.forEach((mode) => {
			expect(readme)
				.toContain(mode)
			expect(source)
				.toContain(mode)
		})

		// Verify mode query strings are documented
		expect(readme)
			.toContain('?mask')
		expect(readme)
			.toContain('?bg')
		expect(readme)
			.toContain('?auto')
	})

	it('should document icon syntax pattern', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		// Pattern: i-{collection}:{name}
		expect(readme)
			.toMatch(/i-\{?collection\}?:\{?name\}?/)
		expect(readme)
			.toContain('i-mdi:') // Example collection
		expect(readme)
			.toContain('i-heroicons:') // Another example
	})

	it('should document all configuration options', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const source = fs.readFileSync(sourcePath, 'utf-8')

		const coreOptions = ['prefix', 'scale', 'mode']

		coreOptions.forEach((option) => {
			expect(readme)
				.toContain(option)
			// Verify option exists in source code
			expect(source)
				.toMatch(new RegExp(`${option}[\\s=]`))
		})

		// Extended options
		const extendedOptions = ['cdn', 'collections', 'autoInstall', 'unit', 'extraProperties', 'processor', 'autocomplete']
		extendedOptions.forEach((option) => {
			expect(readme)
				.toContain(option)
		})
	})

	it('should show complete module augmentation with all options', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		expect(readme)
			.toContain('declare module')
		expect(readme)
			.toContain('@pikacss/core')
		expect(readme)
			.toContain('EngineConfig')
		expect(readme)
			.toContain('icons?:')

		// Core three options should be in module augmentation example
		expect(readme)
			.toContain('prefix')
		expect(readme)
			.toContain('scale')
		expect(readme)
			.toContain('mode')
	})

	it('should have correct function call syntax', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const codeBlocks = readme.match(/```typescript\r?\n([\s\S]*?)\r?\n```/g)

		expect(codeBlocks)
			.toBeDefined()
		expect(codeBlocks!.length)
			.toBeGreaterThan(0)

		// Filter code blocks that import and use icons plugin
		const iconsPluginBlocks = codeBlocks!.filter(block =>
			block.includes('from \'@pikacss/plugin-icons\'') || block.includes('plugins: ['),
		)

		expect(iconsPluginBlocks.length)
			.toBeGreaterThan(0)

		iconsPluginBlocks.forEach((block) => {
			// Must be icons() not icons when used in plugins array
			if (block.includes('plugins:')) {
				expect(block)
					.toMatch(/icons\(\)/)
			}
		})
	})

	it('should document how icons work (implementation detail)', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		// Should explain shortcut registration pattern
		expect(readme.toLowerCase())
			.toMatch(/how.*work/i)

		// Should mention key implementation details
		expect(readme)
			.toContain('shortcut')
		expect(readme)
			.toContain('SVG')
		expect(readme)
			.toContain('CSS')
	})

	it('should document mode behavior correctly', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		// Auto mode detection
		expect(readme)
			.toContain('auto')
		expect(readme)
			.toContain('currentColor')

		// Mask mode description
		expect(readme)
			.toMatch(/mask.*inherit/i)
		expect(readme)
			.toMatch(/mask.*color/i)

		// Background mode description
		expect(readme)
			.toMatch(/bg.*background/i)
	})

	it('should document icon collections', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		// Popular collections
		const collections = ['mdi', 'heroicons', 'tabler', 'carbon', 'lucide']

		collections.forEach((collection) => {
			expect(readme)
				.toContain(collection)
		})

		// Should reference Iconify
		expect(readme)
			.toContain('Iconify')
	})

	it('should explain all three usage methods clearly', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		// Should have section headers or clear delineation
		expect(readme)
			.toMatch(/Method 1/i)
		expect(readme)
			.toMatch(/Method 2/i)
		expect(readme)
			.toMatch(/Method 3/i)

		// Each method should have example
		expect(readme)
			.toContain('pika(\'i-mdi:home\')')
		expect(readme)
			.toMatch(/pika\('i-[^']+',\s*\{[\s\S]*?fontSize/)
		expect(readme)
			.toContain('__shortcut')
	})

	it('should document configuration with TypeScript interface', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		expect(readme)
			.toContain('interface IconsConfig')

		// Should document types
		expect(readme)
			.toMatch(/prefix\?:.*string/)
		expect(readme)
			.toMatch(/scale\?:.*number/)
		expect(readme)
			.toMatch(/mode\?:.*'auto'.*'mask'.*'bg'/)
	})

	it('should have comprehensive coverage (min 250 lines)', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')
		const lines = readme.split('\n')

		expect(lines.length)
			.toBeGreaterThanOrEqual(250)
	})

	it('should document prefix as string or array', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		expect(readme)
			.toMatch(/prefix\?:.*string.*string\[\]/)
	})

	it('should explain CSS variable generation', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		expect(readme)
			.toContain('CSS')
		expect(readme)
			.toMatch(/variable|custom property/i)
	})

	it('should document default values', () => {
		const readme = fs.readFileSync(readmePath, 'utf-8')

		// Default values should be mentioned
		expect(readme)
			.toContain('\'i-\'') // Default prefix
		expect(readme)
			.toMatch(/default.*1[^.]/) // Default scale
		expect(readme)
			.toMatch(/default.*'auto'/i) // Default mode
	})
})

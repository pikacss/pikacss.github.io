import type { IntegrationContext } from '../../src/types'
import { beforeEach, describe, expect, it } from 'vitest'
import { createCtx } from '../../src/ctx'

describe('transform', () => {
	let ctx: IntegrationContext

	const baseOptions = {
		cwd: '/mock/project',
		currentPackageName: '@pikacss/integration',
		scan: { include: ['**/*.ts'], exclude: ['node_modules/**'] },
		configOrPath: null,
		fnName: 'pika',
		transformedFormat: 'string' as const,
		tsCodegen: false as const,
		cssCodegen: 'pika.gen.css',
		autoCreateConfig: false,
	}

	beforeEach(async () => {
		ctx = createCtx(baseOptions)
		await ctx.setup()
	})

	it('should transform pika() to class names', async () => {
		const code = 'const styles = pika({ color: "red", display: "flex" })'
		const result = await ctx.transform(code, 'test.ts')

		expect(result)
			.toBeDefined()
		expect(result!.code)
			.toMatch(/['"]a b['"]/)
		expect(ctx.usages.has('test.ts'))
			.toBe(true)
	})

	it('should handle multiple pika() calls in same file', async () => {
		const code = `
			const styles1 = pika({ color: "red" })
			const styles2 = pika({ display: "flex" })
		`
		const result = await ctx.transform(code, 'test.ts')

		expect(result)
			.toBeDefined()
		expect(result!.code)
			.toContain('a')
		expect(result!.code)
			.toContain('b')
		expect(ctx.usages.has('test.ts'))
			.toBe(true)
		expect(ctx.usages.get('test.ts')!.length)
			.toBe(2)
	})

	it('should preserve surrounding code', async () => {
		const code = `
			import React from 'react'
			const styles = pika({ color: "red" })
			export default function Component() {}
		`
		const result = await ctx.transform(code, 'test.ts')

		expect(result)
			.toBeDefined()
		expect(result!.code)
			.toContain('import React')
		expect(result!.code)
			.toContain('export default')
		expect(result!.code)
			.toMatch(/['"]a['"]/)
	})

	it('should handle empty pika() call', async () => {
		const code = 'const styles = pika({})'
		const result = await ctx.transform(code, 'test.ts')

		expect(result)
			.toBeDefined()
		expect(result!.code)
			.toContain('\'\'') // Empty string for no styles
	})

	it('should transform all pika() patterns including in strings', async () => {
		const code = `
			const comment = "const styles = pika({ color: 'red' })"
			const realStyles = pika({ color: "blue" })
		`
		const result = await ctx.transform(code, 'test.ts')

		expect(result)
			.toBeDefined()
		// Transform detects both occurrences (including string literal)
		expect(ctx.usages.get('test.ts')!.length)
			.toBe(2)
	})

	it('should transform all pika() patterns including in comments', async () => {
		const code = `
			// const styles = pika({ color: 'red' })
			const realStyles = pika({ color: "blue" })
		`
		const result = await ctx.transform(code, 'test.ts')

		expect(result)
			.toBeDefined()
		// Transform detects both occurrences (including comment)
		expect(ctx.usages.get('test.ts')!.length)
			.toBe(2)
	})

	it('should track usage in usages map', async () => {
		const code = 'const styles = pika({ color: "red" })'
		await ctx.transform(code, 'test.ts')

		expect(ctx.usages.has('test.ts'))
			.toBe(true)
		const usages = ctx.usages.get('test.ts')
		expect(usages)
			.toBeDefined()
		expect(usages!.length)
			.toBe(1)
		expect(usages![0].atomicStyleIds)
			.toContain('a')
	})

	it('should handle pika.str (force string format)', async () => {
		const code = 'const styles = pika.str({ color: "red" })'
		const result = await ctx.transform(code, 'test.ts')

		expect(result)
			.toBeDefined()
		expect(result!.code)
			.toMatch(/['"]a['"]/)
	})

	it('should handle pika.arr (force array format)', async () => {
		const code = 'const styles = pika.arr({ color: "red", display: "flex" })'
		const result = await ctx.transform(code, 'test.ts')

		expect(result)
			.toBeDefined()
		expect(result!.code)
			.toMatch(/\[['"]a['"], ['"]b['"]\]/)
	})

	it('should generate source map', async () => {
		const code = 'const styles = pika({ color: "red" })'
		const result = await ctx.transform(code, 'test.ts')

		expect(result)
			.toBeDefined()
		if (!result)
			return

		expect(result.map)
			.toBeDefined()
		if (result.map) {
			expect(result.map.toString())
				.toContain('mappings')
		}
	})
})

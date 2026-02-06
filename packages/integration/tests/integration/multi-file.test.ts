import type { IntegrationContext } from '../../src/types'
import { beforeEach, describe, expect, it } from 'vitest'
import { createCtx } from '../../src/ctx'

describe('multi-file Integration', () => {
	let ctx: IntegrationContext

	beforeEach(async () => {
		ctx = createCtx({
			cwd: '/mock/project',
			currentPackageName: '@pikacss/integration',
			scan: { include: ['**/*.ts'], exclude: ['node_modules/**'] },
			configOrPath: null,
			fnName: 'pika',
			transformedFormat: 'string' as const,
			tsCodegen: false as const,
			cssCodegen: 'pika.gen.css',
			autoCreateConfig: false,
		})
		await ctx.setup()
	})

	it('should collect usages from multiple files', async () => {
		await ctx.transform('const s1 = pika({ color: "red" })', 'file1.ts')
		await ctx.transform('const s2 = pika({ color: "blue" })', 'file2.ts')
		await ctx.transform('const s3 = pika({ color: "green" })', 'file3.ts')

		expect(ctx.usages.size)
			.toBe(3)
		expect(ctx.usages.has('file1.ts'))
			.toBe(true)
		expect(ctx.usages.has('file2.ts'))
			.toBe(true)
		expect(ctx.usages.has('file3.ts'))
			.toBe(true)

		const css = await ctx.getCssCodegenContent()
		expect(css)
			.toContain('color: red')
		expect(css)
			.toContain('color: blue')
		expect(css)
			.toContain('color: green')
	})

	it('should deduplicate atomic styles across files', async () => {
		// Both files use same style
		await ctx.transform('const s1 = pika({ color: "red" })', 'a.ts')
		await ctx.transform('const s2 = pika({ color: "red" })', 'b.ts')

		const css = await ctx.getCssCodegenContent()
		expect(css)
			.toBeDefined()
		// CSS should contain color: red only ONCE
		const matches = css!.match(/color:\s*red/g)
		expect(matches)
			.toHaveLength(1)
	})

	it('should track usage records correctly', async () => {
		await ctx.transform(
			'const s = pika({ color: "red", display: "flex" })',
			'test.ts',
		)

		const usages = ctx.usages.get('test.ts')
		expect(usages)
			.toBeDefined()
		expect(usages)
			.toHaveLength(1)

		if (usages && usages[0]) {
			expect(usages[0])
				.toHaveProperty('atomicStyleIds')
			expect(usages[0])
				.toHaveProperty('params')
			expect(usages[0].atomicStyleIds)
				.toEqual(['a', 'b'])
		}
	})

	it('should handle multiple pika() calls in same file', async () => {
		await ctx.transform(
			`
      const s1 = pika({ color: "red" })
      const s2 = pika({ color: "blue" })
      `,
			'multi.ts',
		)

		const usages = ctx.usages.get('multi.ts')
		expect(usages)
			.toHaveLength(2)

		const css = await ctx.getCssCodegenContent()
		expect(css)
			.toContain('color: red')
		expect(css)
			.toContain('color: blue')
	})

	it('should preserve usage isolation between files', async () => {
		await ctx.transform('const s = pika({ color: "red" })', 'a.ts')
		await ctx.transform('const s = pika({ color: "blue" })', 'b.ts')

		const usagesA = ctx.usages.get('a.ts')
		const usagesB = ctx.usages.get('b.ts')

		expect(usagesA)
			.toHaveLength(1)
		expect(usagesB)
			.toHaveLength(1)
		expect(usagesA).not.toBe(usagesB)
	})

	it('should aggregate styles from all files in CSS output', async () => {
		// File 1: Red and flex
		await ctx.transform(
			'const s = pika({ color: "red", display: "flex" })',
			'component1.ts',
		)

		// File 2: Blue and grid
		await ctx.transform(
			'const s = pika({ color: "blue", display: "grid" })',
			'component2.ts',
		)

		// File 3: Green and block
		await ctx.transform(
			'const s = pika({ color: "green", display: "block" })',
			'component3.ts',
		)

		const css = await ctx.getCssCodegenContent()

		// All colors
		expect(css)
			.toContain('color: red')
		expect(css)
			.toContain('color: blue')
		expect(css)
			.toContain('color: green')

		// All displays
		expect(css)
			.toContain('display: flex')
		expect(css)
			.toContain('display: grid')
		expect(css)
			.toContain('display: block')
	})

	it('should clear previous usages when transforming same file', async () => {
		// First transform
		await ctx.transform('const s = pika({ color: "red" })', 'test.ts')
		expect(ctx.usages.get('test.ts'))
			.toHaveLength(1)

		// Transform same file again with different styles
		await ctx.transform('const s = pika({ color: "blue", display: "flex" })', 'test.ts')

		// Should replace, not append
		const usages = ctx.usages.get('test.ts')
		expect(usages)
			.toHaveLength(1)

		if (usages && usages[0]) {
			// Should have two styles (color and display)
			expect(usages[0].atomicStyleIds.length)
				.toBe(2)
			// Verify the params are from the second transform
			expect(usages[0].params)
				.toEqual([{ color: 'blue', display: 'flex' }])
		}
	})

	it('should handle complex multi-file scenarios', async () => {
		// Multiple files with overlapping and unique styles
		await ctx.transform(
			'const s = pika({ color: "red", fontSize: "16px" })',
			'Header.tsx',
		)

		await ctx.transform(
			'const s = pika({ color: "red", fontSize: "14px" })',
			'Footer.tsx',
		)

		await ctx.transform(
			'const s = pika({ color: "blue", fontSize: "16px" })',
			'Sidebar.tsx',
		)

		// Should track all 3 files
		expect(ctx.usages.size)
			.toBe(3)

		const css = await ctx.getCssCodegenContent()
		expect(css)
			.toBeDefined()

		// Red appears twice (different styles), should still only have one CSS rule
		const redMatches = css!.match(/color:\s*red/g)
		expect(redMatches)
			.toHaveLength(1)

		// Blue appears once
		const blueMatches = css!.match(/color:\s*blue/g)
		expect(blueMatches)
			.toHaveLength(1)

		// Font sizes: 16px appears twice, 14px once
		// But CSS should deduplicate them
		expect(css)
			.toContain('font-size: 16px')
		expect(css)
			.toContain('font-size: 14px')
	})
})

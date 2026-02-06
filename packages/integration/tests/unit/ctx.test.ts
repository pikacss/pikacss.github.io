import { describe, expect, it } from 'vitest'
import { createCtx } from '../../src/ctx'

describe('createCtx', () => {
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

	it('should create context with minimal options', async () => {
		const ctx = createCtx(baseOptions)
		await ctx.setup()

		expect(ctx)
			.toBeDefined()
		expect(ctx.usages)
			.toBeDefined()
		expect(ctx.resolvedConfig)
			.toBeDefined()
		expect(ctx.engine)
			.toBeDefined()
	})

	it('should load inline config correctly', async () => {
		const inlineConfig = {
			plugins: [],
		}

		const ctx = createCtx({
			...baseOptions,
			configOrPath: inlineConfig,
		})
		await ctx.setup()

		expect(ctx.resolvedConfig)
			.toBeDefined()
		expect(ctx.resolvedConfig!.plugins)
			.toBeDefined()
		// Should have at least the dev plugin added by integration layer
		expect(ctx.resolvedConfig!.plugins!.length)
			.toBeGreaterThan(0)
	})

	it('should handle missing config file gracefully when autoCreateConfig is false', async () => {
		const ctx = createCtx({
			...baseOptions,
			cwd: '/nonexistent/path',
			configOrPath: null,
			autoCreateConfig: false,
		})

		await ctx.setup()

		// Should still create engine with default config
		expect(ctx.engine)
			.toBeDefined()
		expect(ctx.resolvedConfig)
			.toBeNull()
	})

	it('should initialize usages map', async () => {
		const ctx = createCtx(baseOptions)
		await ctx.setup()

		expect(ctx.usages)
			.toBeInstanceOf(Map)
		expect(ctx.usages.size)
			.toBe(0)
	})

	it('should set correct paths', () => {
		const ctx = createCtx(baseOptions)

		expect(ctx.cwd)
			.toBe('/mock/project')
		expect(ctx.cssCodegenFilepath)
			.toContain('pika.gen.css')
		expect(ctx.tsCodegenFilepath)
			.toBe(null) // tsCodegen is false
	})

	it('should configure transform filter', async () => {
		const ctx = createCtx(baseOptions)
		await ctx.setup()

		expect(ctx.transformFilter)
			.toBeDefined()
		expect(ctx.transformFilter.include)
			.toEqual(['**/*.ts'])
		expect(ctx.transformFilter.exclude)
			.toContain('node_modules/**')
		expect(ctx.transformFilter.exclude)
			.toContain(ctx.cssCodegenFilepath)
	})

	it('should handle absolute cssCodegen path', () => {
		const ctx = createCtx({
			...baseOptions,
			cssCodegen: '/absolute/path/to/pika.gen.css',
		})

		expect(ctx.cssCodegenFilepath)
			.toBe('/absolute/path/to/pika.gen.css')
	})

	it('should handle tsCodegen path when enabled', () => {
		const ctx = createCtx({
			...baseOptions,
			tsCodegen: 'pika.gen.ts',
		})

		expect(ctx.tsCodegenFilepath)
			.toContain('pika.gen.ts')
		expect(ctx.transformFilter.exclude)
			.toContain(ctx.tsCodegenFilepath!)
	})
})

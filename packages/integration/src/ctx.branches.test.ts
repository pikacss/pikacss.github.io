import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocked = vi.hoisted(() => ({
	statSync: vi.fn(),
	mkdir: vi.fn(async () => {}),
	readFile: vi.fn(),
	writeFile: vi.fn(async () => {}),
	createEngine: vi.fn(),
	defineEnginePlugin: vi.fn((plugin: unknown) => plugin),
	globbyEntries: [] as string[],
	evalModule: vi.fn(),
	isPackageExists: vi.fn(() => false),
	generateTsCodegenContent: vi.fn(async () => 'export type Generated = true'),
	logDebug: vi.fn(),
	logInfo: vi.fn(),
	logWarn: vi.fn(),
	logError: vi.fn(),
}))

vi.mock('node:fs', () => ({
	statSync: mocked.statSync,
}))

vi.mock('node:fs/promises', () => ({
	mkdir: mocked.mkdir,
	readFile: mocked.readFile,
	writeFile: mocked.writeFile,
}))

vi.mock('@pikacss/core', () => ({
	createEngine: mocked.createEngine,
	defineEnginePlugin: mocked.defineEnginePlugin,
	log: {
		debug: mocked.logDebug,
		info: mocked.logInfo,
		warn: mocked.logWarn,
		error: mocked.logError,
	},
}))

vi.mock('globby', () => ({
	globbyStream: vi.fn(() => ({
		async* [Symbol.asyncIterator]() {
			for (const entry of mocked.globbyEntries)
				yield entry
		},
	})),
}))

vi.mock('local-pkg', () => ({
	isPackageExists: mocked.isPackageExists,
}))

vi.mock('jiti', () => ({
	createJiti: vi.fn(() => ({
		evalModule: mocked.evalModule,
	})),
}))

vi.mock('./tsCodegen', () => ({
	generateTsCodegenContent: mocked.generateTsCodegenContent,
}))

function createMockEngine(config?: Record<string, unknown>) {
	return {
		config: config ?? {},
		store: {
			atomicStyleIds: new Map(),
			atomicStyles: new Map(),
		},
		pluginHooks: {
			transformSelectors: vi.fn(async (_plugins: unknown[], selectors: string[]) => selectors),
		},
		renderLayerOrderDeclaration: vi.fn(() => ''),
		renderPreflights: vi.fn(async (): Promise<string> => ''),
		renderAtomicStyles: vi.fn(async (): Promise<string> => ''),
		use: vi.fn(async (): Promise<string[]> => []),
	}
}

describe('ctx config branches', () => {
	beforeEach(() => {
		vi.resetModules()
		mocked.statSync.mockReset()
		mocked.mkdir.mockClear()
		mocked.readFile.mockReset()
		mocked.writeFile.mockClear()
		mocked.createEngine.mockReset()
		mocked.defineEnginePlugin.mockClear()
		mocked.evalModule.mockReset()
		mocked.isPackageExists.mockReset()
		mocked.isPackageExists.mockReturnValue(false)
		mocked.generateTsCodegenContent.mockClear()
		mocked.logDebug.mockClear()
		mocked.logInfo.mockClear()
		mocked.logWarn.mockClear()
		mocked.logError.mockClear()
		mocked.globbyEntries.length = 0
	})

	it('loads a specific config path when it exists', async () => {
		mocked.statSync.mockReturnValue({ isFile: () => true })
		mocked.readFile.mockResolvedValue('export default { prefix: "cfg-" }')
		mocked.evalModule.mockResolvedValue({ default: { prefix: 'cfg-' } })
		mocked.createEngine.mockResolvedValue(createMockEngine())
		const { createCtx } = await import('./ctx')

		const ctx = createCtx({
			cwd: '/workspace/project',
			currentPackageName: '@pikacss/integration',
			scan: { include: ['src/**/*.ts'], exclude: ['dist/**'] },
			configOrPath: 'config/pika.config.ts',
			fnName: 'pika',
			transformedFormat: 'string',
			tsCodegen: 'pika.gen.ts',
			cssCodegen: 'pika.gen.css',
			autoCreateConfig: false,
		})

		await ctx.loadConfig()

		expect(ctx.resolvedConfigPath)
			.toBe('/workspace/project/config/pika.config.ts')
		expect(ctx.resolvedConfig)
			.toEqual({ prefix: 'cfg-' })
		expect(mocked.writeFile)
			.not.toHaveBeenCalled()
	})

	it('scaffolds a config file and falls back to the default engine when createEngine fails', async () => {
		mocked.statSync.mockReturnValue(undefined)
		mocked.readFile.mockResolvedValue('export default { prefix: "auto-" }')
		mocked.evalModule.mockResolvedValue({ default: { prefix: 'auto-' } })
		mocked.createEngine
			.mockRejectedValueOnce(new Error('broken engine'))
			.mockResolvedValueOnce(createMockEngine())
		const { createCtx } = await import('./ctx')

		const ctx = createCtx({
			cwd: '/workspace/project',
			currentPackageName: '@pikacss/integration',
			scan: { include: ['src/**/*.ts'], exclude: ['dist/**'] },
			configOrPath: undefined,
			fnName: 'pika',
			transformedFormat: 'string',
			tsCodegen: 'pika.gen.ts',
			cssCodegen: 'pika.gen.css',
			autoCreateConfig: true,
		})

		await ctx.setup()

		expect(mocked.mkdir)
			.toHaveBeenCalled()
		expect(mocked.writeFile)
			.toHaveBeenCalledWith(
				'/workspace/project/pika.config.js',
				expect.stringContaining('/// <reference path="./pika.gen.ts" />'),
			)
		const scaffoldContent = (mocked.writeFile.mock.calls as any[][])[0]?.[1] as string | undefined
		expect(scaffoldContent)
			.toContain('import { defineEngineConfig } from \'@pikacss/integration\'')
		expect(ctx.resolvedConfigPath)
			.toBe('/workspace/project/pika.config.js')
		expect(mocked.createEngine)
			.toHaveBeenCalledTimes(2)
		expect(mocked.createEngine.mock.calls[1]?.[0])
			.toMatchObject({
				plugins: [
					{ name: '@pikacss/integration:dev' },
				],
			})
		expect(ctx.engine)
			.toBeDefined()
	})

	it('keeps config state empty when no config exists and auto creation is disabled', async () => {
		mocked.statSync.mockReturnValue(undefined)
		mocked.createEngine.mockResolvedValue(createMockEngine())
		const { createCtx } = await import('./ctx')

		const ctx = createCtx({
			cwd: '/workspace/project',
			currentPackageName: '@pikacss/integration',
			scan: { include: ['src/**/*.ts'], exclude: ['dist/**'] },
			configOrPath: undefined,
			fnName: 'pika',
			transformedFormat: 'array',
			tsCodegen: false,
			cssCodegen: 'pika.gen.css',
			autoCreateConfig: false,
		})

		await ctx.setup()

		expect(ctx.resolvedConfig)
			.toBeNull()
		expect(ctx.resolvedConfigPath)
			.toBeNull()
		expect(mocked.writeFile)
			.not.toHaveBeenCalled()
		expect(mocked.createEngine.mock.calls[0]?.[0])
			.toMatchObject({
				plugins: [
					{ name: '@pikacss/integration:dev' },
				],
			})
	})

	it('scans files and writes css plus ts codegen outputs', async () => {
		const engine = createMockEngine()
		engine.renderLayerOrderDeclaration.mockReturnValue('@layer utilities;')
		engine.renderPreflights.mockResolvedValue(':root {\n  color: red;\n}')
		engine.renderAtomicStyles.mockResolvedValue('.pk-a {\n  color: red;\n}')
		engine.use.mockResolvedValue(['pk-a', 'shared'])
		mocked.createEngine.mockResolvedValue(engine)
		mocked.readFile.mockResolvedValue('const cls = pika({ color: "red" })')
		mocked.globbyEntries[0] = 'src/entry-a.ts'
		mocked.globbyEntries[1] = 'src/entry-b.ts'
		const { createCtx } = await import('./ctx')

		const ctx = createCtx({
			cwd: '/workspace/project',
			currentPackageName: '@pikacss/integration',
			scan: { include: ['src/**/*.ts'], exclude: ['dist/**'] },
			configOrPath: {},
			fnName: 'pika',
			transformedFormat: 'string',
			tsCodegen: 'pika.gen.ts',
			cssCodegen: 'pika.gen.css',
			autoCreateConfig: false,
		})

		await ctx.setup()
		await ctx.fullyCssCodegen()
		await ctx.writeTsCodegenFile()

		expect(mocked.readFile)
			.toHaveBeenNthCalledWith(1, '/workspace/project/src/entry-a.ts', 'utf-8')
		expect(mocked.readFile)
			.toHaveBeenNthCalledWith(2, '/workspace/project/src/entry-b.ts', 'utf-8')
		expect(engine.renderAtomicStyles)
			.toHaveBeenCalledWith(true, { atomicStyleIds: ['pk-a', 'shared'] })
		expect(mocked.writeFile)
			.toHaveBeenCalledWith(
				'/workspace/project/pika.gen.css',
				expect.stringContaining('/* Auto-generated by @pikacss/integration */'),
			)
		expect(mocked.writeFile)
			.toHaveBeenCalledWith('/workspace/project/pika.gen.ts', 'export type Generated = true')
	})

	it('swallows setup failures, clears setupPromise, and allows retry', async () => {
		mocked.createEngine
			.mockRejectedValueOnce(new Error('broken engine'))
			.mockRejectedValueOnce(new Error('broken fallback'))
			.mockResolvedValueOnce(createMockEngine())
		const { createCtx } = await import('./ctx')

		const ctx = createCtx({
			cwd: '/workspace/project',
			currentPackageName: '@pikacss/integration',
			scan: { include: ['src/**/*.ts'], exclude: ['dist/**'] },
			configOrPath: {},
			fnName: 'pika',
			transformedFormat: 'string',
			tsCodegen: false,
			cssCodegen: 'pika.gen.css',
			autoCreateConfig: false,
		})

		const firstSetup = ctx.setup()
		expect(ctx.setupPromise)
			.toBe(firstSetup)
		await firstSetup

		expect(ctx.setupPromise)
			.toBeNull()
		expect(() => ctx.engine)
			.toThrow('Engine is not initialized yet')

		await ctx.setup()

		expect(ctx.setupPromise)
			.toBeNull()
		expect(ctx.engine)
			.toBeDefined()
	})

	it('continues full css codegen after transform failures and writes empty usage output', async () => {
		const engine = createMockEngine()
		engine.renderLayerOrderDeclaration.mockReturnValue('@layer utilities;')
		engine.renderPreflights.mockResolvedValue('')
		engine.renderAtomicStyles.mockResolvedValue('')
		engine.use.mockRejectedValue(new Error('transform boom'))
		mocked.createEngine.mockResolvedValue(engine)
		mocked.readFile.mockResolvedValue('const cls = pika({ color: "red" })')
		mocked.globbyEntries[0] = 'src/broken.ts'
		const { createCtx } = await import('./ctx')

		const ctx = createCtx({
			cwd: '/workspace/project',
			currentPackageName: '@pikacss/integration',
			scan: { include: ['src/**/*.ts'], exclude: ['dist/**'] },
			configOrPath: {},
			fnName: 'pika',
			transformedFormat: 'string',
			tsCodegen: false,
			cssCodegen: 'pika.gen.css',
			autoCreateConfig: false,
		})

		await ctx.setup()
		await expect(ctx.fullyCssCodegen()).resolves.toBeUndefined()

		expect(ctx.usages.size)
			.toBe(0)
		expect(engine.renderAtomicStyles)
			.toHaveBeenCalledWith(true, { atomicStyleIds: [] })
		expect(mocked.writeFile)
			.toHaveBeenCalledWith('/workspace/project/pika.gen.css', '/* Auto-generated by @pikacss/integration */\n@layer utilities;')
	})

	it('skips ts codegen writes when tsCodegen is disabled', async () => {
		mocked.createEngine.mockResolvedValue(createMockEngine())
		const { createCtx } = await import('./ctx')

		const ctx = createCtx({
			cwd: '/workspace/project',
			currentPackageName: '@pikacss/integration',
			scan: { include: ['src/**/*.ts'], exclude: ['dist/**'] },
			configOrPath: {},
			fnName: 'pika',
			transformedFormat: 'string',
			tsCodegen: false,
			cssCodegen: 'pika.gen.css',
			autoCreateConfig: false,
		})

		await ctx.setup()
		await ctx.writeTsCodegenFile()

		expect(mocked.generateTsCodegenContent)
			.not.toHaveBeenCalled()
		expect(mocked.writeFile)
			.not.toHaveBeenCalled()
	})

	it('warns and skips malformed source scanner matches', async () => {
		const engine = createMockEngine()
		mocked.createEngine.mockResolvedValue(engine)
		const { createCtx } = await import('./ctx')

		const ctx = createCtx({
			cwd: '/workspace/project',
			currentPackageName: '@pikacss/integration',
			scan: { include: ['src/**/*.ts'], exclude: ['dist/**'] },
			configOrPath: {},
			fnName: 'pika',
			transformedFormat: 'string',
			tsCodegen: false,
			cssCodegen: 'pika.gen.css',
			autoCreateConfig: false,
		})

		await ctx.setup()

		await expect(ctx.transform('const cls = pika(`tone-${color`)', 'broken-template.ts')).resolves.toBeUndefined()
		await expect(ctx.transform('const cls = pika(// unfinished', 'broken-line-comment.ts')).resolves.toBeUndefined()
		await expect(ctx.transform('const cls = pika(/* unfinished', 'broken-block-comment.ts')).resolves.toBeUndefined()

		expect(mocked.logWarn)
			.toHaveBeenCalledWith(expect.stringContaining('Malformed template literal expression in function call at position'))
		expect(mocked.logWarn)
			.toHaveBeenCalledWith(expect.stringContaining('Unclosed function call at position'))
		expect(mocked.logWarn)
			.toHaveBeenCalledWith(expect.stringContaining('Unclosed comment in function call at position'))
		expect(mocked.logWarn)
			.toHaveBeenCalledWith(expect.stringContaining('Malformed function call at position'))
		expect(engine.use)
			.not.toHaveBeenCalled()
		expect(ctx.usages.size)
			.toBe(0)
	})

	it('continues scanning later valid calls after a malformed match', async () => {
		const engine = createMockEngine()
		engine.use.mockResolvedValue(['pk-a'])
		mocked.createEngine.mockResolvedValue(engine)
		const { createCtx } = await import('./ctx')

		const ctx = createCtx({
			cwd: '/workspace/project',
			currentPackageName: '@pikacss/integration',
			scan: { include: ['src/**/*.ts'], exclude: ['dist/**'] },
			configOrPath: {},
			fnName: 'pika',
			transformedFormat: 'string',
			tsCodegen: false,
			cssCodegen: 'pika.gen.css',
			autoCreateConfig: false,
		})

		await ctx.setup()

		const result = await ctx.transform([
			'const bad = pika(`tone-${color`)',
			'const good = pika({ color: "red" })',
		].join('\n'), 'mixed.ts')

		expect(mocked.logWarn)
			.toHaveBeenCalledWith(expect.stringContaining('Malformed template literal expression in function call at position'))
		expect(mocked.logWarn)
			.toHaveBeenCalledWith(expect.stringContaining('Malformed function call at position'))
		expect(engine.use)
			.toHaveBeenCalledTimes(1)
		expect(engine.use)
			.toHaveBeenCalledWith({ color: 'red' })
		expect(result?.code)
			.toContain('const good = \'pk-a\'')
		expect(ctx.usages.get('mixed.ts'))
			.toEqual([
				{ atomicStyleIds: ['pk-a'], params: [{ color: 'red' }] },
			])
	})
})

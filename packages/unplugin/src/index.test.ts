import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocked = vi.hoisted(() => ({
	createCtx: vi.fn(),
	createUnplugin: vi.fn((factory: unknown) => factory),
	readFileSync: vi.fn(),
}))

vi.mock('node:fs', () => ({
	readFileSync: mocked.readFileSync,
}))

vi.mock('@pikacss/integration', () => ({
	createCtx: mocked.createCtx,
	log: {
		debug: vi.fn(),
		info: vi.fn(),
	},
}))

vi.mock('perfect-debounce', () => ({
	debounce: (fn: (...args: any[]) => any) => fn,
}))

vi.mock('unplugin', () => ({
	createUnplugin: mocked.createUnplugin,
}))

function createMockCtx() {
	return {
		cwd: process.cwd(),
		cssCodegenFilepath: '/virtual/pika.gen.css',
		tsCodegenFilepath: '/virtual/pika.gen.ts',
		resolvedConfigPath: '/virtual/pika.config.ts',
		resolvedConfigContent: 'old',
		usages: new Map([['entry.ts', []]]),
		hooks: {
			styleUpdated: { on: vi.fn(() => () => {}) },
			tsCodegenUpdated: { on: vi.fn(() => () => {}) },
		},
		engine: { store: { atomicStyleIds: new Map() } },
		transformFilter: { include: ['**/*.ts'], exclude: ['dist/**'] },
		setup: vi.fn(async () => {}),
		writeCssCodegenFile: vi.fn(async () => {}),
		writeTsCodegenFile: vi.fn(async () => {}),
		fullyCssCodegen: vi.fn(async () => {}),
		transform: vi.fn(async (code: string) => ({ code: `${code}// transformed`, map: {} })),
	}
}

describe('unpluginFactory', () => {
	beforeEach(() => {
		mocked.createCtx.mockReset()
		mocked.createUnplugin.mockClear()
		mocked.readFileSync.mockReset()
	})

	it('creates a context with resolved defaults and handles build lifecycle hooks', async () => {
		const ctx = createMockCtx()
		mocked.createCtx.mockReturnValue(ctx)
		const { unpluginFactory } = await import('./index')

		const plugin = unpluginFactory(undefined, { framework: 'vite' } as any) as any
		const addWatchFile = vi.fn()

		await plugin.buildStart.call({ addWatchFile } as any)
		const resolved = await plugin.resolveId?.call({} as any, 'pika.css')
		const transformed = await plugin.transform.handler.call({ addWatchFile } as any, 'const x = 1', 'entry.ts')

		expect(mocked.createCtx)
			.toHaveBeenCalledWith(expect.objectContaining({
				currentPackageName: '@pikacss/unplugin-pikacss',
				tsCodegen: 'pika.gen.ts',
				cssCodegen: 'pika.gen.css',
				fnName: 'pika',
				transformedFormat: 'string',
				autoCreateConfig: true,
				scan: {
					include: ['**/*.{js,ts,jsx,tsx,vue}'],
					exclude: ['node_modules/**', 'dist/**'],
				},
			}))
		expect(ctx.setup)
			.toHaveBeenCalled()
		expect(ctx.fullyCssCodegen)
			.toHaveBeenCalled()
		expect(addWatchFile)
			.toHaveBeenCalledWith('/virtual/pika.config.ts')
		expect(resolved)
			.toBe('/virtual/pika.gen.css')
		expect(ctx.transform)
			.toHaveBeenCalledWith('const x = 1', 'entry.ts')
		expect(transformed)
			.toEqual({ code: 'const x = 1// transformed', map: {} })
	})

	it('uses runtime context from framework hooks and respects serve mode', async () => {
		const ctx = createMockCtx()
		mocked.createCtx.mockReturnValue(ctx)
		const { unpluginFactory } = await import('./index')

		const plugin = unpluginFactory({ cssCodegen: 'styles.css', tsCodegen: false }, { framework: 'vite' } as any) as any
		plugin.vite.configResolved?.({ root: '/workspace/demo', command: 'serve' } as any)

		await plugin.buildStart.call({ addWatchFile: vi.fn() } as any)

		expect(ctx.fullyCssCodegen).not.toHaveBeenCalled()
		expect(ctx.cwd)
			.toBe('/workspace/demo')
	})

	it('reruns setup when the config file changes in rspack mode', async () => {
		const ctx = createMockCtx()
		mocked.createCtx.mockReturnValue(ctx)
		mocked.readFileSync.mockReturnValue('new-config')
		const { unpluginFactory } = await import('./index')

		const plugin = unpluginFactory(undefined, { framework: 'rspack' } as any) as any
		plugin.rspack?.({
			options: {
				context: '/workspace/rspack',
				mode: 'development',
			},
			watching: {
				invalidateWithChangesAndRemovals: vi.fn(),
				invalidate: vi.fn(),
			},
		} as any)

		await plugin.buildStart.call({ addWatchFile: vi.fn() } as any)
		plugin.watchChange('/virtual/pika.config.ts')

		await Promise.resolve()
		await Promise.resolve()

		expect(ctx.setup)
			.toHaveBeenCalledTimes(2)
		expect(ctx.cwd)
			.toBe('/workspace/rspack')
	})

	it('reloads touched vite modules when the config file changes', async () => {
		const ctx = createMockCtx()
		const module = { id: 'entry.ts' }
		const invalidateModule = vi.fn()
		const reloadModule = vi.fn(async () => {})
		mocked.createCtx.mockReturnValue(ctx)
		mocked.readFileSync.mockReturnValue('new-config')
		const { unpluginFactory } = await import('./index')

		const plugin = unpluginFactory(undefined, { framework: 'vite' } as any) as any
		plugin.vite.configResolved?.({ root: '/workspace/vite', command: 'serve' } as any)
		plugin.vite.configureServer?.({
			moduleGraph: {
				getModuleById: vi.fn(() => module),
				invalidateModule,
			},
			reloadModule,
		} as any)

		await plugin.buildStart.call({ addWatchFile: vi.fn() } as any)
		plugin.watchChange('/virtual/pika.config.ts')

		await vi.waitFor(() => {
			expect(ctx.setup)
				.toHaveBeenCalledTimes(2)
			expect(invalidateModule)
				.toHaveBeenCalledWith(module)
			expect(reloadModule)
				.toHaveBeenCalledWith(module)
		})
	})

	it('recompiles farm dev servers when the config file changes', async () => {
		const ctx = createMockCtx()
		const recompileAndSendResult = vi.fn(async () => {})
		mocked.createCtx.mockReturnValue(ctx)
		mocked.readFileSync.mockReturnValue('new-config')
		const { unpluginFactory } = await import('./index')

		const plugin = unpluginFactory(undefined, { framework: 'farm' } as any) as any
		plugin.farm.configResolved?.({ root: '/workspace/farm', envMode: 'development' } as any)
		plugin.farm.configureDevServer?.({ hmrEngine: { recompileAndSendResult } } as any)

		await plugin.buildStart.call({ addWatchFile: vi.fn() } as any)
		plugin.watchChange('/virtual/pika.config.ts')

		await vi.waitFor(() => {
			expect(ctx.setup)
				.toHaveBeenCalledTimes(2)
			expect(recompileAndSendResult)
				.toHaveBeenCalled()
		})
	})

	it('wires webpack watch files and esbuild virtual css resolution', async () => {
		const ctx = createMockCtx()
		const onResolve = vi.fn()
		const addWatchFile = vi.fn()
		mocked.createCtx.mockReturnValue(ctx)
		const { unpluginFactory } = await import('./index')

		const webpackPlugin = unpluginFactory(undefined, { framework: 'webpack' } as any) as any
		webpackPlugin.webpack?.({ options: { context: '/workspace/webpack', mode: 'development' } } as any)
		await webpackPlugin.transform.handler.call({ addWatchFile } as any, 'const x = 1', 'entry.ts')

		const esbuildPlugin = unpluginFactory(undefined, { framework: 'esbuild' } as any) as any
		await esbuildPlugin.esbuild.setup({
			initialOptions: { absWorkingDir: '/workspace/esbuild' },
			onResolve,
		} as any)
		const resolver = onResolve.mock.calls[0]?.[1]

		expect(addWatchFile)
			.toHaveBeenCalledWith('/virtual/pika.config.ts')
		expect(ctx.cwd)
			.toBe('/workspace/esbuild')
		expect(await resolver?.({ path: 'pika.css' }))
			.toEqual({
				path: '/virtual/pika.gen.css',
				namespace: 'file',
			})
	})

	it('skips watch registration when config paths are absent and ignores unchanged watch events', async () => {
		const ctx = createMockCtx()
		;(ctx as any).resolvedConfigPath = null
		ctx.resolvedConfigContent = 'same-config'
		mocked.createCtx.mockReturnValue(ctx)
		mocked.readFileSync.mockReturnValue('same-config')
		const { unpluginFactory } = await import('./index')

		const plugin = unpluginFactory({ scan: { include: 'src/**/*.ts', exclude: 'coverage/**' } }, { framework: 'vite' } as any) as any
		const addWatchFile = vi.fn()

		await plugin.buildStart.call({ addWatchFile } as any)
		const unrelated = await plugin.resolveId?.call({} as any, 'other.css')
		plugin.watchChange('/virtual/other.config.ts')
		plugin.watchChange('/virtual/pika.config.ts')

		expect(mocked.createCtx)
			.toHaveBeenCalledWith(expect.objectContaining({
				scan: {
					include: ['src/**/*.ts'],
					exclude: ['coverage/**'],
				},
			}))
		expect(addWatchFile)
			.not.toHaveBeenCalled()
		expect(unrelated)
			.toBeNull()
		expect(ctx.setup)
			.toHaveBeenCalledTimes(1)
	})

	it('skips webpack watch registration when config path is absent', async () => {
		const ctx = createMockCtx()
		;(ctx as any).resolvedConfigPath = null
		mocked.createCtx.mockReturnValue(ctx)
		const { unpluginFactory } = await import('./index')

		const webpackPlugin = unpluginFactory(undefined, { framework: 'webpack' } as any) as any
		const addWatchFile = vi.fn()

		await webpackPlugin.transform.handler.call({ addWatchFile } as any, 'const x = 1', 'entry.ts')

		expect(addWatchFile)
			.not.toHaveBeenCalled()
	})

	it('reuses the existing setup promise when buildStart runs repeatedly without reload', async () => {
		const ctx = createMockCtx()
		mocked.createCtx.mockReturnValue(ctx)
		const { unpluginFactory } = await import('./index')

		const plugin = unpluginFactory(undefined, { framework: 'vite' } as any) as any
		const addWatchFile = vi.fn()

		await plugin.buildStart.call({ addWatchFile } as any)
		await plugin.buildStart.call({ addWatchFile } as any)

		expect(ctx.setup)
			.toHaveBeenCalledTimes(1)
	})
})

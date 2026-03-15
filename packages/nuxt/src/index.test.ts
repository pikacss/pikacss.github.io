import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocked = vi.hoisted(() => ({
	addPluginTemplate: vi.fn(),
	addVitePlugin: vi.fn(),
	defineNuxtModule: vi.fn((definition: unknown) => definition),
	vitePluginFactory: vi.fn((options: unknown) => ({ name: 'pika-vite-plugin', options })),
}))

vi.mock('@nuxt/kit', () => ({
	addPluginTemplate: mocked.addPluginTemplate,
	addVitePlugin: mocked.addVitePlugin,
	defineNuxtModule: mocked.defineNuxtModule,
}))

vi.mock('@pikacss/unplugin-pikacss/vite', () => ({
	default: mocked.vitePluginFactory,
}))

describe('nuxt module', () => {
	beforeEach(() => {
		mocked.addPluginTemplate.mockReset()
		mocked.addVitePlugin.mockReset()
		mocked.vitePluginFactory.mockReset()
	})

	it('registers the plugin template and default vite plugin options', async () => {
		const { default: moduleDefinition } = await import('./index')
		await (moduleDefinition as any).setup({}, { options: {} } as any)

		const template = mocked.addPluginTemplate.mock.calls[0]?.[0]
		expect(template.filename)
			.toBe('pikacss.mjs')
		expect(template.getContents())
			.toContain('import "pika.css";')
		expect(mocked.vitePluginFactory)
			.toHaveBeenCalledWith({
				currentPackageName: '@pikacss/nuxt-pikacss',
				scan: { include: ['**/*.{js,ts,jsx,tsx,vue}'] },
			})
		expect(mocked.addVitePlugin)
			.toHaveBeenCalledWith({
				name: 'pika-vite-plugin',
				options: {
					currentPackageName: '@pikacss/nuxt-pikacss',
					scan: { include: ['**/*.{js,ts,jsx,tsx,vue}'] },
				},
				enforce: 'pre',
			})
	})

	it('passes through user nuxt options into the vite plugin factory', async () => {
		const { default: moduleDefinition } = await import('./index')
		await (moduleDefinition as any).setup({}, {
			options: {
				pikacss: {
					fnName: 'atom',
					transformedFormat: 'array',
				},
			},
		} as any)

		expect(mocked.vitePluginFactory)
			.toHaveBeenCalledWith({
				currentPackageName: '@pikacss/nuxt-pikacss',
				fnName: 'atom',
				transformedFormat: 'array',
			})
	})
})

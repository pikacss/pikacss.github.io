import { describe, expect, it, vi } from 'vitest'
import { reset } from './index'

describe('reset plugin', () => {
	it('forces the reset layer and injects the selected reset preflight', async () => {
		const plugin = reset()
		const config: any = { reset: 'normalize', layers: {} }

		plugin.configureRawConfig?.(config)

		expect(config.layers.reset)
			.toBe(-1)

		const addPreflight = vi.fn()
		await plugin.configureEngine?.({ addPreflight } as any)

		expect(addPreflight)
			.toHaveBeenCalledWith({
				layer: 'reset',
				preflight: expect.stringContaining('html'),
			})
	})

	it('defaults to modern-normalize when no explicit reset is configured', async () => {
		const plugin = reset()
		const addPreflight = vi.fn()

		plugin.configureRawConfig?.({ layers: {} } as any)
		await plugin.configureEngine?.({ addPreflight } as any)

		expect(addPreflight)
			.toHaveBeenCalledWith({
				layer: 'reset',
				preflight: expect.stringContaining('box-sizing'),
			})
	})

	it('skips preflight injection when the reset name is unknown at runtime', async () => {
		const plugin = reset()
		const config: any = {}
		const addPreflight = vi.fn()

		plugin.configureRawConfig?.({ reset: 'missing-reset', layers: config.layers } as any)
		await plugin.configureEngine?.({ addPreflight } as any)

		expect(addPreflight)
			.not.toHaveBeenCalled()
	})
})

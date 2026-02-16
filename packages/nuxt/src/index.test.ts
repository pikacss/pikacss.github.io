import { describe, expect, it } from 'vitest'

describe('nuxt module', () => {
	it('should export the module', async () => {
		const mod = await import('./index')
		expect(mod.default)
			.toBeDefined()
	})
})

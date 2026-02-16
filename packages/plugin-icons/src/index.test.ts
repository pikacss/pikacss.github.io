import { describe, expect, it } from 'vitest'
import { icons } from './index'

describe('icons plugin', () => {
	it('should return a plugin object', () => {
		const plugin = icons()
		expect(plugin)
			.toBeDefined()
		expect(plugin.name)
			.toBe('icons')
	})

	it('should have configureRawConfig hook', () => {
		const plugin = icons()
		expect(typeof plugin.configureRawConfig)
			.toBe('function')
	})

	it('should have configureEngine hook', () => {
		const plugin = icons()
		expect(typeof plugin.configureEngine)
			.toBe('function')
	})
})

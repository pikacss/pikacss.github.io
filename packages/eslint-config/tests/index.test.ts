import { describe, expect, it } from 'vitest'
import pikacss, { plugin, recommended } from '../src/index'

describe('pikacss config factory', () => {
	it('should export plugin as named export', () => {
		expect(plugin)
			.toBeDefined()
		expect(plugin.meta)
			.toBeDefined()
		expect(plugin.meta?.name)
			.toBe('@pikacss/eslint-config')
		expect(plugin.meta?.version)
			.toBe('1.0.0')
		expect(plugin.rules)
			.toBeDefined()
		expect(plugin.rules?.['no-dynamic-args'])
			.toBeDefined()
	})

	it('should export recommended function', () => {
		const config = recommended()
		expect(config.plugins?.pikacss)
			.toBe(plugin)
		expect(config.rules)
			.toBeDefined()
		expect(config.rules?.['pikacss/no-dynamic-args'])
			.toEqual(['error', { fnName: 'pika' }])
	})

	it('should export default factory function', () => {
		const config = pikacss()
		expect(config.plugins?.pikacss)
			.toBe(plugin)
		expect(config.rules?.['pikacss/no-dynamic-args'])
			.toEqual(['error', { fnName: 'pika' }])
	})

	it('should support custom fnName option in recommended', () => {
		const config = recommended({ fnName: 'css' })
		expect(config.rules?.['pikacss/no-dynamic-args'])
			.toEqual(['error', { fnName: 'css' }])
	})

	it('should support custom fnName option in default export', () => {
		const config = pikacss({ fnName: 'css' })
		expect(config.rules?.['pikacss/no-dynamic-args'])
			.toEqual(['error', { fnName: 'css' }])
	})

	it('should use default fnName when option is not provided', () => {
		const config1 = pikacss()
		const config2 = recommended()
		expect(config1.rules?.['pikacss/no-dynamic-args'])
			.toEqual(['error', { fnName: 'pika' }])
		expect(config2.rules?.['pikacss/no-dynamic-args'])
			.toEqual(['error', { fnName: 'pika' }])
	})

	it('should return same config structure from both exports', () => {
		const config1 = pikacss({ fnName: 'test' })
		const config2 = recommended({ fnName: 'test' })
		expect(config1)
			.toEqual(config2)
	})
})

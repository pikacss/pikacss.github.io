import { describe, expect, it } from 'vitest'
import pikacss, { plugin, recommended } from './index'

describe('eslint-config index', () => {
	it('exposes the plugin metadata and rules', () => {
		expect(plugin.meta)
			.toEqual({
				name: '@pikacss/eslint-config',
				version: '1.0.0',
			})
		expect(plugin.rules)
			.toHaveProperty('no-dynamic-args')
	})

	it('builds a recommended flat config with default and custom fn names', () => {
		expect(recommended())
			.toEqual({
				plugins: { pikacss: plugin },
				rules: {
					'pikacss/no-dynamic-args': ['error', { fnName: 'pika' }],
				},
			})

		expect(recommended({ fnName: 'atom' }))
			.toEqual({
				plugins: { pikacss: plugin },
				rules: {
					'pikacss/no-dynamic-args': ['error', { fnName: 'atom' }],
				},
			})
		expect(pikacss({ fnName: 'atom' }))
			.toEqual(recommended({ fnName: 'atom' }))
	})
})

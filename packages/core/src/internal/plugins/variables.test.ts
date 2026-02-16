import { describe, expect, it } from 'vitest'
import { createEngine } from '../engine'
import { extractUsedVarNames, normalizeVariableName } from './variables'

describe('extractUsedVarNames', () => {
	it('should extract a single var name', () => {
		expect(extractUsedVarNames('var(--color)'))
			.toEqual(['--color'])
	})

	it('should extract multiple var names', () => {
		expect(extractUsedVarNames('var(--color) var(--bg)'))
			.toEqual(['--color', '--bg'])
	})

	it('should return empty array for no var() usage', () => {
		expect(extractUsedVarNames('red'))
			.toEqual([])
	})

	it('should return empty array for empty string', () => {
		expect(extractUsedVarNames(''))
			.toEqual([])
	})

	it('should handle var() with fallback values', () => {
		const result = extractUsedVarNames('var(--color, red)')
		expect(result)
			.toEqual(['--color'])
	})

	it('should handle nested var() references', () => {
		const result = extractUsedVarNames('var(--a, var(--b))')
		expect(result)
			.toEqual(['--a', '--b'])
	})

	it('should handle complex CSS values with var()', () => {
		const result = extractUsedVarNames('1px solid var(--border-color)')
		expect(result)
			.toEqual(['--border-color'])
	})

	it('should handle var names with hyphens', () => {
		expect(extractUsedVarNames('var(--my-long-variable-name)'))
			.toEqual(['--my-long-variable-name'])
	})
})

describe('normalizeVariableName', () => {
	it('should return name as-is if it starts with --', () => {
		expect(normalizeVariableName('--color'))
			.toBe('--color')
	})

	it('should prepend -- if missing', () => {
		expect(normalizeVariableName('color'))
			.toBe('--color')
	})

	it('should handle empty string', () => {
		expect(normalizeVariableName(''))
			.toBe('--')
	})

	it('should handle names already with --', () => {
		expect(normalizeVariableName('--my-var'))
			.toBe('--my-var')
	})
})

describe('variables plugin (engine integration)', () => {
	describe('basic variable definition', () => {
		it('should render variables in preflight', async () => {
			const engine = await createEngine({
				variables: {
					variables: {
						'--color': '#fff',
						'--bg': '#000',
					},
					pruneUnused: false,
				},
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('--color: #fff;')
			expect(preflight)
				.toContain('--bg: #000;')
		})

		it('should place variables under :root by default', async () => {
			const engine = await createEngine({
				variables: {
					variables: {
						'--color': '#fff',
					},
					pruneUnused: false,
				},
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain(':root')
			expect(preflight)
				.toContain('--color: #fff;')
		})
	})

	describe('pruneUnused', () => {
		it('should prune unused variables by default (pruneUnused: true)', async () => {
			const engine = await createEngine({
				variables: {
					variables: {
						'--unused-color': '#fff',
					},
				},
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight).not.toContain('--unused-color')
		})

		it('should keep variables when pruneUnused is false', async () => {
			const engine = await createEngine({
				variables: {
					variables: {
						'--always-present': 'blue',
					},
					pruneUnused: false,
				},
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('--always-present: blue;')
		})

		it('should keep used variables when pruneUnused is true', async () => {
			const engine = await createEngine({
				variables: {
					variables: {
						'--text-color': '#333',
					},
					pruneUnused: true,
				},
			})

			await engine.use({ color: 'var(--text-color)' })

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('--text-color: #333;')
		})
	})

	describe('nested selectors', () => {
		it('should place variables under nested selectors', async () => {
			const engine = await createEngine({
				variables: {
					variables: {
						'--color': '#fff',
						'[data-theme="dark"]': {
							'--color': '#000',
						},
					},
					pruneUnused: false,
				},
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain(':root')
			expect(preflight)
				.toContain('--color: #fff;')
			expect(preflight)
				.toContain('[data-theme="dark"]')
			expect(preflight)
				.toContain('--color: #000;')
		})
	})

	describe('null-value variables (autocomplete only)', () => {
		it('should not render variables with null values', async () => {
			const engine = await createEngine({
				variables: {
					variables: {
						'--external-var': null,
					},
					pruneUnused: false,
				},
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight).not.toContain('--external-var')
		})
	})

	describe('safeList', () => {
		it('should keep safeList variables even when pruneUnused is true', async () => {
			const engine = await createEngine({
				variables: {
					variables: {
						'--safe-var': 'green',
						'--unsafe-var': 'red',
					},
					pruneUnused: true,
					safeList: ['--safe-var'],
				},
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('--safe-var: green;')
			expect(preflight).not.toContain('--unsafe-var')
		})
	})

	describe('variable object format', () => {
		it('should support variable object with pruneUnused override', async () => {
			const engine = await createEngine({
				variables: {
					variables: {
						'--always': {
							value: 'red',
							pruneUnused: false,
						},
					},
					pruneUnused: true,
				},
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('--always: red;')
		})
	})

	describe('dynamic add via engine.variables.add', () => {
		it('should allow adding variables dynamically', async () => {
			const engine = await createEngine({
				variables: {
					variables: {},
					pruneUnused: false,
				},
			})

			engine.variables.add({
				'--dynamic-var': 'purple',
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('--dynamic-var: purple;')
		})
	})

	describe('array variables config', () => {
		it('should accept array of variable definitions', async () => {
			const engine = await createEngine({
				variables: {
					variables: [
						{ '--a': 'one' },
						{ '--b': 'two' },
					],
					pruneUnused: false,
				},
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('--a: one;')
			expect(preflight)
				.toContain('--b: two;')
		})
	})
})

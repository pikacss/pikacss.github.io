import { describe, expect, it } from 'vitest'
import { createEngine } from '../engine'

describe('important plugin', () => {
	describe('default config (important defaults to false)', () => {
		it('should not add !important when default is false', async () => {
			const engine = await createEngine()
			const ids = await engine.use({ color: 'red' })
			expect(ids.length)
				.toBe(1)

			const css = await engine.renderAtomicStyles(true)
			expect(css).not.toContain('!important')
			expect(css)
				.toContain('color: red;')
		})
	})

	describe('important default: true', () => {
		it('should add !important to all property values when default is true', async () => {
			const engine = await createEngine({
				important: { default: true },
			})
			const ids = await engine.use({ color: 'red', display: 'flex' })
			expect(ids.length)
				.toBe(2)

			const css = await engine.renderAtomicStyles(true)
			expect(css)
				.toContain('color: red !important;')
			expect(css)
				.toContain('display: flex !important;')
		})
	})

	describe('__important property override', () => {
		it('should add !important when __important is true even if default is false', async () => {
			const engine = await createEngine({
				important: { default: false },
			})
			const ids = await engine.use({ __important: true, color: 'red' } as any)
			expect(ids.length)
				.toBe(1)

			const css = await engine.renderAtomicStyles(true)
			expect(css)
				.toContain('color: red !important;')
		})

		it('should not add !important when __important is false even if default is true', async () => {
			const engine = await createEngine({
				important: { default: true },
			})
			const ids = await engine.use({ __important: false, color: 'red' } as any)
			expect(ids.length)
				.toBe(1)

			const css = await engine.renderAtomicStyles(true)
			expect(css).not.toContain('!important')
			expect(css)
				.toContain('color: red;')
		})
	})

	describe('__important property stripping', () => {
		it('should strip __important from the output and not produce a CSS property for it', async () => {
			const engine = await createEngine()
			await engine.use({ __important: true, color: 'blue' } as any)

			const css = await engine.renderAtomicStyles(true)
			expect(css).not.toContain('__important')
			expect(css)
				.toContain('color: blue !important;')
		})
	})

	describe('tuple property values with !important', () => {
		it('should add !important to tuple [value, fallbacks[]] format', async () => {
			const engine = await createEngine({
				important: { default: true },
			})
			await engine.use({ color: ['red', ['blue']] })

			const css = await engine.renderAtomicStyles(true)
			expect(css)
				.toContain('color: blue !important;')
			expect(css)
				.toContain('color: red !important;')
		})
	})

	describe('null property values', () => {
		it('should handle null values gracefully', async () => {
			const engine = await createEngine({
				important: { default: true },
			})
			await engine.use({ color: null })

			const css = await engine.renderAtomicStyles(true)
			// null property values should be stripped, no output
			expect(css)
				.toBe('')
		})
	})
})

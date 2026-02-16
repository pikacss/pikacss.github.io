import { createEngine } from '@pikacss/core'
import { describe, expect, it } from 'vitest'
import { typography } from './index'

describe('typography plugin', () => {
	it('should have plugin name "typography"', () => {
		const plugin = typography()
		expect(plugin.name)
			.toBe('typography')
	})

	it('should add typography variables to the engine variables store', async () => {
		const engine = await createEngine({
			plugins: [typography()],
		})
		const variableNames = [...engine.variables.store.keys()]
		expect(variableNames)
			.toContain('--pk-prose-color-body')
		expect(variableNames)
			.toContain('--pk-prose-color-headings')
		expect(variableNames)
			.toContain('--pk-prose-color-links')
		expect(variableNames)
			.toContain('--pk-prose-color-code')
		expect(variableNames)
			.toContain('--pk-prose-kbd-shadows')
	})

	it('should register prose-base shortcut', async () => {
		const engine = await createEngine({
			plugins: [typography()],
		})
		const ids = await engine.use('prose-base')
		// prose-base should be resolved (no unknown strings)
		const atomicStyleIds = [...engine.store.atomicStyles.keys()]
		expect(atomicStyleIds.length)
			.toBeGreaterThan(0)
		// All returned ids should be resolved atomic style ids
		for (const id of ids) {
			expect(engine.store.atomicStyles.has(id))
				.toBe(true)
		}
	})

	it('should register prose-paragraphs shortcut', async () => {
		const engine = await createEngine({
			plugins: [typography()],
		})
		const ids = await engine.use('prose-paragraphs')
		expect(ids.length)
			.toBeGreaterThan(0)
		for (const id of ids) {
			expect(engine.store.atomicStyles.has(id))
				.toBe(true)
		}
	})

	it('should register prose-links shortcut', async () => {
		const engine = await createEngine({
			plugins: [typography()],
		})
		const ids = await engine.use('prose-links')
		expect(ids.length)
			.toBeGreaterThan(0)
		for (const id of ids) {
			expect(engine.store.atomicStyles.has(id))
				.toBe(true)
		}
	})

	it('should register composite prose shortcut', async () => {
		const engine = await createEngine({
			plugins: [typography()],
		})
		const ids = await engine.use('prose')
		expect(ids.length)
			.toBeGreaterThan(0)
		for (const id of ids) {
			expect(engine.store.atomicStyles.has(id))
				.toBe(true)
		}
	})

	it('should register prose-sm size variant', async () => {
		const engine = await createEngine({
			plugins: [typography()],
		})
		const ids = await engine.use('prose-sm')
		expect(ids.length)
			.toBeGreaterThan(0)
		const css = await engine.renderAtomicStyles(false)
		expect(css)
			.toContain('0.875rem')
	})

	it('should register prose-lg size variant', async () => {
		const engine = await createEngine({
			plugins: [typography()],
		})
		const ids = await engine.use('prose-lg')
		expect(ids.length)
			.toBeGreaterThan(0)
		const css = await engine.renderAtomicStyles(false)
		expect(css)
			.toContain('1.125rem')
	})

	it('should register prose-xl size variant', async () => {
		const engine = await createEngine({
			plugins: [typography()],
		})
		const ids = await engine.use('prose-xl')
		expect(ids.length)
			.toBeGreaterThan(0)
		const css = await engine.renderAtomicStyles(false)
		expect(css)
			.toContain('1.25rem')
	})

	it('should register prose-2xl size variant', async () => {
		const engine = await createEngine({
			plugins: [typography()],
		})
		const ids = await engine.use('prose-2xl')
		expect(ids.length)
			.toBeGreaterThan(0)
		const css = await engine.renderAtomicStyles(false)
		expect(css)
			.toContain('1.5rem')
	})

	it('should allow custom variables to override defaults', async () => {
		const engine = await createEngine({
			typography: {
				variables: {
					'--pk-prose-color-body': '#333',
				},
			},
			plugins: [typography()],
		})
		const resolved = engine.variables.store.get('--pk-prose-color-body')
		expect(resolved)
			.toBeDefined()
		// The last resolved value should be the overridden one
		const lastValue = resolved![resolved!.length - 1]
		expect(lastValue!.value)
			.toBe('#333')
	})
})

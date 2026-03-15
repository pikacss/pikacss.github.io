import { describe, expect, it } from 'vitest'
import { createEngineStore, getAtomicStyleBaseKey, getAtomicStyleId, optimizeAtomicStyleContents, resolveAtomicStyle } from './atomic-style'

describe('atomic-style', () => {
	it('creates isolated store maps', () => {
		const store = createEngineStore()

		expect(store.atomicStyleIds.size)
			.toBe(0)
		expect(store.atomicStyles.size)
			.toBe(0)
		expect(store.atomicStyleIdsByBaseKey.size)
			.toBe(0)
		expect(store.atomicStyleOrder.size)
			.toBe(0)
	})

	it('reuses cached ids for non-order-sensitive content', () => {
		const content = {
			selector: ['.%'],
			property: 'color',
			value: ['red'],
		}
		const stored = new Map<string, string>()

		const first = getAtomicStyleId({ content, prefix: 'pk-', stored })
		const second = getAtomicStyleId({ content, prefix: 'pk-', stored })

		expect(first)
			.toBe('pk-a')
		expect(second)
			.toBe(first)
		expect(stored.size)
			.toBe(1)
	})

	it('registers new atomic styles only once for the same reusable content', () => {
		const store = createEngineStore()
		const content = {
			selector: ['.%'],
			property: 'color',
			value: ['red'],
		}

		const first = resolveAtomicStyle({
			content,
			prefix: 'pk-',
			store,
			resolvedIdsByBaseKey: new Map(),
		})
		const second = resolveAtomicStyle({
			content,
			prefix: 'pk-',
			store,
			resolvedIdsByBaseKey: new Map(),
		})

		expect(first.id)
			.toBe('pk-a')
		expect(first.atomicStyle)
			.toEqual({ id: 'pk-a', content })
		expect(second)
			.toEqual({ id: 'pk-a' })
		expect(store.atomicStyles.size)
			.toBe(1)
	})

	it('tracks order-sensitive dependencies and removes nullified entries', () => {
		const marginBaseKey = getAtomicStyleBaseKey({
			selector: ['.%'],
			property: 'margin',
			value: ['1rem'],
		})

		const optimized = optimizeAtomicStyleContents([
			{ selector: ['.%'], property: 'margin', value: ['1rem'] },
			{ selector: ['.%'], property: 'margin-left', value: ['2rem'] },
			{ selector: ['.%'], property: 'color', value: ['red'] },
			{ selector: ['.%'], property: 'color', value: null },
		])

		expect(optimized)
			.toEqual([
				{ selector: ['.%'], property: 'margin', value: ['1rem'] },
				{
					selector: ['.%'],
					property: 'margin-left',
					value: ['2rem'],
					orderSensitiveTo: [marginBaseKey],
				},
			])
	})
})

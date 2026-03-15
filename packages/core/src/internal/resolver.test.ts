import { describe, expect, it, vi } from 'vitest'
import { RecursiveResolver, resolveRuleConfig } from './resolver'

class TestResolver extends RecursiveResolver<string> {}

describe('resolver', () => {
	it('resolves static and dynamic rules recursively and clears cached dynamic results on removal', async () => {
		const resolver = new TestResolver()
		const createResolved = vi.fn(async (match: RegExpMatchArray) => [`token-${match[1]}`, 'leaf'])
		const onResolved = vi.fn()
		resolver.onResolved = onResolved

		resolver.addStaticRule({
			key: 'leaf',
			string: 'leaf',
			resolved: ['done'],
		})
		resolver.addDynamicRule({
			key: 'num',
			stringPattern: /^n-(\d+)$/g,
			createResolved,
		})

		expect(resolver.staticRules)
			.toHaveLength(1)
		expect(resolver.dynamicRules)
			.toHaveLength(1)
		await expect(resolver.resolve('n-2')).resolves.toEqual(['token-2', 'done'])
		await expect(resolver.resolve('n-2')).resolves.toEqual(['token-2', 'done'])
		expect(createResolved)
			.toHaveBeenCalledTimes(1)
		expect(onResolved)
			.toHaveBeenCalledWith('n-2', 'dynamic', { value: ['token-2', 'done'] })

		resolver.removeDynamicRule('num')
		await expect(resolver.resolve('n-2')).resolves.toEqual(['n-2'])
	})

	it('preserves unresolved strings for circular and failing dynamic rules', async () => {
		const resolver = new TestResolver()

		resolver.addStaticRule({
			key: 'a',
			string: 'a',
			resolved: ['b'],
		})
		resolver.addStaticRule({
			key: 'b',
			string: 'b',
			resolved: ['a'],
		})
		resolver.addDynamicRule({
			key: 'boom',
			stringPattern: /^boom$/,
			createResolved: async () => {
				throw new Error('explode')
			},
		})

		await expect(resolver.resolve('a')).resolves.toEqual(['a'])
		await expect(resolver.resolve('boom')).resolves.toEqual(['boom'])
		resolver.removeStaticRule('missing')
		resolver.removeDynamicRule('missing')
	})

	it('normalizes supported rule config shapes and rejects invalid input', () => {
		const staticArray = resolveRuleConfig<string>(['center', { display: 'flex' }], 'shortcut')
		const dynamicArray = resolveRuleConfig<string>([/^m-(\d+)$/g, (match: RegExpMatchArray) => `m-${match[1]}`, ['m-4']], 'shortcut')
		const staticObject = resolveRuleConfig<string>({ shortcut: 'btn', value: ['px-4', 'py-2'] }, 'shortcut')
		const dynamicObject = resolveRuleConfig<string>({ shortcut: /^gap-(\d+)$/g, value: (match: RegExpMatchArray) => `gap-${match[1]}`, autocomplete: 'gap-2' }, 'shortcut')

		expect(resolveRuleConfig<string>('plain', 'shortcut'))
			.toBe('plain')
		expect(staticArray)
			.toMatchObject({
				type: 'static',
				autocomplete: ['center'],
				rule: { key: 'center', string: 'center', resolved: [{ display: 'flex' }] },
			})
		expect(dynamicArray)
			.toMatchObject({
				type: 'dynamic',
				autocomplete: ['m-4'],
				rule: { key: '^m-(\\d+)$' },
			})
		if (dynamicArray && typeof dynamicArray !== 'string' && dynamicArray.type === 'dynamic') {
			expect(dynamicArray.rule.stringPattern.global)
				.toBe(false)
		}
		expect(staticObject)
			.toMatchObject({
				type: 'static',
				autocomplete: ['btn'],
			})
		expect(dynamicObject)
			.toMatchObject({
				type: 'dynamic',
				autocomplete: ['gap-2'],
			})
		expect(resolveRuleConfig<string>(null, 'shortcut'))
			.toBeUndefined()
		expect(resolveRuleConfig<string>(['broken', () => 'nope'], 'shortcut'))
			.toBeUndefined()
	})
})

import { describe, expect, it } from 'vitest'
import { execAsyncHook, execSyncHook, resolvePlugins } from './plugin'

describe('plugin hooks', () => {
	it('sorts plugins by pre/default/post order', () => {
		const plugins = resolvePlugins([
			{ name: 'post', order: 'post' },
			{ name: 'default' },
			{ name: 'pre', order: 'pre' },
		])

		expect(plugins.map(plugin => plugin.name))
			.toEqual(['pre', 'default', 'post'])
	})

	it('executes async hooks in order while preserving payload on undefined returns and errors', async () => {
		const result = await execAsyncHook(
			[
				{ name: 'append-a', transformSelectors: async selectors => [...selectors, 'a'] },
				{ name: 'noop', transformSelectors: async () => undefined },
				{ name: 'throws', transformSelectors: async () => { throw new Error('boom') } },
				{ name: 'append-b', transformSelectors: async selectors => [...selectors, 'b'] },
			],
			'transformSelectors',
			['start'],
		)

		expect(result)
			.toEqual(['start', 'a', 'b'])
	})

	it('executes sync hooks in order while preserving payload when hooks do not override it', () => {
		const result = execSyncHook(
			[
				{ name: 'noop', atomicStyleAdded: () => undefined },
				{
					name: 'rewrite',
					atomicStyleAdded: atomicStyle => ({
						...atomicStyle,
						id: `${atomicStyle.id}-next`,
					}),
				},
			],
			'atomicStyleAdded',
			{ id: 'pk-a', content: { selector: ['.%'], property: 'color', value: ['red'] } },
		)

		expect(result.id)
			.toBe('pk-a-next')
	})
})

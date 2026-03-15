import { describe, expect, it, vi } from 'vitest'
import { variables } from './variables'

function createMockEngine() {
	const preflights: Array<(engine: any, isFormatted: boolean) => Promise<unknown> | unknown> = []
	return {
		appendAutocomplete: vi.fn(),
		notifyPreflightUpdated: vi.fn(),
		addPreflight: vi.fn((preflight: { preflight: (engine: any, isFormatted: boolean) => unknown }) => {
			preflights.push(preflight.preflight)
		}),
		pluginHooks: {
			transformSelectors: vi.fn(async (_plugins: any[], selectors: string[]) => selectors),
		},
		config: {
			preflights: [] as any[],
			plugins: [] as any[],
		},
		store: { atomicStyles: new Map() },
		preflights,
	} as any
}

describe('variables plugin', () => {
	it('adds variable autocomplete and renders used variables transitively', async () => {
		const plugin = variables()
		plugin.rawConfigConfigured?.({
			variables: {
				variables: {
					'--brand': { value: 'red', autocomplete: { asValueOf: 'color', asProperty: true } },
					'--accent': { value: 'var(--brand)' },
				},
			},
		} as any)

		const engine = createMockEngine()
		plugin.configureEngine?.(engine)
		engine.store.atomicStyles.set('pk-a', {
			id: 'pk-a',
			content: { selector: ['.%'], property: 'color', value: ['var(--accent)'] },
		})

		const preflight = engine.preflights[0]
		const result = await preflight?.(engine, false) as Record<string, Record<string, string>>

		expect(engine.appendAutocomplete)
			.toHaveBeenCalled()
		expect(result)
			.toEqual({
				':root': {
					'--brand': 'red',
					'--accent': 'var(--brand)',
				},
			})
	})
})

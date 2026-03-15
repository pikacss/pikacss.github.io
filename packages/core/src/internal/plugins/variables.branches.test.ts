import { afterEach, describe, expect, it, vi } from 'vitest'
import { log } from '../utils'
import { extractUsedVarNames, extractUsedVarNamesFromPreflightResult, normalizeVariableName, variables } from './variables'

function createMockEngine() {
	const preflights: Array<(engine: any, isFormatted: boolean) => Promise<unknown> | unknown> = []
	const engine = {
		appendAutocomplete: vi.fn(),
		notifyPreflightUpdated: vi.fn(),
		addPreflight: vi.fn((preflight: { id: string, preflight: (engine: any, isFormatted: boolean) => unknown }) => {
			engine.config.preflights.push({ id: preflight.id, fn: preflight.preflight })
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
	return engine
}

describe('variables plugin branches', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('extracts variable references and normalizes nested preflight values', () => {
		expect(extractUsedVarNames('color: var(--brand); background: var(--accent);'))
			.toEqual(['--brand', '--accent'])
		expect(normalizeVariableName('space'))
			.toBe('--space')
		expect(extractUsedVarNamesFromPreflightResult({
			':root': {
				color: 'var(--brand)',
			},
			'@media (min-width: 768px)': {
				'.card': {
					background: 'var(--accent)',
				},
			},
			'.note': {
				padding: 'var(--space)',
			},
		}))
			.toEqual(['--brand', '--accent', '--space'])
	})

	it('warns for invalid scopes and unknown semantic families while pruning unused variables', async () => {
		const warnSpy = vi.spyOn(log, 'warn')
			.mockImplementation(() => {})
		const plugin = variables()
		plugin.rawConfigConfigured?.({
			variables: {
				safeList: ['--safe'],
				variables: {
					'--safe': 'black',
					'--theme-color': {
						value: 'var(--safe)',
						semanticType: ['color', 'mystery'],
						autocomplete: { asProperty: false },
					},
					'--manual': {
						value: '2rem',
						autocomplete: { asValueOf: '-' },
					},
					'.card': {
						'--surface': {
							value: 'var(--theme-color)',
							pruneUnused: false,
						},
					},
					'.broken': 'oops' as any,
				},
			},
		} as any)

		const engine = createMockEngine()
		engine.config.preflights.push({
			id: 'external',
			fn: async () => ({
				'.external': {
					color: 'var(--safe)',
				},
			}),
		})
		plugin.configureEngine?.(engine)

		const preflight = engine.preflights[0]
		const result = await preflight?.(engine, false) as Record<string, Record<string, string>>

		expect(warnSpy)
			.toHaveBeenCalledTimes(2)
		expect(result)
			.toEqual({
				':root': {
					'--safe': 'black',
				},
				'.card': {
					'--surface': 'var(--theme-color)',
				},
			})
		expect(result[':root'])
			.not.toHaveProperty('--theme-color')
		expect(result[':root'])
			.not.toHaveProperty('--manual')
	})
})

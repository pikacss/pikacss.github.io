import { describe, expect, it, vi } from 'vitest'
import { generateTsCodegenContent } from './tsCodegen'

describe('tsCodegen', () => {
	it('generates autocomplete, vue declarations, and preview overloads', async () => {
		const content = await generateTsCodegenContent({
			currentPackageName: '@pikacss/integration',
			fnName: 'pika',
			transformedFormat: 'string',
			hasVue: true,
			usages: new Map([
				['entry.ts', [{ atomicStyleIds: ['pk-a'], params: [{ color: 'red' }, 'hover'] }]],
			]),
			engine: {
				config: {
					autocomplete: {
						selectors: new Set(['hover']),
						shortcuts: new Set(['btn']),
						extraProperties: new Set(['__layer']),
						extraCssProperties: new Set(['--brand']),
						properties: new Map([['__layer', ['"utilities"']]]),
						cssProperties: new Map([['color', ['red']]]),
						patterns: {
							selectors: new Set(['screen-$' + '{number}']),
							shortcuts: new Set(),
							properties: new Map(),
							cssProperties: new Map([['color', ['var\\(--.+\\)']]]),
						},
					},
					layers: { components: 5, utilities: 10 },
				},
				renderAtomicStyles: vi.fn(async () => '.% {\n  color: red;\n}'),
			},
		} as any)

		expect(content)
			.toContain('export type Autocomplete = DefineAutocomplete<{')
		expect(content)
			.toContain('Selector: "hover" | screen-$' + '{number}')
		expect(content)
			.toContain('type StyleFn_Normal = StyleFn_String')
		expect(content)
			.toContain('declare module \'vue\' {')
		expect(content)
			.toContain('const pika: StyleFn')
		expect(content)
			.toContain('### PikaCSS Preview')
	})

	it('switches to array format and omits vue declaration when vue is absent', async () => {
		const content = await generateTsCodegenContent({
			currentPackageName: '@pikacss/integration',
			fnName: 'atom',
			transformedFormat: 'array',
			hasVue: false,
			usages: new Map(),
			engine: {
				config: {
					autocomplete: {
						selectors: new Set(),
						shortcuts: new Set(),
						extraProperties: new Set(),
						extraCssProperties: new Set(),
						properties: new Map(),
						cssProperties: new Map(),
						patterns: {
							selectors: new Set(),
							shortcuts: new Set(),
							properties: new Map(),
							cssProperties: new Map(),
						},
					},
					layers: {},
				},
				renderAtomicStyles: vi.fn(async () => ''),
			},
		} as any)

		expect(content)
			.toContain('type StyleFn_Normal = StyleFn_Array')
		expect(content).not.toContain('declare module \'vue\' {')
		expect(content)
			.toContain('const atom: StyleFn')
	})
})

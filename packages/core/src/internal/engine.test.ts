import type { AtomicStyle, ExtractedStyleContent, StyleContent } from './types'
import { describe, expect, it, vi } from 'vitest'
import { ATOMIC_STYLE_ID_PLACEHOLDER } from './constants'
import {
	calcAtomicStyleRenderingWeight,
	createEngine,
	Engine,
	getAtomicStyleId,
	optimizeAtomicStyleContents,
	renderAtomicStyles,
	resolveEngineConfig,
	resolvePreflight,
	resolveStyleItemList,
} from './engine'

// ─── calcAtomicStyleRenderingWeight ──────────────────────────────────────────

describe('calcAtomicStyleRenderingWeight', () => {
	const defaultSelector = `.${ATOMIC_STYLE_ID_PLACEHOLDER}`

	it('should return 0 for default selector', () => {
		const style: AtomicStyle = {
			id: 'a',
			content: { selector: [defaultSelector], property: 'color', value: ['red'] },
		}
		expect(calcAtomicStyleRenderingWeight(style, defaultSelector))
			.toBe(0)
	})

	it('should return selector.length for non-default selector', () => {
		const style: AtomicStyle = {
			id: 'a',
			content: { selector: ['&:hover', `.${ATOMIC_STYLE_ID_PLACEHOLDER}`], property: 'color', value: ['red'] },
		}
		expect(calcAtomicStyleRenderingWeight(style, defaultSelector))
			.toBe(2)
	})

	it('should return selector.length when selector has single non-default entry', () => {
		const style: AtomicStyle = {
			id: 'a',
			content: { selector: ['&:hover'], property: 'color', value: ['red'] },
		}
		expect(calcAtomicStyleRenderingWeight(style, defaultSelector))
			.toBe(1)
	})

	it('should return selector.length for multiple selectors', () => {
		const style: AtomicStyle = {
			id: 'a',
			content: { selector: ['@media (min-width:768px)', `.${ATOMIC_STYLE_ID_PLACEHOLDER}`], property: 'display', value: ['flex'] },
		}
		expect(calcAtomicStyleRenderingWeight(style, defaultSelector))
			.toBe(2)
	})

	it('should return 0 only when selector is exactly [defaultSelector]', () => {
		// Two entries that happen to contain defaultSelector → not the default case
		const style: AtomicStyle = {
			id: 'a',
			content: { selector: [defaultSelector, defaultSelector], property: 'color', value: ['red'] },
		}
		expect(calcAtomicStyleRenderingWeight(style, defaultSelector))
			.toBe(2)
	})
})

// ─── resolvePreflight ────────────────────────────────────────────────────────

describe('resolvePreflight', () => {
	it('should return the function itself when given a function', () => {
		const fn = () => 'body { margin: 0; }'
		const resolved = resolvePreflight(fn)
		expect(resolved)
			.toBe(fn)
	})

	it('should wrap a string in a function that returns the string', () => {
		const resolved = resolvePreflight('body { margin: 0; }')
		expect(typeof resolved)
			.toBe('function')
		expect(resolved(null as any, false))
			.toBe('body { margin: 0; }')
	})

	it('should wrap a PreflightDefinition object in a function that returns it', () => {
		const def = { body: { margin: '0' } }
		const resolved = resolvePreflight(def)
		expect(typeof resolved)
			.toBe('function')
		expect(resolved(null as any, false))
			.toEqual(def)
	})
})

// ─── resolveEngineConfig ─────────────────────────────────────────────────────

describe('resolveEngineConfig', () => {
	it('should apply default values when no config is provided', async () => {
		const resolved = await resolveEngineConfig({})
		expect(resolved.prefix)
			.toBe('')
		expect(resolved.defaultSelector)
			.toBe(`.${ATOMIC_STYLE_ID_PLACEHOLDER}`)
		expect(resolved.plugins)
			.toEqual([])
		expect(resolved.preflights)
			.toEqual([])
	})

	it('should preserve custom prefix', async () => {
		const resolved = await resolveEngineConfig({ prefix: 'pk-' })
		expect(resolved.prefix)
			.toBe('pk-')
	})

	it('should preserve custom defaultSelector', async () => {
		const resolved = await resolveEngineConfig({ defaultSelector: '[data-pika~="%"]' })
		expect(resolved.defaultSelector)
			.toBe('[data-pika~="%"]')
	})

	it('should resolve preflights into functions', async () => {
		const resolved = await resolveEngineConfig({
			preflights: ['body { margin: 0; }'],
		})
		expect(resolved.preflights)
			.toHaveLength(1)
		expect(typeof resolved.preflights[0])
			.toBe('function')
		expect(resolved.preflights[0]!(null as any, false))
			.toBe('body { margin: 0; }')
	})

	it('should initialise autocomplete with empty collections', async () => {
		const resolved = await resolveEngineConfig({})
		expect(resolved.autocomplete.selectors)
			.toBeInstanceOf(Set)
		expect(resolved.autocomplete.selectors.size)
			.toBe(0)
		expect(resolved.autocomplete.styleItemStrings)
			.toBeInstanceOf(Set)
		expect(resolved.autocomplete.styleItemStrings.size)
			.toBe(0)
		expect(resolved.autocomplete.extraProperties)
			.toBeInstanceOf(Set)
		expect(resolved.autocomplete.extraCssProperties)
			.toBeInstanceOf(Set)
		expect(resolved.autocomplete.properties)
			.toBeInstanceOf(Map)
		expect(resolved.autocomplete.cssProperties)
			.toBeInstanceOf(Map)
	})

	it('should store rawConfig reference', async () => {
		const config = { prefix: 'x-' }
		const resolved = await resolveEngineConfig(config)
		expect(resolved.rawConfig)
			.toBe(config)
	})

	it('should handle multiple preflights', async () => {
		const fn = () => 'a'
		const resolved = await resolveEngineConfig({
			preflights: ['body{}', fn, { html: { boxSizing: 'border-box' } }],
		})
		expect(resolved.preflights)
			.toHaveLength(3)
		expect(resolved.preflights[1])
			.toBe(fn)
	})
})

// ─── getAtomicStyleId ────────────────────────────────────────────────────────

describe('getAtomicStyleId', () => {
	it('should generate an id from content hash', () => {
		const stored = new Map<string, string>()
		const content: StyleContent = {
			selector: ['.%'],
			property: 'color',
			value: ['red'],
		}
		const id = getAtomicStyleId({ content, prefix: '', stored })
		expect(typeof id)
			.toBe('string')
		expect(id.length)
			.toBeGreaterThan(0)
	})

	it('should cache and return the same id for the same content', () => {
		const stored = new Map<string, string>()
		const content: StyleContent = {
			selector: ['.%'],
			property: 'color',
			value: ['red'],
		}
		const id1 = getAtomicStyleId({ content, prefix: '', stored })
		const id2 = getAtomicStyleId({ content, prefix: '', stored })
		expect(id1)
			.toBe(id2)
		expect(stored.size)
			.toBe(1)
	})

	it('should generate different ids for different content', () => {
		const stored = new Map<string, string>()
		const c1: StyleContent = { selector: ['.%'], property: 'color', value: ['red'] }
		const c2: StyleContent = { selector: ['.%'], property: 'color', value: ['blue'] }
		const id1 = getAtomicStyleId({ content: c1, prefix: '', stored })
		const id2 = getAtomicStyleId({ content: c2, prefix: '', stored })
		expect(id1).not.toBe(id2)
	})

	it('should prepend prefix to the id', () => {
		const stored = new Map<string, string>()
		const content: StyleContent = { selector: ['.%'], property: 'color', value: ['red'] }
		const id = getAtomicStyleId({ content, prefix: 'pk-', stored })
		expect(id.startsWith('pk-'))
			.toBe(true)
	})

	it('should generate incremental names based on stored size', () => {
		const stored = new Map<string, string>()
		const ids: string[] = []
		for (let i = 0; i < 5; i++) {
			const content: StyleContent = {
				selector: ['.%'],
				property: 'color',
				value: [`val${i}`],
			}
			ids.push(getAtomicStyleId({ content, prefix: '', stored }))
		}
		// All ids should be unique
		expect(new Set(ids).size)
			.toBe(5)
		// First id should be the char for index 0 ('a')
		expect(ids[0])
			.toBe('a')
	})

	it('should differentiate by selector', () => {
		const stored = new Map<string, string>()
		const c1: StyleContent = { selector: ['.%'], property: 'color', value: ['red'] }
		const c2: StyleContent = { selector: ['&:hover', '.%'], property: 'color', value: ['red'] }
		const id1 = getAtomicStyleId({ content: c1, prefix: '', stored })
		const id2 = getAtomicStyleId({ content: c2, prefix: '', stored })
		expect(id1).not.toBe(id2)
	})
})

// ─── optimizeAtomicStyleContents ─────────────────────────────────────────────

describe('optimizeAtomicStyleContents', () => {
	it('should keep unique selector+property combinations', () => {
		const list: ExtractedStyleContent[] = [
			{ selector: ['.%'], property: 'color', value: ['red'] },
			{ selector: ['.%'], property: 'font-size', value: ['16px'] },
		]
		const result = optimizeAtomicStyleContents(list)
		expect(result)
			.toHaveLength(2)
	})

	it('should let later entries override earlier ones for same selector+property', () => {
		const list: ExtractedStyleContent[] = [
			{ selector: ['.%'], property: 'color', value: ['red'] },
			{ selector: ['.%'], property: 'color', value: ['blue'] },
		]
		const result = optimizeAtomicStyleContents(list)
		expect(result)
			.toHaveLength(1)
		expect(result[0]!.value)
			.toEqual(['blue'])
	})

	it('should remove entry when null value is used', () => {
		const list: ExtractedStyleContent[] = [
			{ selector: ['.%'], property: 'color', value: ['red'] },
			{ selector: ['.%'], property: 'color', value: null },
		]
		const result = optimizeAtomicStyleContents(list)
		expect(result)
			.toHaveLength(0)
	})

	it('should remove entry when undefined value is used', () => {
		const list: ExtractedStyleContent[] = [
			{ selector: ['.%'], property: 'color', value: ['red'] },
			{ selector: ['.%'], property: 'color', value: undefined },
		]
		const result = optimizeAtomicStyleContents(list)
		expect(result)
			.toHaveLength(0)
	})

	it('should treat different selectors as separate entries', () => {
		const list: ExtractedStyleContent[] = [
			{ selector: ['.%'], property: 'color', value: ['red'] },
			{ selector: ['&:hover', '.%'], property: 'color', value: ['blue'] },
		]
		const result = optimizeAtomicStyleContents(list)
		expect(result)
			.toHaveLength(2)
	})

	it('should handle empty list', () => {
		const result = optimizeAtomicStyleContents([])
		expect(result)
			.toEqual([])
	})

	it('should handle complex override then re-add scenario', () => {
		const list: ExtractedStyleContent[] = [
			{ selector: ['.%'], property: 'color', value: ['red'] },
			{ selector: ['.%'], property: 'color', value: null },
			{ selector: ['.%'], property: 'color', value: ['green'] },
		]
		const result = optimizeAtomicStyleContents(list)
		expect(result)
			.toHaveLength(1)
		expect(result[0]!.value)
			.toEqual(['green'])
	})

	it('should preserve order based on last occurrence', () => {
		const list: ExtractedStyleContent[] = [
			{ selector: ['.%'], property: 'color', value: ['red'] },
			{ selector: ['.%'], property: 'font-size', value: ['14px'] },
			{ selector: ['.%'], property: 'color', value: ['blue'] },
		]
		const result = optimizeAtomicStyleContents(list)
		expect(result)
			.toHaveLength(2)
		// After override, 'color' should come after 'font-size' because it was re-inserted
		expect(result[0]!.property)
			.toBe('font-size')
		expect(result[1]!.property)
			.toBe('color')
	})
})

// ─── resolveStyleItemList ────────────────────────────────────────────────────

describe('resolveStyleItemList', () => {
	it('should put string items into the unknown set', async () => {
		const result = await resolveStyleItemList({
			itemList: ['unknown-class', 'another-class'],
			transformStyleItems: async items => items,
			extractStyleDefinition: async () => [],
		})
		expect(result.unknown)
			.toBeInstanceOf(Set)
		expect(result.unknown.has('unknown-class'))
			.toBe(true)
		expect(result.unknown.has('another-class'))
			.toBe(true)
		expect(result.contents)
			.toEqual([])
	})

	it('should extract object items via extractStyleDefinition', async () => {
		const extracted: ExtractedStyleContent[] = [
			{ selector: ['.%'], property: 'color', value: ['red'] },
		]
		const result = await resolveStyleItemList({
			itemList: [{ color: 'red' }],
			transformStyleItems: async items => items,
			extractStyleDefinition: async () => extracted,
		})
		expect(result.unknown.size)
			.toBe(0)
		expect(result.contents)
			.toHaveLength(1)
		expect(result.contents[0]!.property)
			.toBe('color')
	})

	it('should handle mixed string and object items', async () => {
		const extracted: ExtractedStyleContent[] = [
			{ selector: ['.%'], property: 'display', value: ['flex'] },
		]
		const result = await resolveStyleItemList({
			itemList: ['my-class', { display: 'flex' }],
			transformStyleItems: async items => items,
			extractStyleDefinition: async () => extracted,
		})
		expect(result.unknown.has('my-class'))
			.toBe(true)
		expect(result.contents)
			.toHaveLength(1)
	})

	it('should deduplicate string items', async () => {
		const result = await resolveStyleItemList({
			itemList: ['dup', 'dup', 'dup'],
			transformStyleItems: async items => items,
			extractStyleDefinition: async () => [],
		})
		expect(result.unknown.size)
			.toBe(1)
	})

	it('should apply transformStyleItems before processing', async () => {
		const transform = vi.fn(async (items: any[]) => items.filter(i => typeof i !== 'string'))
		const result = await resolveStyleItemList({
			itemList: ['removed', { color: 'red' }],
			transformStyleItems: transform,
			extractStyleDefinition: async () => [
				{ selector: ['.%'], property: 'color', value: ['red'] },
			],
		})
		expect(transform)
			.toHaveBeenCalled()
		expect(result.unknown.size)
			.toBe(0)
		expect(result.contents)
			.toHaveLength(1)
	})

	it('should optimise extracted contents (later overrides earlier)', async () => {
		let callCount = 0
		const result = await resolveStyleItemList({
			itemList: [{ color: 'red' }, { color: 'blue' }],
			transformStyleItems: async items => items,
			extractStyleDefinition: async () => {
				callCount++
				if (callCount === 1)
					return [{ selector: ['.%'], property: 'color', value: ['red'] }]
				return [{ selector: ['.%'], property: 'color', value: ['blue'] }]
			},
		})
		// optimizeAtomicStyleContents should merge them
		expect(result.contents)
			.toHaveLength(1)
		expect(result.contents[0]!.value)
			.toEqual(['blue'])
	})

	it('should handle empty itemList', async () => {
		const result = await resolveStyleItemList({
			itemList: [],
			transformStyleItems: async items => items,
			extractStyleDefinition: async () => [],
		})
		expect(result.unknown.size)
			.toBe(0)
		expect(result.contents)
			.toEqual([])
	})
})

// ─── renderAtomicStyles ──────────────────────────────────────────────────────

describe('renderAtomicStyles', () => {
	const defaultSelector = `.${ATOMIC_STYLE_ID_PLACEHOLDER}`

	it('should render a single atomic style (formatted)', () => {
		const atomicStyles: AtomicStyle[] = [
			{ id: 'a', content: { selector: [defaultSelector], property: 'color', value: ['red'] } },
		]
		const result = renderAtomicStyles({
			atomicStyles,
			isPreview: false,
			isFormatted: true,
			defaultSelector,
		})
		expect(result)
			.toBe('.a {\n  color: red;\n}')
	})

	it('should render a single atomic style (unformatted)', () => {
		const atomicStyles: AtomicStyle[] = [
			{ id: 'a', content: { selector: [defaultSelector], property: 'color', value: ['red'] } },
		]
		const result = renderAtomicStyles({
			atomicStyles,
			isPreview: false,
			isFormatted: false,
			defaultSelector,
		})
		expect(result)
			.toBe('.a{color:red;}')
	})

	it('should replace placeholder with id', () => {
		const atomicStyles: AtomicStyle[] = [
			{ id: 'myId', content: { selector: [defaultSelector], property: 'color', value: ['red'] } },
		]
		const result = renderAtomicStyles({
			atomicStyles,
			isPreview: false,
			isFormatted: false,
			defaultSelector,
		})
		expect(result)
			.toContain('.myId')
		expect(result).not.toContain(ATOMIC_STYLE_ID_PLACEHOLDER)
	})

	it('should keep placeholder in preview mode', () => {
		const atomicStyles: AtomicStyle[] = [
			{ id: 'a', content: { selector: [defaultSelector], property: 'color', value: ['red'] } },
		]
		const result = renderAtomicStyles({
			atomicStyles,
			isPreview: true,
			isFormatted: false,
			defaultSelector,
		})
		expect(result)
			.toContain(`.${ATOMIC_STYLE_ID_PLACEHOLDER}`)
	})

	it('should sort by weight: default selector first, then by selector length', () => {
		const atomicStyles: AtomicStyle[] = [
			{ id: 'b', content: { selector: ['@media (min-width:768px)', defaultSelector], property: 'display', value: ['flex'] } },
			{ id: 'a', content: { selector: [defaultSelector], property: 'color', value: ['red'] } },
		]
		const result = renderAtomicStyles({
			atomicStyles,
			isPreview: false,
			isFormatted: true,
			defaultSelector,
		})
		// Default selector style (.a) should come before media query style (.b)
		const posA = result.indexOf('.a')
		const posB = result.indexOf('.b')
		expect(posA)
			.toBeLessThan(posB)
	})

	it('should handle multiple values for the same property', () => {
		const atomicStyles: AtomicStyle[] = [
			{ id: 'a', content: { selector: [defaultSelector], property: 'color', value: ['red', 'blue'] } },
		]
		const result = renderAtomicStyles({
			atomicStyles,
			isPreview: false,
			isFormatted: true,
			defaultSelector,
		})
		expect(result)
			.toContain('color: red;')
		expect(result)
			.toContain('color: blue;')
	})

	it('should skip styles with selectors that do not contain the placeholder', () => {
		const atomicStyles: AtomicStyle[] = [
			{ id: 'a', content: { selector: ['.no-placeholder'], property: 'color', value: ['red'] } },
		]
		const result = renderAtomicStyles({
			atomicStyles,
			isPreview: false,
			isFormatted: false,
			defaultSelector,
		})
		expect(result)
			.toBe('')
	})

	it('should handle empty atomicStyles array', () => {
		const result = renderAtomicStyles({
			atomicStyles: [],
			isPreview: false,
			isFormatted: true,
			defaultSelector,
		})
		expect(result)
			.toBe('')
	})

	it('should render nested selectors correctly', () => {
		const atomicStyles: AtomicStyle[] = [
			{
				id: 'a',
				content: {
					selector: ['@media (min-width:768px)', `.${ATOMIC_STYLE_ID_PLACEHOLDER}`],
					property: 'display',
					value: ['flex'],
				},
			},
		]
		const result = renderAtomicStyles({
			atomicStyles,
			isPreview: false,
			isFormatted: true,
			defaultSelector,
		})
		expect(result)
			.toContain('@media (min-width:768px)')
		expect(result)
			.toContain('.a')
		expect(result)
			.toContain('display: flex;')
	})

	it('should replace all placeholder occurrences in selector', () => {
		const atomicStyles: AtomicStyle[] = [
			{
				id: 'x',
				content: {
					selector: [`.${ATOMIC_STYLE_ID_PLACEHOLDER}.${ATOMIC_STYLE_ID_PLACEHOLDER}`],
					property: 'color',
					value: ['red'],
				},
			},
		]
		const result = renderAtomicStyles({
			atomicStyles,
			isPreview: false,
			isFormatted: false,
			defaultSelector,
		})
		expect(result)
			.toContain('.x.x')
		expect(result).not.toContain(ATOMIC_STYLE_ID_PLACEHOLDER)
	})
})

// ─── createEngine ────────────────────────────────────────────────────────────

describe('createEngine', () => {
	it('should create an Engine instance with default config', async () => {
		const engine = await createEngine()
		expect(engine)
			.toBeInstanceOf(Engine)
		expect(engine.config.prefix)
			.toBe('')
		expect(engine.config.defaultSelector)
			.toBe(`.${ATOMIC_STYLE_ID_PLACEHOLDER}`)
	})

	it('should create an Engine instance with custom prefix', async () => {
		const engine = await createEngine({ prefix: 'pk-' })
		expect(engine.config.prefix)
			.toBe('pk-')
	})

	it('should create an Engine instance with custom defaultSelector', async () => {
		const engine = await createEngine({ defaultSelector: '[data~="%"]' })
		expect(engine.config.defaultSelector)
			.toBe('[data~="%"]')
	})

	it('should include core plugins', async () => {
		const engine = await createEngine()
		// Core plugins (important, variables, keyframes, selectors, shortcuts) should be loaded
		expect(engine.config.plugins.length)
			.toBeGreaterThanOrEqual(5)
	})

	it('should have an empty store initially', async () => {
		const engine = await createEngine()
		expect(engine.store.atomicStyleIds.size)
			.toBe(0)
		expect(engine.store.atomicStyles.size)
			.toBe(0)
	})
})

// ─── Engine.use ──────────────────────────────────────────────────────────────

describe('engine.use', () => {
	it('should process style definitions and return atomic style IDs', async () => {
		const engine = await createEngine()
		const ids = await engine.use({ color: 'red' })
		expect(ids.length)
			.toBeGreaterThan(0)
		expect(typeof ids[0])
			.toBe('string')
	})

	it('should store generated atomic styles', async () => {
		const engine = await createEngine()
		const ids = await engine.use({ color: 'red' })
		expect(engine.store.atomicStyles.size)
			.toBeGreaterThan(0)
		// Each returned ID should exist in the store
		for (const id of ids) {
			if (engine.store.atomicStyles.has(id)) {
				expect(engine.store.atomicStyles.get(id)!.id)
					.toBe(id)
			}
		}
	})

	it('should return the same IDs for the same style definitions', async () => {
		const engine = await createEngine()
		const ids1 = await engine.use({ color: 'red' })
		const ids2 = await engine.use({ color: 'red' })
		expect(ids1)
			.toEqual(ids2)
	})

	it('should return different IDs for different style definitions', async () => {
		const engine = await createEngine()
		const ids1 = await engine.use({ color: 'red' })
		const ids2 = await engine.use({ color: 'blue' })
		expect(ids1).not.toEqual(ids2)
	})

	it('should handle multiple properties in one call', async () => {
		const engine = await createEngine()
		const ids = await engine.use({ color: 'red', fontSize: '16px' })
		// Each property should produce a separate atomic style
		expect(ids.length)
			.toBeGreaterThanOrEqual(2)
	})

	it('should include unknown strings in the returned array', async () => {
		const engine = await createEngine()
		const ids = await engine.use('some-unknown-class' as any, { color: 'red' })
		expect(ids)
			.toContain('some-unknown-class')
	})

	it('should render stored atomic styles', async () => {
		const engine = await createEngine()
		await engine.use({ color: 'red' })
		const css = await engine.renderAtomicStyles(false)
		expect(css)
			.toContain('color:red;')
	})
})

// ─── Engine.addPreflight ─────────────────────────────────────────────────────

describe('engine.addPreflight', () => {
	it('should add a string preflight', async () => {
		const engine = await createEngine()
		engine.addPreflight('body { margin: 0; }')
		expect(engine.config.preflights.length)
			.toBeGreaterThan(0)
	})

	it('should add a function preflight', async () => {
		const engine = await createEngine()
		const fn = () => 'body { margin: 0; }'
		engine.addPreflight(fn)
		const last = engine.config.preflights[engine.config.preflights.length - 1]!
		expect(last)
			.toBe(fn)
	})

	it('should render added preflights', async () => {
		const engine = await createEngine()
		engine.addPreflight('body { margin: 0; }')
		const css = await engine.renderPreflights(false)
		expect(css)
			.toContain('body { margin: 0; }')
	})
})

// ─── Engine autocomplete helpers ─────────────────────────────────────────────

describe('engine autocomplete helpers', () => {
	it('should append autocomplete selectors', async () => {
		const engine = await createEngine()
		engine.appendAutocompleteSelectors('.foo', '.bar')
		expect(engine.config.autocomplete.selectors.has('.foo'))
			.toBe(true)
		expect(engine.config.autocomplete.selectors.has('.bar'))
			.toBe(true)
	})

	it('should append autocomplete style item strings', async () => {
		const engine = await createEngine()
		engine.appendAutocompleteStyleItemStrings('txt-red')
		expect(engine.config.autocomplete.styleItemStrings.has('txt-red'))
			.toBe(true)
	})

	it('should append autocomplete extra properties', async () => {
		const engine = await createEngine()
		engine.appendAutocompleteExtraProperties('myProp')
		expect(engine.config.autocomplete.extraProperties.has('myProp'))
			.toBe(true)
	})

	it('should append autocomplete extra CSS properties', async () => {
		const engine = await createEngine()
		engine.appendAutocompleteExtraCssProperties('accent-color')
		expect(engine.config.autocomplete.extraCssProperties.has('accent-color'))
			.toBe(true)
	})

	it('should append autocomplete property values', async () => {
		const engine = await createEngine()
		engine.appendAutocompletePropertyValues('color', '"red"', '"blue"')
		expect(engine.config.autocomplete.properties.get('color'))
			.toEqual(['"red"', '"blue"'])
	})

	it('should append autocomplete CSS property values', async () => {
		const engine = await createEngine()
		engine.appendAutocompleteCssPropertyValues('z-index', 1, 10)
		expect(engine.config.autocomplete.cssProperties.get('z-index'))
			.toEqual([1, 10])
	})
})

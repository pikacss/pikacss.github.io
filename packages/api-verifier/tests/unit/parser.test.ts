/**
 * Unit tests for markdown parser
 */

import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { DocumentationType, getDocumentationType, normalizeSignature, parseDocumentedAPIs } from '../../src/parser.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixturesDir = path.resolve(__dirname, '../fixtures')

describe('getDocumentationType', () => {
	it('returns API_REFERENCE for api-reference.md files', () => {
		expect(getDocumentationType('docs/advanced/api-reference.md'))
			.toBe(DocumentationType.API_REFERENCE)
		expect(getDocumentationType('/path/to/docs/advanced/api-reference.md'))
			.toBe(DocumentationType.API_REFERENCE)
	})

	it('returns GUIDE for guide directory files', () => {
		expect(getDocumentationType('docs/guide/basics.md'))
			.toBe(DocumentationType.GUIDE)
		expect(getDocumentationType('docs/guide/advanced/plugins.md'))
			.toBe(DocumentationType.GUIDE)
	})

	it('returns GUIDE for llm directory files', () => {
		expect(getDocumentationType('docs/llm/usage.md'))
			.toBe(DocumentationType.GUIDE)
	})

	it('returns EXAMPLE for examples directory files', () => {
		expect(getDocumentationType('docs/examples/vite.md'))
			.toBe(DocumentationType.EXAMPLE)
		expect(getDocumentationType('examples/basic/README.md'))
			.toBe(DocumentationType.EXAMPLE)
	})

	it('returns OTHER for unrecognized paths', () => {
		expect(getDocumentationType('README.md'))
			.toBe(DocumentationType.OTHER)
		expect(getDocumentationType('packages/core/README.md'))
			.toBe(DocumentationType.OTHER)
	})

	it('handles Windows-style paths', () => {
		expect(getDocumentationType('docs\\guide\\basics.md'))
			.toBe(DocumentationType.GUIDE)
		expect(getDocumentationType('C:\\projects\\docs\\advanced\\api-reference.md'))
			.toBe(DocumentationType.API_REFERENCE)
	})
})

describe('normalizeSignature', () => {
	it('removes extra whitespace', () => {
		expect(normalizeSignature('  a  :  b  '))
			.toBe('a: b')
		expect(normalizeSignature('function   foo(  )'))
			.toBe('function foo( )')
	})

	it('normalizes colons', () => {
		expect(normalizeSignature('name:string'))
			.toBe('name: string')
		expect(normalizeSignature('name :  string'))
			.toBe('name: string')
	})

	it('normalizes arrows', () => {
		expect(normalizeSignature('a  =>  b'))
			.toBe('a => b')
		expect(normalizeSignature('()=>void'))
			.toBe('() => void')
	})

	it('normalizes union types', () => {
		expect(normalizeSignature('string  |  number'))
			.toBe('string | number')
		expect(normalizeSignature('a|b|c'))
			.toBe('a | b | c')
	})

	it('normalizes intersection types', () => {
		expect(normalizeSignature('A  &  B'))
			.toBe('A & B')
		expect(normalizeSignature('Type1&Type2'))
			.toBe('Type1 & Type2')
	})

	it('trims leading and trailing whitespace', () => {
		expect(normalizeSignature('  function foo()  '))
			.toBe('function foo()')
		expect(normalizeSignature('\n\ttype X\n'))
			.toBe('type X')
	})

	it('handles complex signatures', () => {
		const input = 'export function  foo < T  extends  string > ( a : T ) : Promise < T  |  null >'
		const expected = 'export function foo < T extends string > ( a: T ): Promise < T | null >'
		expect(normalizeSignature(input))
			.toBe(expected)
	})
})

describe('parseDocumentedAPIs', () => {
	const sampleFile = path.join(fixturesDir, 'sample-api-doc.md')

	it('extracts function declarations', () => {
		const apis = parseDocumentedAPIs(sampleFile)
		const func = apis.find(api => api.name === 'defineEngineConfig')

		expect(func)
			.toBeDefined()
		expect(func?.name)
			.toBe('defineEngineConfig')
		expect(func?.signature)
			.toContain('export function defineEngineConfig')
		expect(func?.file)
			.toBe(sampleFile)
		expect(func?.line)
			.toBeGreaterThan(0)
		expect(func?.context)
			.toBe(DocumentationType.OTHER)
	})

	it('extracts interface declarations', () => {
		const apis = parseDocumentedAPIs(sampleFile)
		const iface = apis.find(api => api.name === 'EngineConfig')

		expect(iface)
			.toBeDefined()
		expect(iface?.name)
			.toBe('EngineConfig')
		expect(iface?.signature)
			.toContain('export interface EngineConfig')
		expect(iface?.signature)
			.toContain('preflights')
		expect(iface?.signature)
			.toContain('plugins')
	})

	it('extracts type declarations', () => {
		const apis = parseDocumentedAPIs(sampleFile)
		const type = apis.find(api => api.name === 'CSSValue')

		expect(type)
			.toBeDefined()
		expect(type?.name)
			.toBe('CSSValue')
		expect(type?.signature)
			.toContain('export type CSSValue')
	})

	it('skips example code blocks with "// example" comment', () => {
		const apis = parseDocumentedAPIs(sampleFile)
		const hasExample = apis.some(api => api.signature.includes('// Example'))

		expect(hasExample)
			.toBe(false)
	})

	it('captures correct line numbers', () => {
		const apis = parseDocumentedAPIs(sampleFile)

		// All APIs should have valid line numbers
		for (const api of apis) {
			expect(api.line)
				.toBeGreaterThan(0)
			expect(api.line)
				.toBeLessThan(50) // File is less than 50 lines
		}

		// Function should appear before interface in the file
		const func = apis.find(api => api.name === 'defineEngineConfig')
		const iface = apis.find(api => api.name === 'EngineConfig')
		expect(func?.line)
			.toBeLessThan(iface?.line ?? 0)
	})

	it('normalizes signatures', () => {
		const apis = parseDocumentedAPIs(sampleFile)

		// All signatures should be normalized (single spaces, consistent formatting)
		for (const api of apis) {
			// Should not have multiple consecutive spaces
			expect(api.signature).not.toMatch(/\s{2,}/)
			// Should have consistent colon spacing
			if (api.signature.includes(':')) {
				expect(api.signature)
					.toMatch(/\w+: \w+/)
			}
		}
	})

	it('returns empty array for non-existent file', () => {
		const apis = parseDocumentedAPIs('/non/existent/file.md')
		expect(apis)
			.toEqual([])
	})

	it('finds exactly 3 APIs (function, interface, type)', () => {
		const apis = parseDocumentedAPIs(sampleFile)
		expect(apis)
			.toHaveLength(3)

		const names = apis.map(api => api.name)
			.sort()
		expect(names)
			.toEqual(['CSSValue', 'EngineConfig', 'defineEngineConfig'])
	})
})

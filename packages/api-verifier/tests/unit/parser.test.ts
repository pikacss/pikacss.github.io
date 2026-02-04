import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { getDocumentationType, normalizeSignature, parseDocumentedAPIs } from '../../src/parser'
import { DocumentationType } from '../../src/types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixturesDir = path.resolve(__dirname, '../fixtures')
const sampleFile = path.join(fixturesDir, 'sample-api-doc.md')

describe('getDocumentationType', () => {
	it('should return API_REFERENCE for api-reference.md', () => {
		const result = getDocumentationType('docs/advanced/api-reference.md')
		expect(result)
			.toBe(DocumentationType.API_REFERENCE)
	})

	it('should return API_REFERENCE for nested api-reference.md', () => {
		const result = getDocumentationType('some/nested/path/advanced/api-reference.md')
		expect(result)
			.toBe(DocumentationType.API_REFERENCE)
	})

	it('should return GUIDE for guide directory', () => {
		const result = getDocumentationType('docs/guide/getting-started.md')
		expect(result)
			.toBe(DocumentationType.GUIDE)
	})

	it('should return GUIDE for llm directory', () => {
		const result = getDocumentationType('docs/llm/prompts.md')
		expect(result)
			.toBe(DocumentationType.GUIDE)
	})

	it('should return EXAMPLE for examples directory', () => {
		const result = getDocumentationType('docs/examples/basic-usage.md')
		expect(result)
			.toBe(DocumentationType.EXAMPLE)
	})

	it('should return OTHER for unrecognized paths', () => {
		const result = getDocumentationType('docs/random/file.md')
		expect(result)
			.toBe(DocumentationType.OTHER)
	})

	it('should handle Windows paths correctly', () => {
		const result = getDocumentationType('docs\\guide\\getting-started.md')
		expect(result)
			.toBe(DocumentationType.GUIDE)
	})
})

describe('normalizeSignature', () => {
	it('should remove extra whitespace', () => {
		const signature = 'function   foo(  a:  string  ):  void'
		const result = normalizeSignature(signature)
		expect(result)
			.toBe('function foo(a: string): void')
	})

	it('should normalize colons', () => {
		const signature = 'function foo(a:string):void'
		const result = normalizeSignature(signature)
		expect(result)
			.toBe('function foo(a: string): void')
	})

	it('should normalize arrows', () => {
		const signature = 'type Foo = ()=>void'
		const result = normalizeSignature(signature)
		expect(result)
			.toBe('type Foo = () => void')
	})

	it('should normalize union types', () => {
		const signature = 'type Foo = string|number'
		const result = normalizeSignature(signature)
		expect(result)
			.toBe('type Foo = string | number')
	})

	it('should normalize intersection types', () => {
		const signature = 'type Foo = A&B'
		const result = normalizeSignature(signature)
		expect(result)
			.toBe('type Foo = A & B')
	})

	it('should trim leading and trailing whitespace', () => {
		const signature = '  function foo(): void  '
		const result = normalizeSignature(signature)
		expect(result)
			.toBe('function foo(): void')
	})

	it('should handle complex signatures', () => {
		const signature = 'function   foo<T>(a:  string|number,b:(x:T)=>void):Promise<T>&Thenable<T>'
		const result = normalizeSignature(signature)
		expect(result)
			.toBe('function foo<T>(a: string | number, b: (x: T) => void): Promise<T> & Thenable<T>')
	})
})

describe('parseDocumentedAPIs', () => {
	it('should extract function declarations', async () => {
		const apis = await parseDocumentedAPIs(sampleFile)
		const functionAPI = apis.find(api => api.name === 'createEngine')

		expect(functionAPI)
			.toBeDefined()
		expect(functionAPI?.signature)
			.toContain('function createEngine')
		expect(functionAPI?.signature)
			.toContain('config?: EngineConfig')
		expect(functionAPI?.signature)
			.toContain('Promise<Engine>')
	})

	it('should extract interface declarations', async () => {
		const apis = await parseDocumentedAPIs(sampleFile)
		const interfaceAPI = apis.find(api => api.name === 'EngineConfig')

		expect(interfaceAPI)
			.toBeDefined()
		expect(interfaceAPI?.signature)
			.toContain('interface EngineConfig')
		expect(interfaceAPI?.signature)
			.toContain('plugins?: EnginePlugin[]')
	})

	it('should extract type declarations', async () => {
		const apis = await parseDocumentedAPIs(sampleFile)
		const typeAPI = apis.find(api => api.name === 'StyleValue')

		expect(typeAPI)
			.toBeDefined()
		expect(typeAPI?.signature)
			.toContain('type StyleValue')
		expect(typeAPI?.signature)
			.toContain('string | number')
	})

	it('should skip example code blocks', async () => {
		const apis = await parseDocumentedAPIs(sampleFile)
		const exampleAPI = apis.find(api => api.name === 'exampleFunction')

		expect(exampleAPI)
			.toBeUndefined()
	})

	it('should capture correct line numbers', async () => {
		const apis = await parseDocumentedAPIs(sampleFile)

		expect(apis.length)
			.toBeGreaterThan(0)
		apis.forEach((api) => {
			expect(api.line)
				.toBeGreaterThan(0)
		})
	})

	it('should normalize extracted signatures', async () => {
		const apis = await parseDocumentedAPIs(sampleFile)

		apis.forEach((api) => {
			// Check that signatures are normalized (no excessive whitespace)
			expect(api.signature).not.toMatch(/\s{2,}/)
			// Check proper spacing around special characters
			if (api.signature.includes(':')) {
				expect(api.signature)
					.toMatch(/:\s/)
			}
			if (api.signature.includes('=>')) {
				expect(api.signature)
					.toMatch(/\s=>\s/)
			}
		})
	})

	it('should handle non-existent files', async () => {
		const apis = await parseDocumentedAPIs('non-existent-file.md')
		expect(apis)
			.toEqual([])
	})

	it('should include file path in results', async () => {
		const apis = await parseDocumentedAPIs(sampleFile)

		apis.forEach((api) => {
			expect(api.file)
				.toBe(sampleFile)
		})
	})

	it('should find exactly 3 APIs from sample fixture', async () => {
		const apis = await parseDocumentedAPIs(sampleFile)
		expect(apis)
			.toHaveLength(3)

		const names = apis.map(api => api.name)
			.sort()
		expect(names)
			.toEqual(['EngineConfig', 'StyleValue', 'createEngine'])
	})
})

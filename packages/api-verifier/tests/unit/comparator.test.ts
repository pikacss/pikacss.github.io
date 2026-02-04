/**
 * Unit tests for comparator module
 */

import type { DocumentedAPI, ExtractedAPI } from '../../src/types'
import { describe, expect, it } from 'vitest'
import { calculateCoverage, compareAPIs, compareSignatures, detectContradictions } from '../../src/comparator'
import { DocumentationType } from '../../src/types'

describe('compareSignatures', () => {
	it('should match identical signatures in API_REFERENCE context', () => {
		const result = compareSignatures(
			'function foo(bar: string): void',
			'function foo(bar: string): void',
			DocumentationType.API_REFERENCE,
		)
		expect(result.matches)
			.toBe(true)
	})

	it('should detect parameter differences in API_REFERENCE context', () => {
		const result = compareSignatures(
			'function foo(bar?: string): void',
			'function foo(bar: string): void',
			DocumentationType.API_REFERENCE,
		)
		expect(result.matches)
			.toBe(false)
		expect(result.differences)
			.toBeDefined()
	})

	it('should allow simplified signatures in GUIDE context', () => {
		const result = compareSignatures(
			'function createEngine(config?: EngineConfig): Engine',
			'createEngine(config)',
			DocumentationType.GUIDE,
		)
		expect(result.matches)
			.toBe(true)
	})

	it('should normalize whitespace before comparison', () => {
		const result = compareSignatures(
			'function  foo( bar : string ) : void',
			'function foo(bar: string): void',
			DocumentationType.API_REFERENCE,
		)
		expect(result.matches)
			.toBe(true)
	})
})

describe('compareAPIs', () => {
	it('should return empty array when all APIs match', () => {
		const extracted: ExtractedAPI[] = [{
			name: 'foo',
			kind: 'function',
			signature: 'function foo(bar: string): void',
			sourceFile: 'src/foo.ts',
		}]

		const documented: DocumentedAPI[] = [{
			name: 'foo',
			signature: 'function foo(bar: string): void',
			file: 'docs/api.md',
			line: 10,
			context: DocumentationType.API_REFERENCE,
		}]

		const mismatches = compareAPIs(extracted, documented)
		expect(mismatches)
			.toHaveLength(0)
	})

	it('should detect signature mismatches', () => {
		const extracted: ExtractedAPI[] = [{
			name: 'foo',
			kind: 'function',
			signature: 'function foo(bar?: string): void',
			sourceFile: 'src/foo.ts',
		}]

		const documented: DocumentedAPI[] = [{
			name: 'foo',
			signature: 'function foo(bar: string): void',
			file: 'docs/api.md',
			line: 10,
			context: DocumentationType.API_REFERENCE,
		}]

		const mismatches = compareAPIs(extracted, documented)
		expect(mismatches)
			.toHaveLength(1)
		expect(mismatches[0]?.apiName)
			.toBe('foo')
		expect(mismatches[0]?.file)
			.toBe('docs/api.md')
		expect(mismatches[0]?.line)
			.toBe(10)
	})

	it('should handle APIs documented multiple times', () => {
		const extracted: ExtractedAPI[] = [{
			name: 'foo',
			kind: 'function',
			signature: 'function foo(bar: string): void',
			sourceFile: 'src/foo.ts',
		}]

		const documented: DocumentedAPI[] = [
			{
				name: 'foo',
				signature: 'function foo(bar: string): void',
				file: 'docs/api.md',
				line: 10,
				context: DocumentationType.API_REFERENCE,
			},
			{
				name: 'foo',
				signature: 'foo(bar)',
				file: 'docs/guide.md',
				line: 20,
				context: DocumentationType.GUIDE,
			},
		]

		const mismatches = compareAPIs(extracted, documented)
		expect(mismatches)
			.toHaveLength(0) // Both match in their contexts
	})
})

describe('calculateCoverage', () => {
	it('should calculate 100% coverage when all APIs documented', () => {
		const extracted: ExtractedAPI[] = [
			{
				name: 'foo',
				kind: 'function',
				signature: 'function foo(): void',
				sourceFile: 'src/foo.ts',
			},
			{
				name: 'bar',
				kind: 'function',
				signature: 'function bar(): void',
				sourceFile: 'src/bar.ts',
			},
		]

		const documented: DocumentedAPI[] = [
			{
				name: 'foo',
				signature: 'function foo(): void',
				file: 'docs/api.md',
				line: 10,
				context: DocumentationType.API_REFERENCE,
			},
			{
				name: 'bar',
				signature: 'function bar(): void',
				file: 'docs/api.md',
				line: 20,
				context: DocumentationType.API_REFERENCE,
			},
		]

		const coverage = calculateCoverage('@pikacss/test', extracted, documented)
		expect(coverage.packageName)
			.toBe('@pikacss/test')
		expect(coverage.totalAPIs)
			.toBe(2)
		expect(coverage.documentedAPIs)
			.toBe(2)
		expect(coverage.undocumentedAPIs)
			.toHaveLength(0)
		expect(coverage.coveragePercent)
			.toBe(100)
	})

	it('should identify undocumented APIs', () => {
		const extracted: ExtractedAPI[] = [
			{
				name: 'foo',
				kind: 'function',
				signature: 'function foo(): void',
				sourceFile: 'src/foo.ts',
			},
			{
				name: 'bar',
				kind: 'function',
				signature: 'function bar(): void',
				sourceFile: 'src/bar.ts',
			},
		]

		const documented: DocumentedAPI[] = [
			{
				name: 'foo',
				signature: 'function foo(): void',
				file: 'docs/api.md',
				line: 10,
				context: DocumentationType.API_REFERENCE,
			},
		]

		const coverage = calculateCoverage('@pikacss/test', extracted, documented)
		expect(coverage.totalAPIs)
			.toBe(2)
		expect(coverage.documentedAPIs)
			.toBe(1)
		expect(coverage.undocumentedAPIs)
			.toEqual(['bar'])
		expect(coverage.coveragePercent)
			.toBe(50)
	})

	it('should handle empty API lists', () => {
		const coverage = calculateCoverage('@pikacss/empty', [], [])
		expect(coverage.totalAPIs)
			.toBe(0)
		expect(coverage.documentedAPIs)
			.toBe(0)
		// Empty API list returns 100% coverage (nothing to document)
		expect(coverage.coveragePercent)
			.toBe(100)
	})
})

describe('detectContradictions', () => {
	it('should return empty array when no contradictions', () => {
		const documented: DocumentedAPI[] = [
			{
				name: 'foo',
				signature: 'function foo(): void',
				file: 'docs/api.md',
				line: 10,
				context: DocumentationType.API_REFERENCE,
			},
			{
				name: 'bar',
				signature: 'function bar(): void',
				file: 'docs/api.md',
				line: 20,
				context: DocumentationType.API_REFERENCE,
			},
		]

		const contradictions = detectContradictions(documented)
		expect(contradictions)
			.toHaveLength(0)
	})

	it('should detect APIs documented with different signatures', () => {
		const documented: DocumentedAPI[] = [
			{
				name: 'foo',
				signature: 'function foo(bar: string): void',
				file: 'docs/api.md',
				line: 10,
				context: DocumentationType.API_REFERENCE,
			},
			{
				name: 'foo',
				signature: 'function foo(bar: number): void',
				file: 'docs/guide.md',
				line: 20,
				context: DocumentationType.API_REFERENCE,
			},
		]

		const contradictions = detectContradictions(documented)
		expect(contradictions)
			.toHaveLength(1)
		expect(contradictions[0]?.apiName)
			.toBe('foo')
		expect(contradictions[0]?.locations)
			.toHaveLength(2)
	})

	it('should detect contradictions even with GUIDE context if signatures differ after normalization', () => {
		const documented: DocumentedAPI[] = [
			{
				name: 'foo',
				signature: 'function foo(bar: string): void',
				file: 'docs/api.md',
				line: 10,
				context: DocumentationType.API_REFERENCE,
			},
			{
				name: 'foo',
				signature: 'function foo(bar: number): void', // Different signature
				file: 'docs/guide.md',
				line: 20,
				context: DocumentationType.GUIDE,
			},
		]

		const contradictions = detectContradictions(documented)
		// detectContradictions checks normalized signatures regardless of context
		expect(contradictions)
			.toHaveLength(1)
	})
})

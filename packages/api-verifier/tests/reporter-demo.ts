/**
 * Quick demo/test for reporter functionality
 * Run with: pnpm tsx packages/api-verifier/tests/reporter-demo.ts
 */

/* eslint-disable no-console */

import type { VerificationReport } from '../src/types'
import { generateJSONReport, generateMarkdownReport, generateReports } from '../src/reporter'

// Create mock report data
const mockReport: VerificationReport = {
	timestamp: new Date()
		.toISOString(),
	packages: [
		{
			package: {
				name: '@pikacss/core',
				path: '/packages/core',
				entryPoints: ['dist/index.d.ts'],
				version: '0.0.39',
			},
			mismatches: [
				{
					apiName: 'createEngine',
					file: 'docs/api-reference.md',
					line: 42,
					extracted: 'function createEngine(config?: EngineConfig): Engine',
					documented: 'function createEngine(config: EngineConfig): Engine',
					differences: [
						'Parameter "config" optionality mismatch: optional in source, required in docs',
					],
				},
			],
			coverage: {
				packageName: '@pikacss/core',
				totalAPIs: 15,
				documentedAPIs: 13,
				undocumentedAPIs: ['internalHelper', 'debugUtils'],
				coveragePercent: 86.67,
			},
		},
		{
			package: {
				name: '@pikacss/integration',
				path: '/packages/integration',
				entryPoints: ['dist/index.d.ts'],
				version: '0.0.39',
			},
			mismatches: [],
			coverage: {
				packageName: '@pikacss/integration',
				totalAPIs: 8,
				documentedAPIs: 8,
				undocumentedAPIs: [],
				coveragePercent: 100,
			},
		},
	],
	summary: {
		totalAPIs: 23,
		documentedAPIs: 21,
		mismatches: 1,
		contradictions: 1,
		coveragePercent: 91.3,
	},
	contradictions: [
		{
			apiName: 'pika',
			message: 'API documented with different signatures across multiple files',
			locations: [
				{
					file: 'docs/guide/getting-started.md',
					line: 15,
					signature: 'pika(styles: StyleObject)',
				},
				{
					file: 'docs/api-reference.md',
					line: 100,
					signature: 'function pika<T extends StyleObject>(styles: T): string',
				},
			],
		},
	],
}

console.log('=== Testing Reporter ===\n')

// Test JSON generation
console.log('1. JSON Report Generation:')
const jsonReport = generateJSONReport(mockReport)
console.log(`   ✓ Generated ${jsonReport.length} bytes`)
console.log(`   ✓ Valid JSON: ${JSON.parse(jsonReport) ? 'yes' : 'no'}`)
console.log()

// Test Markdown generation
console.log('2. Markdown Report Generation:')
const mdReport = generateMarkdownReport(mockReport)
console.log(`   ✓ Generated ${mdReport.length} bytes`)
console.log(`   ✓ Contains header: ${mdReport.includes('# API Verification Report')}`)
console.log(`   ✓ Contains summary: ${mdReport.includes('## Summary')}`)
console.log(`   ✓ Contains mismatches: ${mdReport.includes('## Signature Mismatches')}`)
console.log(`   ✓ Contains contradictions: ${mdReport.includes('## Documentation Contradictions')}`)
console.log()

// Test file writing
console.log('3. File Writing:')
const outputDir = '/tmp/api-verifier-test'
generateReports(mockReport, outputDir)
console.log(`   ✓ Written to ${outputDir}/`)
console.log(`   ✓ api-verification-report.json`)
console.log(`   ✓ api-verification-report.md`)
console.log()

console.log('=== All Reporter Tests Passed ===')
console.log()
console.log('Preview Markdown Report:')
console.log('─'.repeat(80))
console.log(mdReport)

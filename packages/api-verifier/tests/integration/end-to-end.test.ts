/**
 * Integration test for full API verification pipeline
 * Tests: extraction → parsing → comparison → reporting
 */

import type { PackageInfo } from '../../src/types'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { verifyAllPackages, verifyPackage } from '../../src/index'

describe('end-to-end verification', () => {
	it('should verify a single package with mock data', async () => {
		// Create temp directory for test
		const testDir = join(tmpdir(), `api-verifier-test-${Date.now()}`)
		mkdirSync(testDir, { recursive: true })

		// Create mock package info (using actual @pikacss/core for realistic test)
		const packageInfo: PackageInfo = {
			name: '@pikacss/core',
			path: join(process.cwd(), 'packages/core'),
			entryPoints: [join(process.cwd(), 'packages/core/dist/index.d.ts')],
			version: '0.0.39',
		}

		// Create mock documentation file
		const docFile = join(testDir, 'test-api.md')
		writeFileSync(docFile, `
# API Reference

## createEngine

\`\`\`typescript
export function createEngine(config?: EngineConfig): Engine
\`\`\`

Creates a new PikaCSS engine instance.
`.trim())

		try {
			// Skip if package not built
			const firstEntryPoint = packageInfo.entryPoints[0]
			if (!firstEntryPoint || !existsSync(firstEntryPoint)) {
				console.warn('Skipping integration test - @pikacss/core not built')
				return
			}

			// Run verification
			const result = await verifyPackage(packageInfo, [docFile])

			// Verify structure
			expect(result.package.name)
				.toBe('@pikacss/core')
			expect(result.mismatches)
				.toBeInstanceOf(Array)
			expect(result.coverage)
				.toBeDefined()
			expect(result.coverage.packageName)
				.toBe('@pikacss/core')
			expect(result.coverage.totalAPIs)
				.toBeGreaterThan(0)
			expect(result.coverage.coveragePercent)
				.toBeGreaterThanOrEqual(0)
			expect(result.coverage.coveragePercent)
				.toBeLessThanOrEqual(100)
		}
		finally {
			// Cleanup
			rmSync(testDir, { recursive: true, force: true })
		}
	}, 30000) // TypeScript compilation overhead

	it('should generate reports for all packages', async () => {
		// Create temp directory for test
		const testDir = join(tmpdir(), `api-verifier-test-${Date.now()}`)
		const outputDir = join(testDir, 'reports')
		mkdirSync(testDir, { recursive: true })

		// Create minimal mock documentation
		const docFile = join(testDir, 'api.md')
		writeFileSync(docFile, `
# Minimal API Doc

## pika

\`\`\`typescript
function pika(styles: any): string
\`\`\`
`.trim())

		try {
			// Note: This uses actual monorepo packages, so results depend on build state
			const report = await verifyAllPackages(`${testDir}/**/*.md`, outputDir)

			// Verify report structure
			expect(report.timestamp)
				.toBeDefined()
			expect(report.packages)
				.toBeInstanceOf(Array)
			expect(report.summary)
				.toBeDefined()
			expect(report.summary.totalAPIs)
				.toBeGreaterThanOrEqual(0)
			expect(report.summary.documentedAPIs)
				.toBeGreaterThanOrEqual(0)
			expect(report.summary.coveragePercent)
				.toBeGreaterThanOrEqual(0)
			expect(report.contradictions)
				.toBeInstanceOf(Array)

			// Verify files were generated
			expect(existsSync(join(outputDir, 'api-verification-report.json')))
				.toBe(true)
			expect(existsSync(join(outputDir, 'api-verification-report.md')))
				.toBe(true)
		}
		finally {
			// Cleanup
			rmSync(testDir, { recursive: true, force: true })
		}
	}, 120000) // Multiple packages: TypeScript compilation overhead
})

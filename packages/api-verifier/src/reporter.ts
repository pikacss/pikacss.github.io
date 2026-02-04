/**
 * Report generation module for API verification results
 * Generates both JSON (for CI automation) and Markdown (for human review)
 */

import type { VerificationReport } from './types'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Generate JSON report from verification results
 */
export function generateJSONReport(report: VerificationReport): string {
	return JSON.stringify(report, null, 2)
}

/**
 * Generate human-readable Markdown report from verification results
 */
export function generateMarkdownReport(report: VerificationReport): string {
	const lines: string[] = []

	// Header
	lines.push('# API Verification Report')
	lines.push('')
	lines.push(`**Generated:** ${report.timestamp}`)
	lines.push('')

	// Overall Summary
	lines.push('## Summary')
	lines.push('')
	lines.push('| Metric | Value |')
	lines.push('|--------|-------|')
	lines.push(`| Total APIs | ${report.summary.totalAPIs} |`)
	lines.push(`| Documented APIs | ${report.summary.documentedAPIs} |`)
	lines.push(`| Coverage | ${report.summary.coveragePercent.toFixed(2)}% |`)
	lines.push(`| Signature Mismatches | ${report.summary.mismatches} ${report.summary.mismatches === 0 ? '✅' : '❌'} |`)
	lines.push(`| Contradictions | ${report.summary.contradictions} ${report.summary.contradictions === 0 ? '✅' : '❌'} |`)
	lines.push('')

	// Per-Package Results
	lines.push('## Package Coverage')
	lines.push('')
	for (const pkg of report.packages) {
		const { coverage } = pkg
		const statusEmoji = coverage.coveragePercent === 100 ? '✅' : coverage.coveragePercent >= 80 ? '⚠️' : '❌'

		lines.push(`### ${pkg.package.name} ${statusEmoji}`)
		lines.push('')
		lines.push(`- **Coverage:** ${coverage.coveragePercent.toFixed(2)}% (${coverage.documentedAPIs}/${coverage.totalAPIs} APIs)`)
		lines.push(`- **Mismatches:** ${pkg.mismatches.length}`)
		lines.push('')

		// Undocumented APIs
		if (coverage.undocumentedAPIs.length > 0) {
			lines.push('**Undocumented APIs:**')
			lines.push('')
			for (const apiName of coverage.undocumentedAPIs) {
				lines.push(`- \`${apiName}\``)
			}
			lines.push('')
		}
	}

	// Detailed Mismatches
	if (report.summary.mismatches > 0) {
		lines.push('## Signature Mismatches')
		lines.push('')
		for (const pkg of report.packages) {
			if (pkg.mismatches.length > 0) {
				lines.push(`### ${pkg.package.name}`)
				lines.push('')
				for (const mismatch of pkg.mismatches) {
					lines.push(`#### \`${mismatch.apiName}\` (${mismatch.file}:${mismatch.line})`)
					lines.push('')
					lines.push('**Expected (from source):**')
					lines.push('```typescript')
					lines.push(mismatch.extracted)
					lines.push('```')
					lines.push('')
					lines.push('**Documented:**')
					lines.push('```typescript')
					lines.push(mismatch.documented)
					lines.push('```')
					lines.push('')
					if (mismatch.differences.length > 0) {
						lines.push('**Differences:**')
						for (const diff of mismatch.differences) {
							lines.push(`- ${diff}`)
						}
						lines.push('')
					}
				}
			}
		}
	}

	// Contradictions
	if (report.contradictions.length > 0) {
		lines.push('## Documentation Contradictions')
		lines.push('')
		for (const contradiction of report.contradictions) {
			lines.push(`### \`${contradiction.apiName}\``)
			lines.push('')
			lines.push(`**Issue:** ${contradiction.message}`)
			lines.push('')
			lines.push('**Conflicting locations:**')
			lines.push('')
			for (const location of contradiction.locations) {
				lines.push(`- **${location.file}:${location.line}**`)
				lines.push('  ```typescript')
				lines.push(`  ${location.signature}`)
				lines.push('  ```')
			}
			lines.push('')
		}
	}

	return lines.join('\n')
}

/**
 * Write both JSON and Markdown reports to output directory
 */
export function generateReports(report: VerificationReport, outputDir: string): void {
	// Ensure output directory exists
	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true })
	}

	// Write JSON report
	const jsonPath = join(outputDir, 'api-verification-report.json')
	writeFileSync(jsonPath, generateJSONReport(report), 'utf-8')

	// Write Markdown report
	const mdPath = join(outputDir, 'api-verification-report.md')
	writeFileSync(mdPath, generateMarkdownReport(report), 'utf-8')
}

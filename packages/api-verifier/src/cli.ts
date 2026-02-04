#!/usr/bin/env node
/**
 * CLI entry point for API verification
 * Executes verification and generates reports to current directory
 */

import process from 'node:process'
import { verifyAllPackages } from './index'

async function main() {
	console.log('Starting API verification...')
	console.log()

	try {
		// Run verification, generate reports to current directory (repo root)
		const report = await verifyAllPackages('docs/**/*.md', '.')

		console.log()
		console.log('=== Verification Summary ===')
		console.log(`Total APIs: ${report.summary.totalAPIs}`)
		console.log(`Documented APIs: ${report.summary.documentedAPIs} (${report.summary.coveragePercent.toFixed(1)}%)`)
		console.log(`Mismatches: ${report.summary.mismatches}`)
		console.log(`Contradictions: ${report.summary.contradictions}`)
		console.log()

		// Exit with code 1 if mismatches or undocumented APIs found
		if (report.summary.mismatches > 0) {
			console.error('✗ API mismatches found')
			process.exit(1)
		}

		// Check for undocumented APIs across all packages
		const undocumentedCount = report.packages.reduce(
			(sum, pkg) => sum + pkg.coverage.undocumentedAPIs.length,
			0,
		)

		if (undocumentedCount > 0) {
			console.error(`✗ ${undocumentedCount} undocumented API(s) found`)
			process.exit(1)
		}

		console.log('✓ All API documentation is accurate')
		process.exit(0)
	}
	catch (error) {
		console.error('Error during verification:', error)
		process.exit(1)
	}
}

main()

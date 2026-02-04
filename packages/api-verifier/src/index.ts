/**
 * API Verifier - Main orchestrator
 * Coordinates extraction, parsing, comparison, and reporting
 */

import type { ComparisonResult, DocumentedAPI, ExtractedAPI, PackageInfo, VerificationReport } from './types'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { calculateCoverage, compareAPIs, detectContradictions } from './comparator'
import { extractPackageAPIs, getMonorepoPackages } from './extractor'
import { parseDocumentedAPIs } from './parser'
import { generateReports } from './reporter'

/**
 * Simple glob implementation for markdown files
 */
function findMarkdownFiles(dir: string, pattern: RegExp = /\.md$/): string[] {
	const results: string[] = []

	function scan(currentDir: string) {
		const entries = fs.readdirSync(currentDir, { withFileTypes: true })

		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name)

			// Skip node_modules and hidden directories
			if (entry.name.startsWith('.') || entry.name === 'node_modules') {
				continue
			}

			if (entry.isDirectory()) {
				scan(fullPath)
			}
			else if (entry.isFile() && pattern.test(entry.name)) {
				results.push(fullPath)
			}
		}
	}

	scan(dir)
	return results
}

/**
 * Verify API documentation for a single package
 */
export async function verifyPackage(
	packageInfo: PackageInfo,
	docFiles: string[],
): Promise<ComparisonResult> {
	// Extract APIs from each entry point
	const allExtractedAPIs: ExtractedAPI[] = []
	for (const entryPoint of packageInfo.entryPoints) {
		const extractionResult = extractPackageAPIs(entryPoint)
		allExtractedAPIs.push(...extractionResult.apis)
	}

	// Parse documentation files
	const documentedAPIs: DocumentedAPI[] = []
	for (const file of docFiles) {
		const apis = await parseDocumentedAPIs(file)
		documentedAPIs.push(...apis)
	}

	// Compare APIs
	const mismatches = compareAPIs(allExtractedAPIs, documentedAPIs)

	// Calculate coverage
	const coverage = calculateCoverage(packageInfo.name, allExtractedAPIs, documentedAPIs)

	return {
		package: packageInfo,
		mismatches,
		coverage,
	}
}

/**
 * Verify API documentation for all packages in the monorepo
 */
export async function verifyAllPackages(
	docGlob: string = 'docs/**/*.md',
	outputDir: string = 'reports',
): Promise<VerificationReport> {
	// Get all packages
	const packages = getMonorepoPackages()

	// Parse documentation glob pattern - simple implementation
	// Assumes pattern like "docs/**/*.md" means scan docs directory for .md files
	const docDir = docGlob.split('/')[0] || 'docs'
	const docFiles = findMarkdownFiles(docDir)

	// Parse all documentation files
	const allDocumentedAPIs: DocumentedAPI[] = []
	for (const file of docFiles) {
		const apis = await parseDocumentedAPIs(file)
		allDocumentedAPIs.push(...apis)
	}

	// Verify each package
	const results: ComparisonResult[] = []
	for (const pkg of packages) {
		const result = await verifyPackage(pkg, docFiles)
		results.push(result)
	}

	// Detect cross-package contradictions
	const contradictions = detectContradictions(allDocumentedAPIs)

	// Calculate summary statistics
	const totalAPIs = results.reduce((sum, r) => sum + r.coverage.totalAPIs, 0)
	const documentedAPIs = results.reduce((sum, r) => sum + r.coverage.documentedAPIs, 0)
	const mismatches = results.reduce((sum, r) => sum + r.mismatches.length, 0)
	const coveragePercent = totalAPIs > 0 ? (documentedAPIs / totalAPIs) * 100 : 0

	// Build report
	const report: VerificationReport = {
		timestamp: new Date()
			.toISOString(),
		packages: results,
		summary: {
			totalAPIs,
			documentedAPIs,
			mismatches,
			contradictions: contradictions.length,
			coveragePercent,
		},
		contradictions,
	}

	// Generate reports
	generateReports(report, outputDir)

	return report
}

export {
	calculateCoverage,
	compareAPIs,
	compareSignatures,
	detectContradictions,
} from './comparator'

// Export all types and functions from submodules
export {
	extractPackageAPIs,
	getMonorepoPackages,
	getPackageEntryPoints,
} from './extractor'

export {
	getDocumentationType,
	normalizeSignature,
	parseDocumentedAPIs,
} from './parser'

export {
	generateJSONReport,
	generateMarkdownReport,
	generateReports,
} from './reporter'

export type {
	APIExtractionResult,
	ComparisonResult,
	Contradiction,
	DocumentationType,
	DocumentedAPI,
	ExtractedAPI,
	PackageCoverage,
	PackageInfo,
	SignatureMismatch,
	VerificationReport,
} from './types'

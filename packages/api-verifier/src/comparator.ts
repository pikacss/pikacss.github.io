/**
 * API comparison logic with mismatch detection
 */

import type { Contradiction, DocumentedAPI, ExtractedAPI, PackageCoverage, SignatureMismatch } from './types'
import { normalizeSignature } from './parser'
import { DocumentationType } from './types'

/**
 * Compare extracted signature with documented signature
 * Returns whether they match and any differences found
 */
export function compareSignatures(
	extracted: string,
	documented: string,
	context: DocumentationType,
): { matches: boolean, differences?: string[] } {
	const normExtracted = normalizeSignature(extracted)
	const normDocumented = normalizeSignature(documented)

	// For API_REFERENCE context, require exact match
	if (context === DocumentationType.API_REFERENCE) {
		if (normExtracted === normDocumented) {
			return { matches: true }
		}

		// Detailed difference detection
		const differences: string[] = []

		// Extract parameters
		const extractedParams = normExtracted.match(/\(([^)]*)\)/)?.[1]
		const documentedParams = normDocumented.match(/\(([^)]*)\)/)?.[1]

		if (extractedParams !== documentedParams) {
			differences.push(`Parameters differ: extracted(${extractedParams || 'none'}) vs documented(${documentedParams || 'none'})`)
		}

		// Extract return type (use negated set to avoid backtracking)
		const extractedReturn = normExtracted.match(/=>\s*(\S.*)$/)?.[1]
		const documentedReturn = normDocumented.match(/=>\s*(\S.*)$/)?.[1]

		if (extractedReturn !== documentedReturn) {
			differences.push(`Return type differs: extracted(${extractedReturn || 'unknown'}) vs documented(${documentedReturn || 'unknown'})`)
		}

		// If no specific differences detected but strings don't match
		if (differences.length === 0) {
			differences.push('Signature format or structure differs')
		}

		return { matches: false, differences }
	}

	// For GUIDE context, allow simplified signatures
	// Check core elements: function name exists, basic structure matches
	if (context === DocumentationType.GUIDE) {
		// Extract function/interface/type name from both
		const extractedName = normExtracted.match(/^(?:function\s+)?(\w+)/)?.[1]
		const documentedName = normDocumented.match(/^(?:function\s+)?(\w+)/)?.[1]

		// Names must match
		if (extractedName !== documentedName) {
			return {
				matches: false,
				differences: [`API name differs: extracted(${extractedName}) vs documented(${documentedName})`],
			}
		}

		// For guides, accept simplified documentation
		return { matches: true }
	}

	// For EXAMPLE context, just check that API exists
	return { matches: true }
}

/**
 * Compare all extracted APIs against documented APIs
 * Returns list of signature mismatches
 */
export function compareAPIs(
	extractedAPIs: ExtractedAPI[],
	documentedAPIs: DocumentedAPI[],
): SignatureMismatch[] {
	const mismatches: SignatureMismatch[] = []

	// Create map of documented APIs by name for fast lookup
	const documentedMap = new Map<string, DocumentedAPI[]>()
	for (const doc of documentedAPIs) {
		if (!documentedMap.has(doc.name)) {
			documentedMap.set(doc.name, [])
		}
		documentedMap.get(doc.name)!.push(doc)
	}

	// For each extracted API, find matching documented API and compare
	for (const extracted of extractedAPIs) {
		const documented = documentedMap.get(extracted.name)

		if (!documented || documented.length === 0) {
			// API not documented - this is a coverage issue, not a mismatch
			continue
		}

		// Compare against each documented instance
		for (const doc of documented) {
			const comparison = compareSignatures(
				extracted.signature,
				doc.signature,
				doc.context,
			)

			if (!comparison.matches) {
				mismatches.push({
					apiName: extracted.name,
					file: doc.file,
					line: doc.line,
					extracted: extracted.signature,
					documented: doc.signature,
					differences: comparison.differences || ['Signatures do not match'],
				})
			}
		}
	}

	return mismatches
}

/**
 * Calculate API documentation coverage for a package
 */
export function calculateCoverage(
	packageName: string,
	extractedAPIs: ExtractedAPI[],
	documentedAPIs: DocumentedAPI[],
): PackageCoverage {
	// Create set of documented API names
	const documentedNames = new Set(documentedAPIs.map(api => api.name))

	// Find undocumented APIs
	const undocumentedAPIs = extractedAPIs
		.filter(api => !documentedNames.has(api.name))
		.map(api => api.name)

	const totalAPIs = extractedAPIs.length
	const documentedCount = totalAPIs - undocumentedAPIs.length
	const coveragePercent = totalAPIs === 0 ? 100 : (documentedCount / totalAPIs) * 100

	return {
		packageName,
		totalAPIs,
		documentedAPIs: documentedCount,
		undocumentedAPIs,
		coveragePercent,
	}
}

/**
 * Detect contradictions where same API is documented differently across files
 */
export function detectContradictions(documentedAPIs: DocumentedAPI[]): Contradiction[] {
	// Group APIs by name
	const apiGroups = new Map<string, DocumentedAPI[]>()

	for (const api of documentedAPIs) {
		if (!apiGroups.has(api.name)) {
			apiGroups.set(api.name, [])
		}
		apiGroups.get(api.name)!.push(api)
	}

	const contradictions: Contradiction[] = []

	// Check each API group for contradictions
	for (const [apiName, apis] of apiGroups.entries()) {
		if (apis.length <= 1) {
			// Only one documentation instance, no contradiction possible
			continue
		}

		// Normalize all signatures and check for differences
		const normalizedSignatures = new Set(
			apis.map(api => normalizeSignature(api.signature)),
		)

		if (normalizedSignatures.size > 1) {
			// Multiple different signatures found
			contradictions.push({
				apiName,
				message: `API documented inconsistently across ${apis.length} locations`,
				locations: apis.map(api => ({
					file: api.file,
					line: api.line,
					signature: api.signature,
				})),
			})
		}
	}

	return contradictions
}

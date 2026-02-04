/**
 * Core type definitions for API verification tooling
 */

/**
 * Extracted API information from source code
 */
export interface ExtractedAPI {
	/** Name of the exported API */
	name: string
	/** Type of API (function, class, interface, type, variable) */
	kind: 'function' | 'class' | 'interface' | 'type' | 'variable'
	/** Full type signature as string */
	signature: string
	/** Function parameters (if applicable) */
	parameters?: Array<{
		name: string
		type: string
		optional: boolean
	}>
	/** Return type (for functions) */
	returnType?: string
	/** Source file path */
	sourceFile: string
	/** Generic type parameters */
	typeParameters?: string[]
	/** Whether marked as deprecated */
	deprecated?: boolean
}

/**
 * Package information
 */
export interface PackageInfo {
	/** Package name (@pikacss/...) */
	name: string
	/** Absolute path to package directory */
	path: string
	/** Entry point file paths (.d.ts files) */
	entryPoints: string[]
	/** Package version */
	version: string
}

/**
 * Result of API extraction for a package
 */
export interface APIExtractionResult {
	/** Package information */
	package: PackageInfo
	/** Extracted APIs */
	apis: ExtractedAPI[]
	/** Errors encountered during extraction */
	errors: string[]
}

/**
 * Type of documentation context
 */
export enum DocumentationType {
	/** API Reference documentation (requires exact signatures) */
	API_REFERENCE = 'api-reference',
	/** Guide documentation (allows simplified signatures) */
	GUIDE = 'guide',
	/** Example documentation (illustrative code) */
	EXAMPLE = 'example',
	/** Other documentation types */
	OTHER = 'other',
}

/**
 * API signature documented in markdown files
 */
export interface DocumentedAPI {
	/** Name of the API */
	name: string
	/** Full signature as documented */
	signature: string
	/** Documentation file path */
	file: string
	/** Line number in documentation file */
	line: number
	/** Type of documentation context */
	context: DocumentationType
}

/**
 * Signature mismatch between extracted API and documented API
 */
export interface SignatureMismatch {
	/** Name of the API with mismatch */
	apiName: string
	/** Documentation file path */
	file: string
	/** Line number in documentation */
	line: number
	/** Extracted signature from source code */
	extracted: string
	/** Documented signature from markdown */
	documented: string
	/** Detailed differences */
	differences: string[]
}

/**
 * API documentation contradiction across multiple files
 */
export interface Contradiction {
	/** Name of the API with contradictions */
	apiName: string
	/** Description of the contradiction */
	message: string
	/** All locations where this API is documented differently */
	locations: Array<{
		file: string
		line: number
		signature: string
	}>
}

/**
 * Per-package API coverage statistics
 */
export interface PackageCoverage {
	/** Package name */
	packageName: string
	/** Total number of exported APIs */
	totalAPIs: number
	/** Number of APIs with documentation */
	documentedAPIs: number
	/** List of undocumented API names */
	undocumentedAPIs: string[]
	/** Coverage percentage */
	coveragePercent: number
}

/**
 * Result of comparing package APIs against documentation
 */
export interface ComparisonResult {
	/** Package information */
	package: PackageInfo
	/** Signature mismatches found */
	mismatches: SignatureMismatch[]
	/** Coverage statistics */
	coverage: PackageCoverage
}

/**
 * Complete verification report with summary statistics
 */
export interface VerificationReport {
	/** Report generation timestamp (ISO 8601) */
	timestamp: string
	/** Per-package comparison results */
	packages: ComparisonResult[]
	/** Overall summary statistics */
	summary: {
		/** Total number of APIs across all packages */
		totalAPIs: number
		/** Number of APIs with documentation */
		documentedAPIs: number
		/** Number of signature mismatches found */
		mismatches: number
		/** Number of contradictions found */
		contradictions: number
		/** Overall coverage percentage */
		coveragePercent: number
	}
	/** Cross-package contradictions */
	contradictions: Contradiction[]
}

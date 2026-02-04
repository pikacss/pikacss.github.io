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

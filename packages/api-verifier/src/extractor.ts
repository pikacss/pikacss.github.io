/**
 * TypeScript Compiler API-based extraction logic
 */

import type { APIExtractionResult, ExtractedAPI, PackageInfo } from './types'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as ts from 'typescript'

/**
 * Get all monorepo packages by reading pnpm-workspace.yaml
 */
export function getMonorepoPackages(): PackageInfo[] {
	const workspaceRoot = findWorkspaceRoot()
	const packagesDir = path.join(workspaceRoot, 'packages')

	if (!fs.existsSync(packagesDir)) {
		return []
	}

	const packages: PackageInfo[] = []
	const entries = fs.readdirSync(packagesDir, { withFileTypes: true })

	for (const entry of entries) {
		if (!entry.isDirectory())
			continue

		const pkgPath = path.join(packagesDir, entry.name)
		const pkgJsonPath = path.join(pkgPath, 'package.json')

		if (!fs.existsSync(pkgJsonPath))
			continue

		try {
			const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))

			// Only include @pikacss/* packages
			if (pkgJson.name?.startsWith('@pikacss/')) {
				const entryPoints = getPackageEntryPoints(pkgPath)
				packages.push({
					name: pkgJson.name,
					path: pkgPath,
					entryPoints,
					version: pkgJson.version || '0.0.0',
				})
			}
		}
		catch (error) {
			// Skip invalid package.json
			console.warn(`Failed to parse ${pkgJsonPath}:`, error)
		}
	}

	return packages
}

/**
 * Find workspace root by looking for pnpm-workspace.yaml
 */
function findWorkspaceRoot(): string {
	// eslint-disable-next-line node/prefer-global/process
	let currentDir = process.cwd()

	while (currentDir !== path.parse(currentDir).root) {
		const workspaceFile = path.join(currentDir, 'pnpm-workspace.yaml')
		if (fs.existsSync(workspaceFile)) {
			return currentDir
		}
		currentDir = path.dirname(currentDir)
	}

	// Fallback to cwd if not found
	// eslint-disable-next-line node/prefer-global/process
	return process.cwd()
}

/**
 * Get entry points from package.json exports field
 */
export function getPackageEntryPoints(packagePath: string): string[] {
	const pkgJsonPath = path.join(packagePath, 'package.json')

	if (!fs.existsSync(pkgJsonPath)) {
		return []
	}

	try {
		const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
		const entryPoints: string[] = []

		// Parse exports field
		if (pkgJson.exports) {
			const exports = pkgJson.exports

			// Handle string export
			if (typeof exports === 'string') {
				const resolved = resolveTypesPath(packagePath, exports)
				if (resolved)
					entryPoints.push(resolved)
			}
			// Handle object exports
			else if (typeof exports === 'object') {
				for (const value of Object.values(exports)) {
					if (typeof value === 'object' && value !== null) {
						// Prefer import.types, fall back to import, then types
						const typesPath
							= (value as any).import?.types
								|| (value as any).import
								|| (value as any).types

						if (typesPath && typeof typesPath === 'string') {
							const resolved = resolveTypesPath(packagePath, typesPath)
							if (resolved)
								entryPoints.push(resolved)
						}
					}
				}
			}
		}

		// Fallback to types field
		if (entryPoints.length === 0 && pkgJson.types) {
			const resolved = resolveTypesPath(packagePath, pkgJson.types)
			if (resolved)
				entryPoints.push(resolved)
		}

		return entryPoints
	}
	catch (error) {
		console.warn(`Failed to read package.json at ${pkgJsonPath}:`, error)
		return []
	}
}

/**
 * Resolve types path to .d.ts file
 */
function resolveTypesPath(packagePath: string, typesPath: string): string | null {
	const resolved = path.resolve(packagePath, typesPath)

	// Check if file exists
	if (fs.existsSync(resolved)) {
		return resolved
	}

	// Try adding .d.ts extension
	if (!typesPath.endsWith('.d.ts') && !typesPath.endsWith('.d.mts') && !typesPath.endsWith('.d.cts')) {
		const withDts = `${resolved}.d.ts`
		if (fs.existsSync(withDts)) {
			return withDts
		}
		const withDmts = `${resolved}.d.mts`
		if (fs.existsSync(withDmts)) {
			return withDmts
		}
	}

	return null
}

/**
 * Extract all public APIs from a package entry point
 */
export function extractPackageAPIs(entryPoint: string): APIExtractionResult {
	const result: APIExtractionResult = {
		package: {
			name: '',
			path: path.dirname(entryPoint),
			entryPoints: [entryPoint],
			version: '0.0.0',
		},
		apis: [],
		errors: [],
	}

	try {
		// Create TypeScript program
		const program = ts.createProgram([entryPoint], {
			moduleResolution: ts.ModuleResolutionKind.NodeNext,
			target: ts.ScriptTarget.ESNext,
			noEmit: true,
		})

		const checker = program.getTypeChecker()
		const sourceFile = program.getSourceFile(entryPoint)

		if (!sourceFile) {
			result.errors.push(`Failed to load source file: ${entryPoint}`)
			return result
		}

		// Get module symbol
		const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
		if (!moduleSymbol) {
			result.errors.push(`No module symbol found for ${entryPoint}`)
			return result
		}

		// Get all exports
		const exports = checker.getExportsOfModule(moduleSymbol)

		for (const exportSymbol of exports) {
			try {
				const api = extractAPIFromSymbol(exportSymbol, checker, sourceFile)
				if (api) {
					result.apis.push(api)
				}
			}
			catch (error) {
				result.errors.push(
					`Failed to extract ${exportSymbol.getName()}: ${(error as Error).message}`,
				)
			}
		}
	}
	catch (error) {
		result.errors.push(`Failed to extract APIs: ${(error as Error).message}`)
	}

	return result
}

/**
 * Extract API information from a TypeScript symbol
 */
function extractAPIFromSymbol(
	symbol: ts.Symbol,
	checker: ts.TypeChecker,
	sourceFile: ts.SourceFile,
): ExtractedAPI | null {
	let decl = symbol.declarations?.[0]
	if (!decl)
		return null

	// Resolve export specifiers to actual declarations
	if (ts.isExportSpecifier(decl)) {
		const aliasedSymbol = checker.getAliasedSymbol(symbol)
		if (aliasedSymbol && aliasedSymbol.declarations) {
			decl = aliasedSymbol.declarations[0]!
		}
	}

	const type = checker.getTypeOfSymbolAtLocation(symbol, decl)
	const name = symbol.getName()
	const kind = getDeclarationKind(decl, type)

	// Get signature with full type information
	const signature = checker.typeToString(
		type,
		undefined,
		ts.TypeFormatFlags.NoTruncation
		| ts.TypeFormatFlags.WriteTypeArgumentsOfSignature
		| ts.TypeFormatFlags.UseStructuralFallback,
	)

	const api: ExtractedAPI = {
		name,
		kind,
		signature,
		sourceFile: sourceFile.fileName,
	}

	// Extract function-specific information
	const callSignatures = type.getCallSignatures()
	if (callSignatures.length > 0 && kind === 'function') {
		const callSig = callSignatures[0]!

		// Extract parameters
		api.parameters = callSig.parameters.map((param) => {
			const paramType = checker.getTypeOfSymbolAtLocation(param, decl)
			return {
				name: param.getName(),
				type: checker.typeToString(paramType),
				optional: !!(param.flags & ts.SymbolFlags.Optional),
			}
		})

		// Extract return type
		const returnType = callSig.getReturnType()
		api.returnType = checker.typeToString(returnType)
	}

	// Extract generic type parameters
	if (type.aliasTypeArguments && type.aliasTypeArguments.length > 0) {
		api.typeParameters = type.aliasTypeArguments.map(t =>
			checker.typeToString(t),
		)
	}

	// Check for @deprecated JSDoc tag
	const jsDocTags = symbol.getJsDocTags()
	api.deprecated = jsDocTags.some(tag => tag.name === 'deprecated')

	return api
}

/**
 * Get declaration kind from TypeScript declaration and type
 */
function getDeclarationKind(
	decl: ts.Declaration,
	type: ts.Type,
): ExtractedAPI['kind'] {
	// Check declaration first (most reliable)
	if (ts.isFunctionDeclaration(decl))
		return 'function'
	if (ts.isClassDeclaration(decl))
		return 'class'
	if (ts.isInterfaceDeclaration(decl))
		return 'interface'
	if (ts.isTypeAliasDeclaration(decl))
		return 'type'

	// For variable declarations, check the type characteristics
	if (ts.isVariableDeclaration(decl)) {
		// Check if it's a function (has call signatures)
		const callSignatures = type.getCallSignatures()
		if (callSignatures.length > 0) {
			return 'function'
		}

		// Check if it's a type alias symbol
		if (type.aliasSymbol) {
			const aliasDecl = type.aliasSymbol.declarations?.[0]
			if (aliasDecl && ts.isTypeAliasDeclaration(aliasDecl)) {
				return 'type'
			}
			if (aliasDecl && ts.isInterfaceDeclaration(aliasDecl)) {
				return 'interface'
			}
		}

		// Check if it's an object type that looks like an interface
		if (type.isClassOrInterface()) {
			return 'interface'
		}

		return 'variable'
	}

	return 'variable' // default fallback
}

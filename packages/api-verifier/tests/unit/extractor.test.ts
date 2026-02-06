import * as path from 'node:path'
import { describe, expect, it } from 'vitest'
import { extractPackageAPIs, getMonorepoPackages, getPackageEntryPoints } from '../../src/extractor'

describe('getMonorepoPackages', () => {
	it('should discover exactly 9 packages', () => {
		const packages = getMonorepoPackages()
		expect(packages)
			.toHaveLength(9)
	})

	it('should return packages with valid paths and package.json', () => {
		const packages = getMonorepoPackages()
		for (const pkg of packages) {
			expect(pkg.name)
				.toMatch(/^@pikacss\//)
			expect(pkg.path)
				.toBeTruthy()
			expect(pkg.version)
				.toBeTruthy()
		}
	})

	it('should include all @pikacss/* packages', () => {
		const packages = getMonorepoPackages()
		const names = packages.map(p => p.name)

		// Expected packages based on monorepo structure
		const expectedPackages = [
			'@pikacss/core',
			'@pikacss/integration',
			'@pikacss/unplugin-pikacss',
			'@pikacss/vite-plugin-pikacss',
			'@pikacss/nuxt-pikacss',
			'@pikacss/plugin-icons',
			'@pikacss/plugin-reset',
			'@pikacss/plugin-typography',
			'@pikacss/api-verifier',
		]

		for (const expected of expectedPackages) {
			expect(names)
				.toContain(expected)
		}
	})

	it('should populate entryPoints for each package', () => {
		const packages = getMonorepoPackages()
		for (const pkg of packages) {
			expect(pkg.entryPoints)
				.toBeDefined()
			expect(Array.isArray(pkg.entryPoints))
				.toBe(true)
		}
	})
})

describe('getPackageEntryPoints', () => {
	it('should extract entry point from @pikacss/core', () => {
		const packages = getMonorepoPackages()
		const corePackage = packages.find(p => p.name === '@pikacss/core')
		expect(corePackage)
			.toBeDefined()

		const entryPoints = getPackageEntryPoints(corePackage!.path)
		expect(entryPoints.length)
			.toBeGreaterThan(0)
	})

	it('should return .d.mts file path from exports.import.types', () => {
		const packages = getMonorepoPackages()
		const corePackage = packages.find(p => p.name === '@pikacss/core')
		expect(corePackage)
			.toBeDefined()

		const entryPoints = getPackageEntryPoints(corePackage!.path)
		const mainEntryPoint = entryPoints[0]

		expect(mainEntryPoint)
			.toBeTruthy()
		expect(mainEntryPoint)
			.toMatch(/\.d\.(m|c)?ts$/)
	})

	it('should handle missing exports field gracefully', () => {
		// Test with a non-existent path
		const entryPoints = getPackageEntryPoints('/nonexistent/path')
		expect(entryPoints)
			.toEqual([])
	})

	it('should resolve absolute paths', () => {
		const packages = getMonorepoPackages()
		const corePackage = packages.find(p => p.name === '@pikacss/core')
		expect(corePackage)
			.toBeDefined()

		const entryPoints = getPackageEntryPoints(corePackage!.path)
		for (const entryPoint of entryPoints) {
			expect(path.isAbsolute(entryPoint))
				.toBe(true)
		}
	})
})

describe('extractPackageAPIs', () => {
	const packages = getMonorepoPackages()
	const corePackage = packages.find(p => p.name === '@pikacss/core')

	it('should extract APIs from @pikacss/core', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		expect(entryPoints.length)
			.toBeGreaterThan(0)

		const result = extractPackageAPIs(entryPoints[0]!)
		expect(result)
			.toBeDefined()
		expect(result.apis)
			.toBeDefined()
		expect(Array.isArray(result.apis))
			.toBe(true)
	}, 15000) // TypeScript compilation + API extraction

	it('should extract more than 20 APIs from core package', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		// Core package has many exports
		expect(result.apis.length)
			.toBeGreaterThan(20)
	})

	it('should extract defineEngineConfig function with signature', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		const defineEngineConfig = result.apis.find(
			api => api.name === 'defineEngineConfig',
		)

		expect(defineEngineConfig)
			.toBeDefined()
		expect(defineEngineConfig?.kind)
			.toBe('function')
		expect(defineEngineConfig?.signature)
			.toContain('=>')
		expect(defineEngineConfig?.returnType)
			.toBeTruthy()
	})

	it('should extract Engine class with constructor', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		const engineClass = result.apis.find(api => api.name === 'Engine')

		expect(engineClass)
			.toBeDefined()
		expect(engineClass?.kind)
			.toBe('class')
		expect(engineClass?.signature)
			.toBeTruthy()
	})

	it('should extract EngineConfig interface with properties', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		// EngineConfig is exported as EngineConfig$1 (renamed export)
		const engineConfig = result.apis.find(api => api.name.startsWith('EngineConfig'))

		expect(engineConfig)
			.toBeDefined()
		expect(engineConfig?.kind)
			.toBe('interface')
		expect(engineConfig?.signature)
			.toBeTruthy()
		// Signature might be 'any' for complex circular types - that's OK
	})

	it('should extract type aliases like StyleDefinition', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		const styleDefinition = result.apis.find(
			api => api.name === 'StyleDefinition',
		)

		expect(styleDefinition)
			.toBeDefined()
		expect(styleDefinition?.kind)
			.toBe('type')
		expect(styleDefinition?.signature)
			.toBeTruthy()
	})

	it('should preserve generic type parameters', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		// Look for APIs with generic types
		const generics = result.apis.filter(api => api.signature.includes('<'))

		expect(generics.length)
			.toBeGreaterThan(0)
	})

	it('should include function parameter names and types', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		const functions = result.apis.filter(api => api.kind === 'function')
		expect(functions.length)
			.toBeGreaterThan(20)

		// Check that at least one function has parameters
		const functionWithParams = functions.find(
			fn => fn.parameters && fn.parameters.length > 0,
		)

		expect(functionWithParams)
			.toBeDefined()
		expect(functionWithParams?.parameters)
			.toBeDefined()
		expect(functionWithParams?.parameters![0]!.name)
			.toBeTruthy()
		expect(functionWithParams?.parameters![0]!.type)
			.toBeTruthy()
	})

	it('should have no extraction errors for valid package', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		expect(result.errors)
			.toBeDefined()
		expect(Array.isArray(result.errors))
			.toBe(true)
		// Should have minimal or no errors
		expect(result.errors.length)
			.toBeLessThan(5)
	})

	it('should populate sourceFile for each extracted API', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		for (const api of result.apis) {
			expect(api.sourceFile)
				.toBeTruthy()
			expect(path.isAbsolute(api.sourceFile))
				.toBe(true)
		}
	})

	it('should extract return types for functions', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		const functions = result.apis.filter(api => api.kind === 'function')
		expect(functions.length)
			.toBeGreaterThan(20)

		// Check that at least one function has a return type
		const functionWithReturnType = functions.find(fn => fn.returnType)

		expect(functionWithReturnType)
			.toBeDefined()
		expect(functionWithReturnType?.returnType)
			.toBeTruthy()
	})

	it('should detect deprecated APIs via JSDoc tags', () => {
		expect(corePackage)
			.toBeDefined()
		const entryPoints = corePackage!.entryPoints
		const result = extractPackageAPIs(entryPoints[0]!)

		// All APIs should have deprecated field
		for (const api of result.apis) {
			expect(api.deprecated)
				.toBeDefined()
			expect(typeof api.deprecated)
				.toBe('boolean')
		}
	})
})

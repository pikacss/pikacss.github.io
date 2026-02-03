import type { TSESTree } from '@typescript-eslint/utils'
import * as path from 'node:path'
import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
	name => `https://docs.pikacss.io/verification/${name}`,
)

// Layer order from lowest to highest (higher layers can import from lower layers)
const LAYER_ORDER = ['core', 'integration', 'unplugin', 'framework'] as const
type Layer = typeof LAYER_ORDER[number]

// Map package names to their architectural layers
const PACKAGE_LAYERS: Record<string, Layer> = {
	'@pikacss/core': 'core',
	'@pikacss/integration': 'integration',
	'@pikacss/unplugin-pikacss': 'unplugin',
	'@pikacss/vite-plugin-pikacss': 'framework',
	'@pikacss/nuxt-pikacss': 'framework',
	'@pikacss/plugin-icons': 'core',
	'@pikacss/plugin-reset': 'core',
	'@pikacss/plugin-typography': 'core',
}

export const pikaPackageBoundariesRule = createRule({
	name: 'pika-package-boundaries',
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce monorepo layer boundaries in imports',
		},
		messages: {
			invalidImport:
        'Cannot import {{ imported }} ({{ importedLayer }}) from {{ importer }} ({{ importerLayer }}). '
        + 'Violates layer boundary: {{ expectedOrder }}',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		return {
			ImportDeclaration(node: TSESTree.ImportDeclaration) {
				const importPath = node.source.value
				const currentFile = context.filename

				// Determine current package from file path
				const currentPackage = getPackageFromPath(currentFile)
				if (!currentPackage || !(currentPackage in PACKAGE_LAYERS)) {
					// Not in a PikaCSS package, skip validation
					return
				}

				// Check if import is a PikaCSS package
				if (typeof importPath !== 'string' || !importPath.startsWith('@pikacss/')) {
					return
				}

				// Get the imported package name (handle subpath imports)
				const importedPackage = extractPackageName(importPath)
				if (!importedPackage || !(importedPackage in PACKAGE_LAYERS)) {
					return
				}

				// Get layers
				const importerLayer = PACKAGE_LAYERS[currentPackage]
				const importedLayer = PACKAGE_LAYERS[importedPackage]

				// TypeScript guard (should never happen due to checks above)
				if (!importerLayer || !importedLayer) {
					return
				}

				// Validate: can only import from same or lower layer
				if (!isValidImport(importerLayer, importedLayer)) {
					context.report({
						node: node.source,
						messageId: 'invalidImport',
						data: {
							imported: importedPackage,
							importedLayer,
							importer: currentPackage,
							importerLayer,
							expectedOrder: LAYER_ORDER.join(' → '),
						},
					})
				}
			},
		}
	},
})

/**
 * Extract package name from file path
 * Example: /path/to/packages/core/src/index.ts → @pikacss/core
 */
function getPackageFromPath(filePath: string): string | null {
	const normalized = path.normalize(filePath)

	// Try to match packages/{name}/
	const match = normalized.match(/packages[/\\]([^/\\]+)[/\\]/)
	if (!match)
		return null

	const dirName = match[1]
	if (!dirName)
		return null

	// Map directory name to package name
	const packageMap: Record<string, string> = {
		'core': '@pikacss/core',
		'integration': '@pikacss/integration',
		'unplugin': '@pikacss/unplugin-pikacss',
		'vite-plugin': '@pikacss/vite-plugin-pikacss',
		'nuxt-pikacss': '@pikacss/nuxt-pikacss',
		'plugin-icons': '@pikacss/plugin-icons',
		'plugin-reset': '@pikacss/plugin-reset',
		'plugin-typography': '@pikacss/plugin-typography',
	}

	return packageMap[dirName] ?? null
}

/**
 * Extract package name from import path
 * Example: @pikacss/core/internal → @pikacss/core
 */
function extractPackageName(importPath: string): string | null {
	const match = importPath.match(/^(@pikacss\/[^/]+)/)
	return match?.[1] ?? null
}

/**
 * Check if an import is valid according to layer rules
 * Higher layers can import from lower layers, but not vice versa
 */
function isValidImport(importerLayer: Layer, importedLayer: Layer): boolean {
	const importerIndex = LAYER_ORDER.indexOf(importerLayer)
	const importedIndex = LAYER_ORDER.indexOf(importedLayer)

	// Can import from same layer or lower layers (lower index)
	return importedIndex <= importerIndex
}

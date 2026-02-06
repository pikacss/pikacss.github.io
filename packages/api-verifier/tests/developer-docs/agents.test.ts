import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('aGENTS.md Validation', () => {
	// Find monorepo root (where AGENTS.md is located)
	const monorepoRoot = join(process.cwd(), '../..')
	const agentsPath = join(monorepoRoot, 'AGENTS.md')
	const agentsContent = readFileSync(agentsPath, 'utf-8')

	it('lists all monorepo packages', () => {
		// Read actual packages from filesystem by reading their package.json files
		const packagesDir = join(monorepoRoot, 'packages')
		const actualPackages = readdirSync(packagesDir)
			.filter(name => !name.startsWith('.') && name !== 'node_modules')
			.map((dirName) => {
				const pkgJsonPath = join(packagesDir, dirName, 'package.json')
				if (existsSync(pkgJsonPath)) {
					const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'))
					return pkgJson.name
				}
				return null
			})
			.filter(Boolean)
			.sort() as string[]

		// Extract packages from AGENTS.md Package Dependencies table
		const tableMatch = agentsContent.match(/\| Package \| Role \| Dependencies \|[\s\S]*?\n\n/)
		expect(tableMatch)
			.toBeTruthy()

		const documentedPackages = [...tableMatch![0].matchAll(/@pikacss\/[\w-]+/g)]
			.map(m => m[0])
			.filter((pkg, idx, arr) => arr.indexOf(pkg) === idx) // unique
			.sort()

		// Verify all packages are documented
		expect(documentedPackages)
			.toEqual(actualPackages)
		expect(documentedPackages.length)
			.toBe(actualPackages.length)
	})

	it('architecture diagram matches package locations', () => {
		// Extract packages from architecture diagram
		const diagramMatch = agentsContent.match(/```[\s\S]*?Framework Layer[\s\S]*?```/)
		expect(diagramMatch)
			.toBeTruthy()

		const diagramContent = diagramMatch![0]

		// Verify framework layer packages
		expect(diagramContent)
			.toContain('@pikacss/nuxt-pikacss')

		// Verify unplugin layer packages
		expect(diagramContent)
			.toContain('@pikacss/unplugin-pikacss')
		expect(diagramContent)
			.toContain('@pikacss/vite-plugin-pikacss')

		// Verify integration layer packages
		expect(diagramContent)
			.toContain('@pikacss/integration')

		// Verify core layer packages
		expect(diagramContent)
			.toContain('@pikacss/core')
		expect(diagramContent)
			.toContain('@pikacss/plugin-icons')
		expect(diagramContent)
			.toContain('@pikacss/plugin-reset')
		expect(diagramContent)
			.toContain('@pikacss/plugin-typography')
	})

	it('tech stack tools are actually used', () => {
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))

		// Verify documented tech stack exists in package.json
		expect(rootPackageJson.devDependencies)
			.toHaveProperty('tsdown')
		expect(rootPackageJson.devDependencies)
			.toHaveProperty('vitest')
		expect(rootPackageJson.devDependencies)
			.toHaveProperty('eslint')
		expect(rootPackageJson.devDependencies)
			.toHaveProperty('bumpp')
	})

	it('documented build commands exist in package.json', () => {
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))

		// Extract commands mentioned in AGENTS.md
		const commandsMatch = agentsContent.match(/pnpm (build|test|typecheck|lint|install|prepare)/g)
		expect(commandsMatch)
			.toBeTruthy()
		expect(commandsMatch!.length)
			.toBeGreaterThan(0)

		// Verify key commands exist
		expect(rootPackageJson.scripts)
			.toHaveProperty('build')
		expect(rootPackageJson.scripts)
			.toHaveProperty('test')
		expect(rootPackageJson.scripts)
			.toHaveProperty('typecheck')
		expect(rootPackageJson.scripts)
			.toHaveProperty('lint')
		expect(rootPackageJson.scripts)
			.toHaveProperty('prepare')
	})

	it('documented scaffolding commands exist', () => {
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))

		// Verify scaffolding commands from AGENTS.md Scaffolding section
		expect(rootPackageJson.scripts)
			.toHaveProperty('newpkg')
		expect(rootPackageJson.scripts)
			.toHaveProperty('newplugin')
	})

	it('documented documentation commands exist', () => {
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))

		// Verify documentation commands from AGENTS.md Documentation section
		expect(rootPackageJson.scripts)
			.toHaveProperty('docs:dev')
		expect(rootPackageJson.scripts)
			.toHaveProperty('docs:build')
	})

	it('documented release commands exist', () => {
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))

		// Verify release commands from AGENTS.md Release section
		expect(rootPackageJson.scripts)
			.toHaveProperty('publint')
		expect(rootPackageJson.scripts)
			.toHaveProperty('release')
	})

	it('package count matches between sections', () => {
		// Extract package count from Package Dependencies table
		const tableMatch = agentsContent.match(/\| Package \| Role \| Dependencies \|[\s\S]*?\n\n/)
		const tablePackages = [...tableMatch![0].matchAll(/@pikacss\/[\w-]+/g)]
			.map(m => m[0])
			.filter((pkg, idx, arr) => arr.indexOf(pkg) === idx)

		// Extract package count from architecture diagram
		const diagramMatch = agentsContent.match(/```[\s\S]*?Framework Layer[\s\S]*?```/)
		const diagramPackages = [...diagramMatch![0].matchAll(/@pikacss\/[\w-]+/g)]
			.map(m => m[0])
			.filter((pkg, idx, arr) => arr.indexOf(pkg) === idx)

		// Both sections should document all packages
		const packagesDir = join(monorepoRoot, 'packages')
		const actualCount = readdirSync(packagesDir)
			.filter(name => !name.startsWith('.') && name !== 'node_modules')
			.length

		expect(tablePackages.length)
			.toBe(actualCount)
		expect(diagramPackages.length)
			.toBe(actualCount)
	})

	it('monorepo tool is correctly documented', () => {
		// AGENTS.md states "pnpm workspace" as monorepo tool
		expect(agentsContent)
			.toContain('pnpm workspace')

		// Verify pnpm-workspace.yaml exists
		const workspaceFile = join(monorepoRoot, 'pnpm-workspace.yaml')
		expect(() => readFileSync(workspaceFile, 'utf-8')).not.toThrow()
	})

	it('version management tool is correctly documented', () => {
		// AGENTS.md states "bumpp" as version management tool
		expect(agentsContent)
			.toContain('bumpp')

		// Verify bumpp is in devDependencies (check monorepo root, not api-verifier package)
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))
		expect(rootPackageJson.devDependencies)
			.toHaveProperty('bumpp')
	})
})

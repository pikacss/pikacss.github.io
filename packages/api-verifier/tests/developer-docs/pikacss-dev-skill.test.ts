/* eslint-disable ts/ban-ts-comment */
// @ts-nocheck - Test file with extensive regex matching where TypeScript cannot infer non-null
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('pikacss-dev SKILL.md Validation', () => {
	const monorepoRoot = resolve(__dirname, '../../../..')
	const skillPath = join(monorepoRoot, '.github/skills/pikacss-dev/SKILL.md')
	const skillContent = readFileSync(skillPath, 'utf-8')

	it('documents all essential commands that exist in root package.json', () => {
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))

		// Extract documented commands from "Essential Commands" section
		const essentialCommandsMatch = skillContent.match(/### Essential Commands[\s\S]*?```bash([\s\S]*?)```/)
		expect(essentialCommandsMatch, 'Essential Commands section not found')
			.toBeTruthy()

		const documentedCommands = essentialCommandsMatch![1]
			.split('\n')
			.filter(line => line.trim()
				.startsWith('pnpm '))
			.map((line) => {
				const match = line.match(/pnpm\s+(\S+)/)
				return match ? match[1] : null
			})
			.filter(Boolean) as string[]

		// Verify each documented command exists in scripts (except 'install' which is built-in)
		for (const cmd of documentedCommands) {
			if (cmd === 'install')
				continue // Built-in pnpm command, not in scripts
			expect(rootPackageJson.scripts, `Command "pnpm ${cmd}" is documented but not in package.json`)
				.toHaveProperty(cmd)
		}

		// Verify core commands are documented
		const coreCommands = ['install', 'build', 'test', 'typecheck', 'lint']
		for (const cmd of coreCommands) {
			expect(documentedCommands, `Core command "${cmd}" missing from Essential Commands`)
				.toContain(cmd)
		}
	})

	it('documents all testing commands that exist', () => {
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))

		// Extract testing commands from "Testing Strategy" section
		const testingMatch = skillContent.match(/### Testing Strategy[\s\S]*?```bash([\s\S]*?)```/)
		expect(testingMatch, 'Testing Strategy section not found')
			.toBeTruthy()

		// Extract pnpm commands (not --filter variants)
		const testCommands = testingMatch![1]
			.split('\n')
			.filter(line => line.trim()
				.startsWith('pnpm test') && !line.includes('--filter'))
			.map((line) => {
				const match = line.match(/pnpm\s+(test(?::\S+)?)/)
				return match ? match[1] : null
			})
			.filter(Boolean) as string[]

		// Verify test command exists
		for (const cmd of testCommands) {
			expect(rootPackageJson.scripts, `Command "pnpm ${cmd}" is documented but not in package.json`)
				.toHaveProperty(cmd)
		}
	})

	it('documents all release commands that exist', () => {
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))

		// Extract release commands from "Pre-Release Checklist" and "Release Steps"
		const releaseMatch = skillContent.match(/### Pre-Release Checklist[\s\S]*?### Release Steps[\s\S]*?```/)
		expect(releaseMatch, 'Release sections not found')
			.toBeTruthy()

		// Extract all pnpm commands in release sections (match word boundaries to avoid capturing markdown syntax)
		const releaseCommands = Array.from(releaseMatch![0].matchAll(/`pnpm\s+([\w:]+)/g))
			.map(match => match[1])
			.filter(cmd => !cmd.includes('--filter')) // Ignore --filter examples

		// Verify each release command exists
		for (const cmd of releaseCommands) {
			expect(rootPackageJson.scripts, `Release command "pnpm ${cmd}" is documented but not in package.json`)
				.toHaveProperty(cmd)
		}

		// Verify key release commands are documented
		expect(releaseCommands)
			.toContain('release')
		expect(releaseCommands)
			.toContain('publint')
	})

	it('references correct monorepo tool (pnpm workspaces)', () => {
		// Verify pnpm workspaces is mentioned
		expect(skillContent)
			.toContain('pnpm workspace')

		// Verify pnpm-workspace.yaml exists
		const workspaceFile = join(monorepoRoot, 'pnpm-workspace.yaml')
		expect(existsSync(workspaceFile), 'pnpm-workspace.yaml file does not exist')
			.toBe(true)
	})

	it('documents correct package layer architecture', () => {
		// Extract architecture section
		const archMatch = skillContent.match(/### Monorepo Structure[\s\S]*?```([\s\S]*?)```/)
		expect(archMatch, 'Monorepo Structure section not found')
			.toBeTruthy()

		const archContent = archMatch![1]

		// Verify all packages are mentioned (either explicitly or via wildcards like plugin-{icons,reset,typography})
		const expectedPackages = [
			'@pikacss/core',
			'@pikacss/integration',
			'@pikacss/unplugin-pikacss',
			'@pikacss/vite-plugin-pikacss',
			'@pikacss/nuxt-pikacss',
		]

		// Check explicit package names
		for (const pkg of expectedPackages) {
			expect(archContent, `Package ${pkg} not found in architecture diagram`)
				.toContain(pkg)
		}

		// Check plugin wildcard pattern
		expect(archContent, 'Plugin wildcard pattern not found')
			.toMatch(/@pikacss\/plugin-\{[\w,]+\}/)
	})

	it('references existing documentation files', () => {
		// Extract all markdown references
		const mdReferences = Array.from(skillContent.matchAll(/\[.*?\]\((.*?\.md)\)/g))
			.map(match => match[1])

		for (const ref of mdReferences) {
			// Resolve path relative to skill file
			const refPath = join(monorepoRoot, '.github/skills/pikacss-dev', ref)

			expect(existsSync(refPath), `Referenced file ${ref} does not exist at ${refPath}`)
				.toBe(true)
		}
	})

	it('documents correct test framework (Vitest)', () => {
		// Verify Vitest is mentioned
		expect(skillContent)
			.toContain('Vitest')

		// Verify vitest exists in devDependencies
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))
		expect(rootPackageJson.devDependencies)
			.toHaveProperty('vitest')
	})

	it('documents correct version management tool (bumpp)', () => {
		// Verify bumpp is mentioned in release process
		const releaseMatch = skillContent.match(/### Release Steps[\s\S]*?```/)
		expect(releaseMatch, 'Release Steps section not found')
			.toBeTruthy()
		expect(releaseMatch![0])
			.toContain('bumpp')

		// Verify bumpp exists in devDependencies
		const rootPackageJson = JSON.parse(readFileSync(join(monorepoRoot, 'package.json'), 'utf-8'))
		expect(rootPackageJson.devDependencies)
			.toHaveProperty('bumpp')
	})

	it('all documented pnpm filter patterns use correct syntax', () => {
		// Extract all --filter examples
		const filterPatterns = Array.from(skillContent.matchAll(/pnpm\s+--filter\s+(@pikacss\/\S+)/g))
			.map(match => match[1])

		// Verify each uses correct package name format
		for (const pattern of filterPatterns) {
			expect(pattern.startsWith('@pikacss/'), `Filter pattern ${pattern} does not start with @pikacss/`)
				.toBe(true)

			// If it's a specific package (not wildcard), verify it exists
			if (!pattern.includes('*') && !pattern.includes('{') && pattern !== '@pikacss/<pkg>') {
				const pkgName = pattern.replace('@pikacss/', '')
				const pkgPath = join(monorepoRoot, 'packages', pkgName)
				expect(existsSync(pkgPath), `Documented package ${pattern} does not exist at ${pkgPath}`)
					.toBe(true)
			}
		}
	})

	it('documents correct build tool (tsdown)', () => {
		// Verify tsdown is mentioned or referenced
		const agentsPath = join(monorepoRoot, 'AGENTS.md')
		const agentsContent = readFileSync(agentsPath, 'utf-8')

		// tsdown should be in AGENTS.md tech stack
		expect(agentsContent)
			.toContain('tsdown')

		// Verify at least one package uses tsdown in build config
		const corePackagePath = join(monorepoRoot, 'packages/core')
		expect(existsSync(corePackagePath))
			.toBe(true)

		// Check for tsdown.config.ts or package.json build script
		const hasTsdownConfig = existsSync(join(corePackagePath, 'tsdown.config.ts'))
		const packageJson = JSON.parse(readFileSync(join(corePackagePath, 'package.json'), 'utf-8'))
		const usesTsdown = packageJson.scripts?.build?.includes('tsdown')

		expect(hasTsdownConfig || usesTsdown, 'Core package should use tsdown for building')
			.toBe(true)
	})
})

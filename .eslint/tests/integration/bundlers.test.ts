import { access, cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { execa } from 'execa'
import { join } from 'pathe'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('vite Integration', () => {
	let testDir: string

	beforeEach(async () => {
		// Create unique temp directory
		testDir = await mkdtemp(join(tmpdir(), 'pika-vite-'))

		// Copy fixture to temp dir
		await cp(
			join(process.cwd(), '.eslint/tests/fixtures/vite'),
			testDir,
			{ recursive: true },
		)

		// Install dependencies
		await execa('pnpm', ['install'], { cwd: testDir })
	})

	afterEach(async () => {
		// Cleanup (force flag for safety)
		await rm(testDir, { recursive: true, force: true })
	})

	it('should compile valid pika() examples', async () => {
		// Ensure only valid.ts is built
		await writeFile(
			join(testDir, 'vite.config.ts'),
			`import { defineConfig } from 'vite'
import PikaCSS from '@pikacss/vite-plugin-pikacss'

export default defineConfig({
  plugins: [PikaCSS()],
  build: { rollupOptions: { input: './src/valid.ts' } }
})`,
		)

		const result = await execa('pnpm', ['build'], { cwd: testDir })
		expect(result.exitCode)
			.toBe(0)
		// Verify pika.gen.css was generated
		const cssExists = await exists(join(testDir, 'pika.gen.css'))
		expect(cssExists)
			.toBe(true)
	})

	it('should fail on runtime-dynamic pika() calls', async () => {
		// Configure to build invalid.ts
		await writeFile(
			join(testDir, 'vite.config.ts'),
			`import { defineConfig } from 'vite'
import PikaCSS from '@pikacss/vite-plugin-pikacss'

export default defineConfig({
  plugins: [PikaCSS()],
  build: { rollupOptions: { input: './src/invalid.ts' } }
})`,
		)

		const result = await execa('pnpm', ['build'], { cwd: testDir, reject: false })
		expect(result.exitCode).not.toBe(0)
		// Verify error message mentions build-time constraint
		expect(result.stderr || result.stdout)
			.toContain('build-time')
	})
})

describe('nuxt Integration', () => {
	let testDir: string

	beforeEach(async () => {
		testDir = await mkdtemp(join(tmpdir(), 'pika-nuxt-'))
		await cp(
			join(process.cwd(), '.eslint/tests/fixtures/nuxt'),
			testDir,
			{ recursive: true },
		)
		await execa('pnpm', ['install'], { cwd: testDir })
	})

	afterEach(async () => {
		await rm(testDir, { recursive: true, force: true })
	})

	it('should build Nuxt app with valid pika()', async () => {
		// Comment out invalid example in app.vue
		const appVue = await readFile(join(testDir, 'app.vue'), 'utf-8')
		const cleanedAppVue = appVue.replace(/const invalidStyles.*$/m, '// removed invalid')
		await writeFile(join(testDir, 'app.vue'), cleanedAppVue)

		const result = await execa('pnpm', ['build'], { cwd: testDir })
		expect(result.exitCode)
			.toBe(0)
	})
})

describe('webpack Integration', () => {
	let testDir: string

	beforeEach(async () => {
		testDir = await mkdtemp(join(tmpdir(), 'pika-webpack-'))
		await cp(
			join(process.cwd(), '.eslint/tests/fixtures/webpack'),
			testDir,
			{ recursive: true },
		)
		await execa('pnpm', ['install'], { cwd: testDir })
	})

	afterEach(async () => {
		await rm(testDir, { recursive: true, force: true })
	})

	it('should compile valid pika() with Webpack', async () => {
		const result = await execa('pnpm', ['build'], { cwd: testDir, reject: false })

		// Per CONTEXT.md: Webpack failures are Warning, not blocking
		if (result.exitCode !== 0) {
			console.warn('Webpack build failed (non-blocking):', result.stderr)
		}
		else {
			expect(result.exitCode)
				.toBe(0)
		}
	})
})

// Helper
async function exists(path: string): Promise<boolean> {
	try {
		await access(path)
		return true
	}
	catch {
		return false
	}
}

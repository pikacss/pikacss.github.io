import process from 'node:process'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		// TypeScript Compiler API operations are CPU-intensive
		// CI environments run 3-5x slower than local machines
		testTimeout: process.env.CI === 'true' ? 120000 : 30000, // 2 min CI, 30s local
	},
})

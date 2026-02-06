import { describe, expect, it } from 'vitest'
import { createEngine, defineEngineConfig } from '../src'

describe('rEADME Examples', () => {
	it('quick Start', async () => {
		const config = defineEngineConfig({
			// Engine configuration
			prefix: 'pk-',
			defaultSelector: '.%',
			plugins: [],
		})

		// createEngine is async and returns a fully initialized engine
		const engine = await createEngine(config)
		expect(engine)
			.toBeDefined()
	})

	it('engine Methods', async () => {
		const config = defineEngineConfig({
			prefix: 'pk-',
			defaultSelector: '.%',
			plugins: [],
			preflights: [],
		})
		const engine = await createEngine(config)

		// Add global CSS preflight
		engine.addPreflight('* { box-sizing: border-box; }')

		// Process style items and get atomic class IDs
		const classNames = await engine.use({ color: 'red' }, { display: 'flex' })
		expect(Array.isArray(classNames))
			.toBe(true)
		expect(classNames.length)
			.toBe(2)

		// Render generated preflights
		const preflightCSS = await engine.renderPreflights(true)
		expect(preflightCSS)
			.toContain('box-sizing: border-box')

		// Render generated atomic styles
		const atomicCSS = await engine.renderAtomicStyles(true)
		expect(atomicCSS)
			.toContain('color: red')
		expect(atomicCSS)
			.toContain('display: flex')

		// Access sub-systems
		expect(engine.variables)
			.toBeDefined()
		expect(engine.keyframes)
			.toBeDefined()
		expect(engine.selectors)
			.toBeDefined()
		expect(engine.shortcuts)
			.toBeDefined()
		expect(engine.config)
			.toBeDefined()
	})
})

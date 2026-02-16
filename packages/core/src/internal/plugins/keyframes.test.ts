import { describe, expect, it } from 'vitest'
import { createEngine } from '../engine'

describe('keyframes plugin', () => {
	describe('string config', () => {
		it('should register a keyframe name without frames', async () => {
			const engine = await createEngine({
				keyframes: {
					keyframes: ['fadeIn'],
				},
			})
			// The keyframe is registered but has no frames, so preflight should be empty
			const preflight = await engine.renderPreflights(true)
			expect(preflight).not.toContain('@keyframes fadeIn')
		})
	})

	describe('array config', () => {
		it('should register keyframe with name and frames', async () => {
			const engine = await createEngine({
				keyframes: {
					keyframes: [
						['fade', { from: { opacity: '0' }, to: { opacity: '1' } }],
					],
				},
			})
			// Use the animation to make it "used"
			await engine.use({ animation: 'fade 1s' })

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('@keyframes fade')
			expect(preflight)
				.toContain('opacity: 0;')
			expect(preflight)
				.toContain('opacity: 1;')
		})

		it('should register keyframe with autocomplete suggestions', async () => {
			const engine = await createEngine({
				keyframes: {
					keyframes: [
						['slide', { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } }, ['slide 0.3s ease']],
					],
				},
			})
			await engine.use({ animation: 'slide 0.3s ease' })

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('@keyframes slide')
		})

		it('should support pruneUnused override per keyframe in array config', async () => {
			const engine = await createEngine({
				keyframes: {
					keyframes: [
						['always-present', { from: { opacity: '0' }, to: { opacity: '1' } }, [], false],
					],
					pruneUnused: true,
				},
			})
			// Not using 'always-present' animation anywhere, but pruneUnused is false for this keyframe
			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('@keyframes always-present')
		})
	})

	describe('object config', () => {
		it('should register keyframe from object format', async () => {
			const engine = await createEngine({
				keyframes: {
					keyframes: [
						{
							name: 'spin',
							frames: {
								from: { transform: 'rotate(0deg)' },
								to: { transform: 'rotate(360deg)' },
							},
						},
					],
				},
			})
			await engine.use({ animation: 'spin 1s linear infinite' })

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('@keyframes spin')
			expect(preflight)
				.toContain('rotate(0deg)')
			expect(preflight)
				.toContain('rotate(360deg)')
		})

		it('should support pruneUnused override per keyframe in object config', async () => {
			const engine = await createEngine({
				keyframes: {
					keyframes: [
						{
							name: 'stay',
							frames: { from: { opacity: '1' }, to: { opacity: '1' } },
							pruneUnused: false,
						},
					],
					pruneUnused: true,
				},
			})
			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('@keyframes stay')
		})
	})

	describe('pruneUnused', () => {
		it('should prune unused keyframes when pruneUnused is true (default)', async () => {
			const engine = await createEngine({
				keyframes: {
					keyframes: [
						['unused', { from: { opacity: '0' }, to: { opacity: '1' } }],
					],
				},
			})
			// Not using the 'unused' animation
			const preflight = await engine.renderPreflights(true)
			expect(preflight).not.toContain('@keyframes unused')
		})

		it('should keep all keyframes when pruneUnused is false', async () => {
			const engine = await createEngine({
				keyframes: {
					keyframes: [
						['kept', { from: { opacity: '0' }, to: { opacity: '1' } }],
					],
					pruneUnused: false,
				},
			})
			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('@keyframes kept')
		})
	})

	describe('preflight rendering', () => {
		it('should render keyframes with percentage-based frames', async () => {
			const engine = await createEngine({
				keyframes: {
					keyframes: [
						{
							name: 'bounce',
							frames: {
								'0%': { transform: 'translateY(0)' },
								'50%': { transform: 'translateY(-20px)' },
								'100%': { transform: 'translateY(0)' },
							},
							pruneUnused: false,
						},
					],
				},
			})

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('@keyframes bounce')
			expect(preflight)
				.toContain('0%')
			expect(preflight)
				.toContain('50%')
			expect(preflight)
				.toContain('100%')
			expect(preflight)
				.toContain('translateY(-20px)')
		})

		it('should detect usage from animation shorthand property', async () => {
			const engine = await createEngine({
				keyframes: {
					keyframes: [
						['fadeIn', { from: { opacity: '0' }, to: { opacity: '1' } }],
					],
				},
			})
			await engine.use({ animation: 'fadeIn 0.3s ease-in' })

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('@keyframes fadeIn')
		})
	})

	describe('dynamic add via engine.keyframes.add', () => {
		it('should allow adding keyframes dynamically after engine creation', async () => {
			const engine = await createEngine({
				keyframes: { keyframes: [] },
			})
			engine.keyframes.add(['dynamic', { from: { opacity: '0' }, to: { opacity: '1' } }])
			await engine.use({ animation: 'dynamic 0.5s' })

			const preflight = await engine.renderPreflights(true)
			expect(preflight)
				.toContain('@keyframes dynamic')
		})
	})
})

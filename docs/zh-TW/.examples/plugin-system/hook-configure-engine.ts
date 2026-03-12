import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',

	// 非同步 — engine 建立後呼叫
	configureEngine: async (engine) => {
		// 新增 CSS 變數
		engine.variables.add({
			'--brand-color': '#0ea5e9',
		})

		// 新增 shortcuts
		engine.shortcuts.add([
			'flex-center',
			{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			},
		])

		// 新增自訂 selectors
		engine.selectors.add(['hover', '$:hover'])

		// 新增 keyframes 動畫
		engine.keyframes.add([
			'fade-in',
			{ from: { opacity: '0' }, to: { opacity: '1' } },
			['fade-in 0.3s ease'],
		])

		// 新增 preflight CSS
		engine.addPreflight('*, *::before, *::after { box-sizing: border-box; }')
	},
})

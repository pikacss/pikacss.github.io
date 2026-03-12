import { defineEnginePlugin } from '@pikacss/core'

// ❌ 錯誤——將 component 層級的 styles 放入 preflight
// Preflights 在所有 component styles 之前執行，並全域套用到每一頁。
// 在這裡放入 component 專屬或頁面專屬的規則，會導致應用程式其他地方
// 出現意料之外的視覺回歸。
export const wrongPlugin = defineEnginePlugin({
	name: 'wrong-preflight-example',
	configureEngine: async (engine) => {
		engine.addPreflight({
			// ❌ 這會全域套用——不受任何 component 或頁面的範圍限制
			'.button': {
				backgroundColor: 'blue',
				color: 'white',
				borderRadius: '4px',
			},
		})
	},
})

// ✅ 正確——全域 resets 和 base rules 才適合放在 preflights
export const correctPlugin = defineEnginePlugin({
	name: 'correct-preflight-example',
	configureEngine: async (engine) => {
		engine.addPreflight({
			// ✅ 沒有 component 範圍的通用 base rules
			'*, *::before, *::after': {
				boxSizing: 'border-box',
			},
			'body': {
				margin: '0',
				fontFamily: 'system-ui, sans-serif',
			},
		})
	},
})

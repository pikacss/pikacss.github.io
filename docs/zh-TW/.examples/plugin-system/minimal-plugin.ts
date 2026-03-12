import { defineEnginePlugin } from '@pikacss/core'

export function myPlugin() {
	return defineEnginePlugin({
		name: 'my-plugin',
	})
}

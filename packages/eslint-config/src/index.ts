import type { Linter } from 'eslint'
import recommended from './configs/recommended'
import { plugin } from './plugin'

export const configs: { recommended: Linter.Config[] } = {
	recommended,
}

const pluginWithConfigs = {
	...plugin,
	configs,
}

export default pluginWithConfigs

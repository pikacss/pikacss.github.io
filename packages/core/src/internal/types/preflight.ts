import type { Engine } from '../engine'
import type { ResolvedCSSProperties, ResolvedSelector } from './resolved'
import type { Awaitable, UnionString } from './utils'

// #region Preflight
export type PreflightDefinition = {
	[selector in UnionString | ResolvedSelector]?: ResolvedCSSProperties | PreflightDefinition
}

export type PreflightFn = (engine: Engine, isFormatted: boolean) => Awaitable<string | PreflightDefinition>

export interface WithLayer<T extends string | PreflightDefinition | PreflightFn> {
	layer: string
	preflight: T
}

export interface ResolvedPreflight {
	layer?: string
	fn: PreflightFn
}

/**
 * Preflight can be a string, object, function, or a layer-wrapped variant.
 *
 * 1. A `string` is a static preflight style injected verbatim.
 * 2. A `PreflightDefinition` is a JS object describing CSS rules.
 * 3. A `PreflightFn` is a dynamic preflight that receives the engine instance.
 * 4. A `WithLayer` wrapper assigns any of the above to a specific CSS `@layer`.
 */
export type Preflight = string | PreflightDefinition | PreflightFn | WithLayer<string | PreflightDefinition | PreflightFn>
// #endregion Preflight

// Conceptual loading order inside createEngine():
//
// 1. Core plugins are created first:
//    - core:important
//    - core:variables
//    - core:keyframes
//    - core:selectors
//    - core:shortcuts
//
// 2. User plugins from config.plugins are appended.
//
// 3. ALL plugins are sorted together by `order`:
//    - order: 'pre'  → 0  (runs first)
//    - order: undefined → 1  (default — core plugins use this)
//    - order: 'post' → 2  (runs last)
//
// 4. Hooks execute in the sorted order:
//    configureRawConfig → rawConfigConfigured
//    → resolveConfig
//    → configureResolvedConfig → configureEngine

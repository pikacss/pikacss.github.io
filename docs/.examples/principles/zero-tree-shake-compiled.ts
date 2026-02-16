// After compilation and tree-shaking by the bundler:
// - pika() calls become string literals (build-time transform)
// - Unused string variables are eliminated (bundler tree-shaking)

const buttonStyles = 'a b'

// `unusedStyles` was a plain string 'c d' — the bundler
// detects it has no side effects and removes it entirely.

document.querySelector('#btn')!.className = buttonStyles

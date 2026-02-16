// Output format: 'inline'
// pika.inl() produces an unquoted string, useful inside template literals

// Source:
const html = `<div class="${pika.inl({ color: 'red', fontSize: '16px' })}">`
// Compiled output:
const html = `<div class="a b">` // [!code highlight]

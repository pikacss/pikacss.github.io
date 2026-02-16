// After build-time compilation, pika() calls are replaced
// with plain string literals — no function call remains.

const buttonClass = 'a b c d e'

document.querySelector('#btn')!.className = buttonClass

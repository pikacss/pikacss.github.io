// ❌ Invalid: runtime-only values cannot be evaluated at build time

// Variable reference — not statically analyzable
const myColor = getUserTheme()
pika({ color: myColor }) // Error!

// Dynamic expression — depends on runtime state
pika({ fontSize: `${window.innerWidth > 768 ? '16px' : '14px'}` }) // Error!

// Function call in value — cannot be evaluated statically
pika({ color: getColor() }) // Error!

// Spread from runtime object — not statically analyzable
const styles = getStyles()
pika({ ...styles }) // Error!

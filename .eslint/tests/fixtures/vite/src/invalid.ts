// pika is a global function injected by @pikacss/vite-plugin-pikacss

// Runtime variable (function parameter)
export function Component(props: { color: string }) {
	return pika({ color: props.color }) // SHOULD FAIL
}

// Let variable
const dynamicColor = 'green'
export const styles = pika({ color: dynamicColor }) // SHOULD FAIL

import { pika } from '@pikacss/core'

// Runtime variable (function parameter)
export function Component(props: { color: string }) {
	return pika({ color: props.color }) // SHOULD FAIL
}

// Let variable
const dynamicColor = 'green'
export const styles = pika({ color: dynamicColor }) // SHOULD FAIL

import { pika } from '@pikacss/core'

// Valid
export const validStyles = pika({ color: 'blue' })

// Invalid (uncomment to test failure)
// export function dynamic(c: string) {
//   return pika({ color: c })
// }

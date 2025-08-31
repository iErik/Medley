import { createClient } from '@packages/api'

export const { bonfire, delta } = createClient({
  cache: true,
  autoConnect: true
})

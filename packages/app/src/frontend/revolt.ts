import { createClient } from '@ierik/revolt'

export const { bonfire, delta } = createClient({
  cache: true,
  autoConnect: true
})

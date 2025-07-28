import type { RevoltMessage } from '../../Chat'

export type MessageEvent = RevoltMessage & {
  type: 'Message'
}

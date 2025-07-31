import type { RevoltMessage } from '@/types/Chat'

export type MessageEvent = RevoltMessage & {
  type: 'Message'
}

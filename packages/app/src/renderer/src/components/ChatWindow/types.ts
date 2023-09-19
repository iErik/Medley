import type { Message } from '@store/chat'

export type ClumpedMessageContent = {
  id: string
  text: string
  key: string
  createdAt: Date
}

export type ClumpedMessage = Omit<
  Message,
  'content'
> & {
  content: ClumpedMessageContent[]
}


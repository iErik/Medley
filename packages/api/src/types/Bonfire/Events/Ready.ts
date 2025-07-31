import type { RevoltServer } from '@/types/Chat'
import type { RevoltChannel } from '@/types/Chat'
import type { RevoltEmoji } from '@/types/Emoji'
import type { RevoltUser, RevoltMember } from '@/types/User'

export type ReadyEvent = {
  type: 'Ready'
  members: RevoltMember[]
  users: RevoltUser[]
  servers: RevoltServer[]
  channels: RevoltChannel[]
  emojis?: RevoltEmoji[]
}

import type { RevoltServer } from '../../Chat'
import type { RevoltChannel } from '../../Chat'
import type { RevoltEmoji } from '../../Emoji'
import type { RevoltUser, RevoltMember } from '../../User'

export type ReadyEvent = {
  type: 'Ready'
  members: RevoltMember[]
  users: RevoltUser[]
  servers: RevoltServer[]
  channels: RevoltChannel[]
  emojis?: RevoltEmoji[]
}

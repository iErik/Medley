import {
  type Common,
  Chat,
} from '@ierik/revolt'

// TODO: Move this to a 'common' types module
export type Asset = Common.Asset & {
  src: string | null
}

export type Message = Chat.RevoltMessage & {
  createdAt: number
  serverId?: string
}

export type DirectChannel = Chat.DirectMessage & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

export type GroupChannel = Chat.GroupChannel & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

export type SavedMessages = Chat.SavedMessage & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

export type TextChannel = Chat.TextChannel & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

// TODO: VoiceChannel doesn't need these properties, but
// we're including it here for consistency and so that
// TypeScript leaves alone, but we need to revise it
export type VoiceChannel = Chat.VoiceChannel & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

export type Channel
  = DirectChannel
  | GroupChannel
  | SavedMessages
  | TextChannel
  | VoiceChannel


export type ServerChannel
  = TextChannel
  | Chat.VoiceChannel

export type Server = Chat.RevoltServer & {
  icon: Asset
  banner: Asset
}

export type ActiveChannel = {
  id: string
  serverId: string
  loading: boolean
  messageCount: number
  // TODO: remove any
  typing: any[]
}


// Re-exports
const ChannelType = Chat.ChannelType
export { ChannelType }

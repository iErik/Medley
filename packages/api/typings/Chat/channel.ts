import type { Asset } from '../Common'

export enum ChannelType {
  Voice = 'VoiceChannel',
  Text  = 'TextChannel',
  Group = 'Group',
  DirectMessage = 'DirectMessage',
  SavedMessages = 'SavedMessages'
}

export type RevoltChannel = {
  channel_type: ChannelType
  _id: string
  server: string
  name: string
  description: string
  icon: Asset
  default_permissions: Record<string, any>
  role_permissions: Record<string, any>
  nsfw: boolean
}


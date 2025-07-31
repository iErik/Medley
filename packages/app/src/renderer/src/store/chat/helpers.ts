import {
  type Channel,
  type DirectChannel,
  ChannelType
} from './types'

export const isDirect = (c: Channel): c is DirectChannel =>
  c.channel_type === ChannelType.DirectMessage

export const isGroup = ({ channel_type }: Channel) =>
  channel_type === ChannelType.Group

export const isSavedMsgs = ({ channel_type }: Channel) =>
  channel_type === ChannelType.SavedMessages


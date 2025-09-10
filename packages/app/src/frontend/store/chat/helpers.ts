import type {
  DirectChannel,
  Channel,
  GroupChannel,
} from './'

import { ChannelType } from './'


export const isDirect = (c: Channel): c is DirectChannel =>
  c.channel_type === ChannelType.DirectMessage

export const isGroup = (c: Channel): c is GroupChannel =>
  c.channel_type === ChannelType.Group

export const isSavedMsgs = ({ channel_type }: Channel) =>
  channel_type === ChannelType.SavedMessages


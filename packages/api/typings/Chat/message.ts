import type { Asset } from '../Common'

// -> System message types
// -----------------------

// Is this really necessary? How does this work

export enum SystemMessageType {
  Text                      = 'text',
  UserAdded                 = 'user_added',
  UserRemove                = 'user_remove',
  UserJoined                = 'user_joined',
  UserLeft                  = 'user_left',
  UserKicked                = 'user_kicked',
  UserBanned                = 'user_banned',
  ChannelRenamed            = 'channel_renamed',
  ChannelDescriptionChanged = 'channel_description_changed',
  ChannelIconChanged        = 'channel_icon_changed',
  ChannelOwnershipChanged   = 'channel_ownership_changed'
}

export type SystemTextMsg = {
  type: SystemMessageType.Text
  content: string
}

export type SystemUserAddedMsg = {
  type: SystemMessageType.UserAdded
  id: string
  by: string
}

export type SystemUserRemoveMsg = {
  type: SystemMessageType.UserRemove
  id: string
  by: string
}

export type SystemUserJoinedMsg = {
  type: SystemMessageType.UserJoined
  by: string
}

export type SystemUserLeftMsg = {
  type: SystemMessageType.UserLeft
  id: string
}

export type SystemUserKickedMsg = {
  type: SystemMessageType.UserKicked
  id: string
}

export type SystemUserBannedMsg = {
  type: SystemMessageType.UserBanned
  id: string
}

export type SystemChannelRenamedMsg = {
  type: SystemMessageType.ChannelRenamed
  name: string
  by: string
}

export type SystemChannelDescriptionChangedMsg = {
  type: SystemMessageType.ChannelDescriptionChanged
  by: string
}

export type SystemChannelIconChangedMsg = {
  type: SystemMessageType.ChannelIconChanged
  by: string
}

export type SystemChannelOwnershipChangedMsg = {
  type: SystemMessageType.ChannelOwnershipChanged
  from: string
  to: string
}

export type SystemEventMsg =
  SystemTextMsg
  | SystemUserAddedMsg
  | SystemUserRemoveMsg
  | SystemUserJoinedMsg
  | SystemUserLeftMsg
  | SystemUserKickedMsg
  | SystemUserBannedMsg
  | SystemChannelRenamedMsg
  | SystemChannelDescriptionChangedMsg
  | SystemChannelIconChangedMsg
  | SystemChannelOwnershipChangedMsg

// -> Embeds
// ---------

export enum EmbedType {
  Website = 'Website',
  Image   = 'Image',
  Video   = 'Video',
  Text    = 'Text',
  None    = 'None'
}

export enum WebsiteEmbedRemote {
  None       = 'None',
  GIF        = 'GIF',
  YouTube    = 'YouTube',
  Lightspeed = 'Lightspeed',
  Twitch     = 'Twitch',
  Spotify    = 'Spotify',
  Soundcloud = 'Soundcloud',
  Bandcamp   = 'Bandcamp',
  Streamable = 'Streamable'
}

export type WebsiteEmbedSpecialNone = {
  type: WebsiteEmbedRemote.None
}

export type WebsiteEmbedSpecialGIF = {
  type: WebsiteEmbedRemote.GIF
}

export type WebsiteEmbedSpecialYouTube = {
  type: WebsiteEmbedRemote.YouTube
  id: string
  timestamp: string | null
}

export type WebsiteEmbedSpecialLightspeed = {
  type: WebsiteEmbedRemote.Lightspeed
  content_type: 'Channel'
  id: string
}

export type WebsiteEmbedSpecialTwitch = {
  type: WebsiteEmbedRemote.Twitch
  content_type: 'Channel' | 'Video' | 'Clip'
  id: string
}

export type WebsiteEmbedSpecialSpotify = {
  type: WebsiteEmbedRemote.Spotify
  content_type: string
  id: string
}

export type WebsiteEmbedSpecialSoundcloud = {
  type: WebsiteEmbedRemote.Soundcloud
}

export type WebsiteEmbedSpecialBandcamp = {
  type: WebsiteEmbedRemote.Bandcamp
  content_type: 'Album' | 'Track'
  id: string
}

export type WebsiteEmbedSpecialStreamable = {
  type: WebsiteEmbedRemote.Streamable
  id: string
}

export type WebsiteEmbedSpecial =
  WebsiteEmbedSpecialNone
  | WebsiteEmbedSpecialGIF
  | WebsiteEmbedSpecialYouTube
  | WebsiteEmbedSpecialLightspeed
  | WebsiteEmbedSpecialTwitch
  | WebsiteEmbedSpecialSpotify
  | WebsiteEmbedSpecialSoundcloud
  | WebsiteEmbedSpecialBandcamp
  | WebsiteEmbedSpecialStreamable


export type WebsiteEmbed = {
  type: EmbedType.Website
  url: string | null
  original_url: string | null
  special: WebsiteEmbedSpecial | null
  title: string | null
  description: string | null
  image: Omit<ImageEmbed, 'type'> | null
  video: Omit<VideoEmbed, 'type'> | null
  site_name: string | null
  icon_url: string | null
  colour: string
}

export type ImageEmbed = {
  type: EmbedType.Image
  url: string
  width: number
  height: number
  size: 'Large' | 'Preview'
}

export type VideoEmbed = {
  type: EmbedType.Video
  url: string
  width: number
  height: number
}

export type TextEmbed = {
  type: EmbedType.Text
  icon_url: string | null
  url: string | null
  title: string | null
  description: string | null
  media: Asset | null
  colour: string | null
}

export type NoneEmbed = {
  type: EmbedType.None
}

export type MessageEmbed =
  WebsiteEmbed
  | ImageEmbed
  | VideoEmbed
  | TextEmbed
  | NoneEmbed

// -> Misc
// -------

export type MessageWebhook = {
  name: string
  avatar?: string | null
}

// -> Main type
// ------------

export type RevoltMessage = {
  _id: string
  channel: string
  author: string
  nonce?: string | null
  webhook?: MessageWebhook
  content?: string | null
  system?: SystemEventMsg | null
  attachments?: Asset[] | null
  edited?: string | null
  embeds?: MessageEmbed[] | null
  mentions?: string[] | null
  replies?: string[] | null

  /**
   * Hashmap of emoji IDs to array of user IDs
   */
  reactions?: {
    [emojiId: string]: string[]
  }

  /**
   * Information to guide interactions on this message
   */
  interactions?: {
    /**
     * Reactions which should always appear and be distinct
     */
    reactions: string[] | null
    /**
     * Whether reactions should be restricted to the given list
     */
    restrict_reactions: boolean
  }

  /**
   * name and/or avatar override information
   */
  masquerade?: {
    name: string | null
    avatar: string | null
    colour: string | null
  }
}

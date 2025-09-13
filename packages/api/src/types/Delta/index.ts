import type { RevoltError } from '@/types/Error'

export type ServiceError =
  RevoltError | Error | Response | boolean | null

export type ServiceReturn<
  ReturnType = any,
  ErrorType = ServiceError
> = Promise<[
  ErrorType,
  ReturnType
]>


type RemoveArg
  = 'Description'
  | 'Icon'
  | 'DefaultPermissions'

export type EditChannelParams = {
  /**
   * Channel name ([ 1 .. 32 ] characters)
   */
  name: string | null

  /**
   * Channel description ([ 0 .. 1024 ] characters)
   */
  description: string | null

  /**
   * Group owner
   */
  owner: string | null

  /**
   * The icon. Provide an Autumn attachment ID
   * ([ 1 .. 128 ] characters)
   */
  icon: string | null

  /**
   * Whether this channel is age-restricted
   */
  nsfw: boolean | null

  /**
   * Whether this channel is archived
   */
  archived: boolean | null

  /**
   * Array of strings (FieldsChannel) [????]
   */
  remove: RemoveArg[] | null
}

export type GetMessagesQueryParams = {
  /**
   * Maximum number of messages to fetch [1..100]
   * For fetching nearby messages, this is (limit + 1)
   */
  limit?: number | null

  /**
   * Message ID before which messages should be fetched
   * = 26 characters
   */
  before?: string | null

  /**
   * Message ID after which messages should be fetched
   * = 26 characters
   */
  after?: string | null

  /**
   * Message sort direction
   */
  sort?: 'Relevance' | 'Latest' | 'Oldest'

  /**
   * Message ID to search around
   *
   * Specifying 'nearby' ignores 'before', 'after' and 'sort'.
   * It will also take half of limite rounded as the limits
   * to each side. It also fetches the message ID specified.
   */
  nearby?: string | null

  /**
   * Whether to include user (and member, if server channel)
   * objects
   */
  include_users?: boolean | null
}

type Embed = {
  colour?: string | null
  description?: string | null
  icon_url?: string | null
  media?: string | null
  title?: string | null
  url?: string | null
}

type Reply = {
  id: string
  mention: string
  fail_if_not_exists?: boolean | null
}

type Masquerade = {
  /*
  * Replace the avatar shown on this message (URL to image
  * file)
  */
  avatar?: string | null

  /*
  * Replace the display role colour shown on this message
  * Must have ManageRole permission to use
  */
  colour?: string | null

  /*
  * Replace the display name shown on this message
  */
  name?: string | null
}

type Interaction = {
  reactions?: string[] | null
  restrict_reactions: boolean
}

// POST channels/${channelId}/messages
export type SendMessageParams = {
  /*
  * Attachments to include in message
  */
  attachments?: string[] | null

  /*
  * Message content to send
  */
  content: string

  /*
  * Embeds to include in message
  * Text embed content contributes to the content length cap
  * Representation of a text embed before it is sent.
  */
  embeds?: Embed[] | null

  /*
  * Messages to reply to
  * What this message should reply to and how
  */
  replies?: Reply[] | null

  masquerade?: Masquerade | null

  /*
  * Information to guide interactions on this message
  */
  interactions?: Interaction | null

  /*
  * Bitfield of message flags
  * https://docs.rs/revolt-models/latest/revolt_models/v0/enum.MessageFlags.html
  */
  flags?: number | null

  /*
  * Unique token to prevent duplicate message sending
  * This is deprecated and replaced by Idempotency-Key
  * header!
  */
  nonce?: string | null
}


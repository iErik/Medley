import http from '@utils/http'
import { withQueryParams } from '@utils/queryParams'

import type {
  ClientContext,
  ContextSetter
} from '@typings/Client'

import { ServiceReturn } from '@typings/Delta'

import type {
  RevoltChannel,
  ChannelInvite,
  RevoltMessage
} from '@typings/Chat'

// -> Types
// --------

type RemoveArg = 'Description' | 'Icon' | 'DefaultPermissions'

type EditChannelParams = {
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

type GetMessagesQueryParams = {
  /**
   * Maximum number of messages to fetch [1..100]
   * For fetching nearby messages, this is (limit + 1)
   */
  limit: number | null

  /**
   * Message ID before which messages should be fetched
   * = 26 characters
   */
  before: string | null

  /**
   * Message ID after which messages should be fetched
   * = 26 characters
   */
  after: string | null

  /**
   * Message sort direction
   */
  sort: 'Relevance' | 'Latest' | 'Oldest'

  /**
   * Message ID to search around
   *
   * Specifying 'nearby' ignores 'before', 'after' and 'sort'.
   * It will also take half of limite rounded as the limits
   * to each side. It also fetches the message ID specified.
   */
  nearby: string | null

  /**
   * Whether to include user (and member, if server channel)
   * objects
   */
  include_users: boolean | null
}

type GetMessagesResponse = RevoltMessage[] | {
  messages: RevoltMessage[]
  users: Array<Record<string, any>>
  members: Array<Record<string, any>>
}

// -> Module definition
// --------------------

const DeltaChannels = (
  _: ClientContext,
  __: ContextSetter
) => {

  // -> Channel information
  // ----------------------

  /**
   * Fetch channel by its id.
   */
  const getChannel = async (
    channelId: string
  ): ServiceReturn<RevoltChannel> => {
    const [ err, data ] = await http.get(`channels/${channelId}`)
    return [ err, data ]
  }

  /**
   * Deletes a server channel, leaves a group or closes a group.
   *
   * @param queryParams.leave_silently - Whether or not to send
   * a leave message
   */
  const closeChannel = async (
    channelId: string,
    queryParams?: { leave_silently?: boolean }
  ): ServiceReturn<null> => {
    const [ err, data ] = await http.delete(withQueryParams(
      `channels/${channelId}`, queryParams || {}))

    return [ err, data ]
  }

  /**
   * Edit a channel object by its id.
   */
  const editChannel = async (
    channelId: string,
    params: EditChannelParams
  ): ServiceReturn<RevoltChannel> => {
    const [ err, data ] = await http
      .patch(`channels/${channelId}`, params)

    return [ err, data ]
  }

  // -> Channel invites
  // ------------------

  /**
   * Creates an invite to this channel. Channel must be a
   * TextChannel type.
   */
  const createInvite = async (
    channelId: string
  ): ServiceReturn<ChannelInvite> => {
    const [ err, data ] = await http
      .post(`channels/${channelId}/invites`)

    return [ err, data ]
  }

  // -> Channel permissions
  // ----------------------

  const setRolePermission = async (
    channelId: string,
    roleId: string,
    params: any
  ): ServiceReturn<object> => {
    const [ err, data ] = await http
      .put(`channels/${channelId}/permissions/${roleId}`)
    return [ err, data ]
  }

  const setDefaultPermission = async (
    channelId: string,
    permissions: number
  ): ServiceReturn<object> => {
    const [ err, data ] = await http
      .put(`channels/${channelId}/permissions/default`)

    return [ err, data ]
  }

  // -> Messaging
  // ------------

  const acknowledgeMessage = async (
    channelId: string,
    messageId: string
  ): ServiceReturn<null> => {
    const [ err, data ] = await http
      .put(`channels/${channelId}/ack/${messageId}`)

    return [ err, data ]
  }

  const getMessages = async (
    channelId: string,
    queryParams: GetMessagesQueryParams
  ): ServiceReturn<GetMessagesResponse> => {
    const [ err, data ] = await http.get(withQueryParams(
      `channels/${channelId}/messages`,
      queryParams))

    return [ err, data ]
  }

  const sendMessage = async (
    channelId: string,
    params: Record<string, any>
  ): ServiceReturn<Record<string, any>> => {
    const [ err, data ] = await http
      .post(`channels/${channelId}/messages`, params)

    return [ err, data ]
  }

  const searchMessages = async (
    channelId: string,
    params: Record<string, any>
  ): ServiceReturn<Record<string, any>> => {
    const [ err, data ] = await http
      .post(`channels/${channelId}/search`, params)

    return [ err, data ]
  }

  const pollMsgChanges = async (
    channelId: string,
    messageIds: string[]
  ): ServiceReturn<null> => {
    const [ err, data ] = await http
      .post(`channels/${channelId}/messages/stale`, {
        ids: messageIds
      })

    return [ err, data ]
  }

  const getMessage = async (
    channelId: string,
    messageId: string
  ): ServiceReturn<Record<string, any>> => {
    const [ err, data ] = await http
      .get(`channels/${channelId}/messages/${messageId}`)

    return [ err, data ]
  }

  const deleteMessage = async (
    channelId: string,
    messageId: string
  ): ServiceReturn<null> => {
    const [ err, data ] = await http
      .delete(`channels/${channelId}/messages/${messageId}`)

    return [ err, data ]
  }

  const editMessage = async (
    channelId: string,
    messageId: string,
    params: Record<string, any>
  ): ServiceReturn<Record<string, any>> => {
    const [ err, data ] = await http
      .patch(`channels/${channelId}/messages/${messageId}`,
             params)

    return [ err, data ]
  }

  const bulkMsgDelete = async (
    channelId: string,
    messageIds: string[]
  ): ServiceReturn<null> => {
    const [ err, data ] = await http
    .delete(`channels/${channelId}/messages/bulk`, {
      ids: messageIds
    })

    return [ err, data ]
  }

  // -> Interactions
  // ---------------

  const addMsgReaction = async (
    channelId: string,
    messageId: string,
    emojiId: string
  ): ServiceReturn<null> => {
    const [ err, data ] = await http.put([
      `channels/${channelId}/`,
      `messages/${messageId}/`,
      `reactions/${emojiId}`
    ].join(''))

    return [ err, data ]
  }

  const removeMsgReaction = async (
    channelId: string,
    messageId: string,
    emojiId: string
  ): ServiceReturn<null> => {
    const [ err, data ] = await http.delete([
      `channels/${channelId}/`,
      `messages/${messageId}/`,
      `reactions/${emojiId}`
    ].join(''))

    return [ err, data ]
  }

  const removeAllMsgReactions = async (
    channelId: string,
    messageId: string,
  ): ServiceReturn<null> => {
    const [ err, data ] = await http.delete([
      `channels/${channelId}/`,
      `messages/${messageId}/`,
      `reactions`
    ].join(''))

    return [ err, data ]
  }

  // -> Groups
  // ---------

  const fetchGroupMembers = async (
    channelId: string
  ): ServiceReturn<Record<string, any>> => {
    const [ err, data ] = await http
      .get(`channel/${channelId}/members`)

    return [ err, data ]
  }

  const createGroup = async (
    params: Record<string, any>
  ): ServiceReturn<Record<string, any>> => {
    const [ err, data ] = await http
      .post('channels/create', params)

    return [ err, data ]
  }

  const addGroupMember = async (
    channelId: string,
    memberId: string
  ): ServiceReturn<null> => {
    const [ err, data ] = await http
      .put(`channels/${channelId}/recipients/${memberId}`)

    return [ err, data ]
  }

  const removeGroupMember = async (
    channelId: string,
    memberId: string
  ): ServiceReturn<null> => {
    const [ err, data ] = await http
      .delete(`channels/${channelId}/recipients/${memberId}`)

    return [ err, data ]
  }

  // -> Voice
  // --------

  const joinCall = async (
    channelId: string
  ): ServiceReturn<{ token: string }> => {
    const [ err, data ] = await http
      .post(`channels/${channelId}/join_call`)

    return [ err, data ]
  }

  // -> Webhooks
  // -----------

  const createWebhook = async (
    channelId: string,
    params: Record<string, any>
  ): ServiceReturn<Record<string, any>> => {
    const [ err, data ] = await http
      .post(`channels/${channelId}/webhooks`, params)

    return [ err, data ]
  }

  const getWebhooks = async (
    channelId: string
  ): ServiceReturn<Record<string, any>> => {
    const [ err, data ] = await http
      .get(`channels/${channelId}/webhooks`)

    return [ err, data ]
  }

  return {
    getChannel,
    closeChannel,
    editChannel,
    createInvite,
    setRolePermission,
    setDefaultPermission,
    acknowledgeMessage,
    getMessages,
    sendMessage,
    searchMessages,
    pollMsgChanges,
    getMessage,
    deleteMessage,
    editMessage,
    bulkMsgDelete,
    addMsgReaction,
    removeMsgReaction,
    removeAllMsgReactions,
    fetchGroupMembers,
    createGroup,
    addGroupMember,
    removeGroupMember,
    joinCall,
    createWebhook,
    getWebhooks
  }
}

export default DeltaChannels

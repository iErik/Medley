import http from '@utils/http'

import type {
  ClientContext,
  ContextSetter
} from '@typings/Client'

import { ServiceReturn } from '@typings/Delta'

const DeltaChannels = (
  _: ClientContext,
  __: ContextSetter
) => {

  // -> Channel information
  // ----------------------

  // Returns channel object
  const getChannel = async (
    channelId: string
  ): ServiceReturn<any> => {
    const [ err, data ] = await http.get(`channels/${channelId}`)
    return [ err, data ]
  }

  const closeChannel = async (
    channelId: string
  ): ServiceReturn<null> => {
    const [ err, data ] = await http
      .delete(`channels/${channelId}`)

    return [ err, data ]
  }

  const editChannel = async (
    channelId: string,
    params: any
  ) => {
    const [ err, data ] = await http
      .patch(`channels/${channelId}`)

    return [ err, data ]
  }

  // -> Channel invites
  // ------------------

  const createInvite = async (
    channelId: string
  ): ServiceReturn<object> => {
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
    params: Record<string, any>
  ): ServiceReturn<Record<string, any>> => {
    const [ err, data ] = await http
      .get(`channels/${channelId}/messages`)

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

import { type EnhancedStore } from '@reduxjs/toolkit'

import { decodeTime } from 'ulid'
import {
  call,
  put,
  takeLatest,
  takeEvery
} from 'typed-redux-saga'

import {
  type Events,
  User as ApiUser,
  Chat,
  Sync
} from '@packages/api'

import { delta } from '@/revolt'

import type { User, Asset } from '@store/shared/types'
import { mapUser, mapAsset } from '@store/shared/transform'

import { type ReduxAction, createSlice } from '@utils/redux'

import {
  isDirect,
  isGroup,
  isSavedMsgs
} from './helpers'


/*--------------------------------------------------------/
/ -> Types                                                /
/--------------------------------------------------------*/

export type Message = Chat.RevoltMessage & {
  createdAt: number
  serverId?: string
}

export type DirectChannel = Chat.DirectMessage & {
  fetched: boolean
  loading: boolean
  listed:  boolean
  messages: Message[]
}

export type GroupChannel = Omit<Chat.GroupChannel, 'icon'> & {
  fetched: boolean
  loading: boolean
  messages: Message[]
  icon: Asset | null
}

export type SavedMessages = Chat.SavedMessage & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

export type TextChannel = Omit<Chat.TextChannel, 'icon'> & {
  fetched: boolean
  loading: boolean
  messages: Message[]
  icon: Asset | null
}

// TODO: VoiceChannel doesn't need these properties, but
// we're including it here for consistency and so that
// TypeScript leaves alone, but we need to revise it
export type VoiceChannel =Omit<Chat.VoiceChannel, 'icon'> & {
  fetched: boolean
  loading: boolean
  messages: Message[]
  icon: Asset | null
}

export type Channel
  = DirectChannel
  | GroupChannel
  | SavedMessages
  | TextChannel
  | VoiceChannel


export type ServerChannel
  = TextChannel
  | VoiceChannel

export type Server = Omit<
  Chat.RevoltServer, 'icon' | 'banner'> & {
  lastSelectedChannel: string | null
  icon: Asset | null
  banner: Asset | null
}

export type UserRelationship = ApiUser.RelationshipType
export type ServerCategory = Chat.ServerCategory

// TODO: Maybe use Pick in here?
export type UserRelationshipType
  = 'Friend'
  | 'Outgoing'
  | 'Incoming'
  | 'Blocked'
  | 'BlockedOther'

export type UserRelationships = {
  [key in UserRelationshipType]: string[]
};

export type Member = ApiUser.RevoltMember & {
  fullId: string
}

export type ActiveChannel = {
  id: string
  serverId: string
  typing: Array<any>
  loading: boolean
  messageCount: number
}

export type ChatState = {
  activeChannel: ActiveChannel
  activeServer: string | null
  channelsFetched: boolean

  channels: Record<string, Channel>
  servers: Record<string, Server>
  members: Record<string, Member>
  users: Record<string, User>
  unreads: Record<string, Sync.ChannelUnread>

  relationships: UserRelationships
}

// Mapped Types
// ---------------

export type MCategory = Omit<
  Chat.ServerCategory,
  'channels'
> & {
  channels: ServerChannel[]
}

export type MServer = Omit<
  Server,
  'categories'
> & {
  uncategorized: ServerChannel[]
  categories: MCategory[]
}

// Re-exports

export type ChannelUnread = Sync.ChannelUnread
const ChannelType = Chat.ChannelType
const RelationshipTypeEnum = ApiUser.RelationshipTypeEnum

export type UserPresence = ApiUser.UserPresence
const UserPresenceEnum = ApiUser.UserPresenceEnum

export {
  ChannelType,
  RelationshipTypeEnum,
  UserPresenceEnum
}

/*--------------------------------------------------------/
/ -> Helpers                                              /
/--------------------------------------------------------*/

export const getMemberFullId = (
  { _id }: ApiUser.RevoltMember
): string => `${_id.server}-${_id.user}`


/*--------------------------------------------------------/
/ -> Reducer                                              /
/--------------------------------------------------------*/

// TODO: Create an action that will allow displaying a
// DirectMessage channel even if it is inactive
const initialState: ChatState = {
  channelsFetched: false,

  activeServer: null,
  activeChannel: {
    id: '',
    serverId: '',
    loading: false,
    typing: [],
    messageCount: 0
  },

  channels: {},
  servers: {},
  members: {},
  users: {},
  unreads: {},

  relationships: {
    Friend: [],
    Outgoing: [],
    Incoming: [],
    Blocked: [],
    BlockedOther: []
  }
}

const { types, actions, rootReducer } = createSlice({
  name: 'user',
  state: initialState,
  reducers: {
    setActiveServer(state, activeServer: string | null) {
      state.activeServer = activeServer
    },

    setChannelsFetched(state, fetched: boolean) {
      state.channelsFetched = fetched
    },

    setActiveChannel(
      state,
      channelId: string,
      serverId: string
    ) {
      state.activeChannel.id = channelId
      state.activeChannel.serverId = serverId
    },

    setChannelListed(
      state,
      channelId: string,
      listed: boolean
    )  {
      const channel = state.channels[channelId]

      if (isDirect(channel)) { channel.listed = listed }
    },

    setServers(state, servers: Server[]) {
      for (const server of servers) {
        state.servers[server._id] = server
      }
    },

    setChannels(state, channels: Channel[]) {
      for (const channel of channels) {
        state.channels[channel._id] = channel
      }
    },


    setUnreads(state, unreads: Sync.ChannelUnread[]) {
      for (const unread of unreads) {
        state.unreads[unread?._id?.channel] = {
          ...unread
        }
      }
    },

    setLoadingChannel(
      state,
      channelId: string,
      loading: boolean
    ) {
      let target = state.channels[channelId]
      if (!target) return

      target.loading = loading
    },

    setFetched(state, channelId: string, fetched = true) {
      const channel = state.channels[channelId]
      const isVoice =
        channel?.channel_type === ChannelType.Voice

      if (channel && !isVoice) {
        channel.fetched = fetched
      }
    },

    setChannel(
      state,
      channelId: string,
      channel: Partial<Channel>
    ) {
      let target = state.channels[channelId]

      if (!target) return

      target = {
        ...target,
        // TODO: no bueno
        // Option 1: Make it so that the caller *has* to
        // inform the type of the channel in advance
        // Option 2: Write a 'merge' helper which will only
        // merge already existing properties
        ...(channel || {}) as typeof target
      }
    },

    appendMessages(
      state,
      messages: Chat.RevoltMessage[],
      channelId: string,
      prepend: boolean = false,
      serverId?: string,
    ) {
      const channel = state.channels[channelId]
      const isVoice =
        channel?.channel_type === ChannelType.Voice

      if (!channel || isVoice) return

      // The server API will return the most recent messages
      // first, so we need to reverse it
      const existingMessageIds = channel.messages
        .map(msg => msg._id)
      const newMessages = (messages || [])
        .filter(msg => !existingMessageIds.includes(msg._id))
        .reverse()

      const allMessages = prepend
        ? [ ...newMessages, ...channel.messages ]
        : [ ...channel.messages, ...newMessages ]

      channel.messages = allMessages.map((msg) =>
        mapMessage(msg, serverId))

      if (channelId === state.activeChannel.id)
        state.activeChannel.messageCount = channel.messages
          .length
    },

    appendMessage(state, message: Chat.RevoltMessage) {
      const channel = state.channels[message.channel]
      if (!channel || !channel.fetched) return

      channel.messages.push({
        ...message,
        createdAt: decodeTime(message._id)
      })
    },

    setRelationshipList(
      state,
      type: UserRelationshipType,
      list: string[]
    ) {
      if (type in state.relationships) {
        state.relationships[type] = [ ...(list || []) ]
      }
    },

    setMembers(state, members: ApiUser.RevoltMember[]) {
      for (const member of members) {
        const fullId = getMemberFullId(member)
        state.members[fullId] = {
          ...member,
          fullId
        }
      }
    },

    setMember(state, member: ApiUser.RevoltMember) {
      const fullId = getMemberFullId(member)
      state.members[fullId] = {
        ...member,
        fullId
      }
    },

    setUsers(state, users: User[]) {
      for (const user of users) {
        state.users[user.id] = user
      }
    },

    setUser(state, user: User) {
      if (user.id && (user.id in state.users)) {
        const target = state.users[user.id]
        state.users[user.id] = { ...target, ...user }
      }
    },

    appendUser(state, user: User) {
      if (!user.id) return

      state.users[user.id] = user
    }
  },
  actions: {
    fetchUnreads: null,

    fetchMsgsBefore: (
      channelId: string,
      messageId: string
    ) => ({ channelId, messageId }),

    fetchUser: (userId: string) => ({ userId }),
    openDM: (
      userId: string,
      then?: (c: DirectChannel) => any
    ) => ({
      userId,
      then
    }),

    selectChannel(channelId: string, serverId?: string) {
      return {
        channelId,
        serverId
      }
    }
  }
})

export { actions, types }
export default rootReducer

/*--------------------------------------------------------/
/ -> Mapping Functions                                    /
/--------------------------------------------------------*/

export const filterRelationship = (
  users: User[],
  type: ApiUser.RelationshipType
): string[] => users
  .filter(u => u.relationship === type)
  .map(u => u.id)

export const mapChannel = (
  channel: Chat.RevoltChannel
): Channel => ({
  ...channel,
  fetched: false,
  loading: false,
  messages: [],

  ...(channel.channel_type === ChannelType.DirectMessage
     ? { listed: false }
     : {}),

  // TypeScript sadly doesn't understand that the original
  // 'icon' property present in three of the types in the
  // RevoltChannel union type is being overriden by a
  // fitting icon property. So we need 'as Channel' here.
  ...('icon' in channel
    ? { icon: mapAsset(channel.icon) }
    : {})
} as Channel)

export const mapMessage = (
  msg: Chat.RevoltMessage,
  serverId?: string
): Message => ({
  ...msg,
  ...(serverId ? { serverId } : {}),
  createdAt: decodeTime(msg._id)
})

/*--------------------------------------------------------/
/ -> Bonfire Event Handlers                               /
/--------------------------------------------------------*/

export const bonfireListeners = {
  Ready: (
    store: EnhancedStore,
    { users, members, ...data }: Events.ReadyEvent
  ) => {
    const mapped = users.map(mapUser)

    const servers = data?.servers?.map(server => ({
      ...server,
      lastSelectedChannel: null,
      icon: mapAsset(server.icon),
      banner: mapAsset(server.banner)
    }))

    const channels = data?.channels?.map(mapChannel)

    store.dispatch(actions.setServers(servers))
    store.dispatch(actions.setChannels(channels))

    store.dispatch(actions.setUsers(mapped))
    store.dispatch(actions.setMembers(members))

    // -> Fill up user relationships map
    store.dispatch(actions.setRelationshipList('Friend',
      filterRelationship(mapped, 'Friend')
    ))

    store.dispatch(actions.setRelationshipList('Blocked',
      filterRelationship(mapped, 'Blocked')
    ))

    store.dispatch(actions.setRelationshipList('Incoming',
      filterRelationship(mapped, 'Incoming')
    ))

    store.dispatch(actions.setRelationshipList('Outgoing',
      filterRelationship(mapped, 'Outgoing')
    ))

    store.dispatch(actions.setChannelsFetched(true))
  },

  Message: (
    store: EnhancedStore,
    message: Events.MessageEvent
  ) => {
    console.log('Message event: ', { message })
    store.dispatch(actions.appendMessage(message))
  },

  ServerMemberJoin: (
    store: EnhancedStore,
    data: Events.ServerMemberJoin
  ) => {
    const users = store.getState().chat.users
    const isFetched = data.user in users

    if (!isFetched) store.dispatch(actions.fetchUser(
      data.user
    ))

    console.log('ServerMemberJoin:', { users, isFetched })
  }
}

/*--------------------------------------------------------/
/ -> Saga                                                 /
/--------------------------------------------------------*/


function* onSetActiveServer({ args }: ReduxAction<{
  activeServer: string
}>) {
  const [ , data ] = yield* call(
    delta.servers.getMembers,
    args?.activeServer
  )

  yield* put(actions.setMembers(data?.members))
  yield* put(actions.setUsers(data?.users?.map(mapUser)))
}

type SelectChannelParams = ReduxAction<{
  channelId: string,
  serverId: string
}>

function* onSelectChannel({ args }: SelectChannelParams) {
  yield* put(actions.setLoadingChannel(
    args.channelId,
    true))

  const [ , data ] = yield* call(
    delta.channels.getMessages,
    args.channelId,
    { include_users: true })

  yield* put(actions.setFetched(args.channelId, true))

  if (data.type === 'IncludeUsers') {
    yield* put(actions.setMembers(data.members || []))
    yield* put(actions.setUsers(
      (data.users || []).map(mapUser)
    ))
  }

  yield* put(actions.appendMessages(
    data.messages,
    args.channelId,
    false,
    args.serverId))

  yield* put(actions.setLoadingChannel(
    args.channelId,
    false))
}

function* onFetchMsgsBefore({ args }: ReduxAction<{
  channelId: string,
  messageId: string
}>) {
  yield* put(actions.setLoadingChannel(
    args.channelId,
    true))

  const [ err, data ] = yield* call(
    delta.channels.getMessages,
    args.channelId,
    {
      limit: 20,
      include_users: true,
      before: args.messageId,
    }
  )

  if (err) return

  if (data.type === 'IncludeUsers') {
    yield* put(actions.setMembers(data.members || []))
    yield* put(actions.setUsers(
      (data.users || []).map(mapUser)
    ))
  }

  yield* put(actions.appendMessages(
    data.messages,
    args.channelId,
    true))

  yield* put(actions.setLoadingChannel(
    args.channelId,
    false))
}

function* onFetchUnreads() {
  const [ err, data ] = yield* call(delta.sync.getUnreads)

  if (err) { return }

  yield* put(actions.setUnreads(data))
}

function* onFetchUser(
  { args }: ReduxAction<{ userId: string }>
) {
  const [ err, data ] = yield* call(
    delta.users.getUser,
    args.userId)

  if (err) return

  yield* put(actions.appendUser(mapUser(data)))
}

// TODO:
// Something that is very important to understand here:
// if there is no existing (active or inactive)
// DirectMessage channel with the target user, the official
// Revolt client will first make a dmUser API call, then
// whenever the logged in user decides to re-open that DM
// channel, it will simply re-fetch the messages from the
// existing channel, instead of always be making calls to
// the dmUser endpoint.
function* onOpenDm({
  args
}: ReduxAction<{
  userId: string,
  then?: (data: Channel) => any
}>) {
  const [ err, data ] = yield* call(delta.users.dmUser,
    args.userId)

  const channel = mapChannel(data)
  console.log({ err, data, channel, args })

  if (err) return

  yield* put(actions.setChannels([
    channel
  ]))

  if (args.then) args.then(channel)
}


export function* chatSaga() {
  yield* takeLatest(types.setActiveServer, onSetActiveServer)
  yield* takeLatest(types.fetchUnreads, onFetchUnreads)
  yield* takeLatest(types.selectChannel, onSelectChannel)
  yield* takeLatest(types.fetchMsgsBefore, onFetchMsgsBefore)
  yield* takeEvery(types.fetchUser, onFetchUser)
  yield* takeEvery(types.openDM, onOpenDm)
}


export * from './getters'

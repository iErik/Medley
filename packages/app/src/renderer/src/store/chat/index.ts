import { createReducer } from '@utils/redux'
import {
  ReceiveEvent,
  Guild,
  User,
  GuildMemberListUpdateEv,
} from '@ierik/discordance-api'

// -> Type Aliases
// ---------------

const OperationType = GuildMemberListUpdateEv.OperationType
const MemberItemKind = GuildMemberListUpdateEv.MemberItemKind

type MemberListPayload = GuildMemberListUpdateEv.Payload
type OpMember          = GuildMemberListUpdateEv.OpMember
type OpGroup           = GuildMemberListUpdateEv.OpGroup
type Range             = GuildMemberListUpdateEv.Range
type OperationItem = GuildMemberListUpdateEv.OperationItem

type MemSyncOp = GuildMemberListUpdateEv.SyncOperation

// -> Types
// --------

export type MappedGroup = OpGroup & Guild.GuildRole & {
  members: OpMember[]
}

export type MappedMember = OpMember & {
  color?: string
}

export type MappedOperationItem = MappedGroup | MappedMember

export type GuildMemberMeta = {
  items: MappedOperationItem[]
  range: Range
}

export interface UserGuild extends Guild.MappedGuild {
  members?: GuildMemberMeta
  memberCount: number
  onlineCount: number
}

type ActiveChannel = {
  id: string
  guildId: string
  typing: Array<any>
  loading: boolean
  messageCount: number
}

type ChatState = {
  isLoading: boolean
  activeChannel: ActiveChannel
  privateMessages: any[]
  guilds: UserGuild[]
}

type HandlerArgs = Record<string, any>

// -> Helpers
// ----------

const genericHandler = <ChatState>(
  state: ChatState,
  args: HandlerArgs
) => ({ ...state, ...args })


// -> Store Definition
// -------------------

const initialState: ChatState = {
  isLoading: false,

  activeChannel: {
    id: '',
    guildId: '',
    loading: false,
    typing: [],
    messageCount: 0
  },

  privateMessages: [],
  guilds: [],
}

const {
  types,
  actions,
  rootReducer
} = createReducer<ChatState>(initialState, {
  selectChannel: { args: [ 'channelId', 'guildId' ] },
  sendMsg: { args: [ 'channelId', 'content' ] },

  loadingChat:  {
    args: [ 'loading' ],
    handler: (
      state: ChatState,
      { loading }: HandlerArgs
    ) => {
      state.activeChannel.loading = loading
    }
  },

  setLoadingChannel: {
    args: [ 'channel' ],
    handler: (
      state: ChatState,
      { loading }: HandlerArgs
    ) => { state.activeChannel.loading = loading }
  },

  setActiveChannel: {
    args: [ 'channelId', 'guildId' ],
    handler: (
      state: ChatState,
      { channelId, guildId }: HandlerArgs
    ) => {
      state.activeChannel.id = channelId
      state.activeChannel.guildId = guildId
    }
  },

  // Used for message history
  appendMessages: {
    args: [ 'messages', 'guildId', 'channelId' ],
    handler: (
      state: ChatState,
      { messages, guildId, channelId }: HandlerArgs
    ) => {
      const guild = state.guilds.find(guild =>
        guild.id === guildId)
      const channel = guild?.categories
        ?.flatMap(c => c.children)
        ?.find(channel => channel.id === channelId)

      if (!guild || !channel) return

      const existingMessageIds = channel.messages
        .map(msg => msg.id)
      const newMessages = (messages || [])
        .filter(msg => !existingMessageIds.includes(msg.id))
        .reverse()

      channel.messages = [
        ...newMessages,
        ...channel.messages,
      ].map(msg => ({ ...msg, guild_id: guildId }))

      if (channelId === state.activeChannel.id)
        state.activeChannel.messageCount = channel.messages
          .length
    }
  },

  messageCreate: {
    args: [ 'msg' ],
    handler: (
      state: ChatState,
      { msg }: HandlerArgs
    ) => {
      const guild = state.guilds.find(guild =>
        guild.id === msg.guild_id)
      const channel = guild?.categories
        ?.flatMap(c => c.children)
        ?.find(channel => channel.id === msg.channel_id)

      if (!guild || !channel) return

      channel.messages.push(msg)

      if (channel.id === state.activeChannel.id)
        state.activeChannel.messageCount += 1
      else
        channel.unread = true
    }
  },

  syncGuildMembers: {
    args: [ 'payload' ],
    handler: (
      state: ChatState,
      { payload }: { payload: MemberListPayload }
    ) => {
      const {
        ops,
        guild_id: guildId,
        member_count: memberCount,
        online_count: onlineCount,
      } = payload

      const guild = state.guilds
        .find(g => g?.id === guildId)

      if (!guild) return

      const mapGroup = (group: OpGroup, index: number) => ({
        ...group,
        ...(guild.roles
          ?.find(r => r.id === group.id) || {}),
        index,
        members: [],
      })

      const mapMember = (
        member: User.Member,
        index: number
      ) => ({ ...member, index })

      const mapItem = (item: OperationItem, i: number) =>
        item.kind === MemberItemKind.Group
          ? mapGroup(item, i)
          : mapMember(item, i)

      const operationMap = {
        [OperationType.Sync]: (op: MemSyncOp) =>
          guild.members = {
            items: op.items
              .map(mapItem)
              .filter(Boolean) as MappedOperationItem[],
            range: op.range
          },

        [OperationType.Delete]: () => ({}),
        [OperationType.Insert]: () => ({}),
        [OperationType.Update]: () => ({}),
        [OperationType.Invalidate]: () => ({})
      }

      guild.memberCount = memberCount
      guild.onlineCount = onlineCount

      ops.forEach(operation =>
        operationMap[operation.op](operation as any))
    }
  },

  setGuilds: {
    args: [ 'guilds' ],
    handler: genericHandler
  },

  setPrivateMessages: {
    args: [ 'privateMessages' ],
    handler: genericHandler
  }
}, 'chat')

export const gatewayListeners = {
  // these actions are not being dispatched
  [ReceiveEvent.Ready]: (data) => [
    actions.setPrivateMessages(data?.private_channels),
    actions.setGuilds(data?.guilds)
  ],

  [ReceiveEvent.MessageCreate]: (data) => [
    actions.messageCreate(data)
  ],

  [ReceiveEvent.GuildMemberListUpdate]: (
    data: MemberListPayload
  ) => [
    actions.syncGuildMembers(data)
  ]
}

export { actions, types, MemberItemKind }
export default rootReducer
export type { OpMember }

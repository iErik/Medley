import { createReducer } from '@utils/redux'
import {
  User,
  ReceiveEvent,
  GuildMemberListUpdateEv
} from '@ierik/discordance-api'

// -> Type Aliases
// ---------------

type User = User.User

const MemOpType = GuildMemberListUpdateEv.OperationType
const MemItemKind = GuildMemberListUpdateEv.MemberItemKind

type MemberListPayload = GuildMemberListUpdateEv.Payload
type OpMember          = GuildMemberListUpdateEv.OpMember
type OperationItem = GuildMemberListUpdateEv.OperationItem

type MemSyncOp = GuildMemberListUpdateEv.SyncOperation

// -> Types
// --------

type UnfetchedUser = {
  id: string
  loading: true
}

interface FetchedUser extends User {
  loading: false
}

type UserMention = UnfetchedUser | FetchedUser

type GlobalState = {
  isLoading: boolean
  userMentions: UserMention[]
  users: any
}

// -> Store Definition
// -------------------

const initialState: GlobalState = {
  isLoading: false,
  userMentions: [],
  users: {}
}

const {
  types,
  actions,
  rootReducer
} = createReducer<GlobalState>(initialState, {
  fetchUser: { args: [ 'userId' ] },

  addMention: {
    args: [ 'userId' ],
    handler: (
      state: GlobalState,
      { userId }
    ) => {
      const mentionExists = !!state.userMentions
        .find(user => user.id === userId)

      if (!mentionExists) state.userMentions.push({
        id: userId,
        loading: true
      })
    }
  },

  setMention: {
    args: [ 'user' ],
    handler: (
      state: GlobalState,
      { user }
    ) => {
      state.userMentions = state.userMentions.map(
        storedUser => storedUser.id === user.id
          ? user : storedUser)
    }
  },

  syncMembers: {
    args: [ 'payload' ],
    handler: (
      state: GlobalState,
      { payload }: { payload: MemberListPayload }
    ) => {
      const operations = payload.ops
      const guildId = payload.guild_id

      const onMemberSync = (op: MemSyncOp, guildId: string) => {
        const members = op.items.filter(item =>
          item.kind === MemItemKind.Member) as OpMember[]

        members.forEach(({ user, ...member }: OpMember) => {
          if (!user) return

            state.users[user.id] = {
              ...user,
              mergedMembers: {
                ...(state.users[user.id]?.mergedMembers || {}),
                [guildId]: member
              }
            }
        })
      }

      const operationMap = {
        [MemOpType.Sync]: onMemberSync,
        [MemOpType.Update]: () => ({}),
        [MemOpType.Delete]: () => ({}),
        [MemOpType.Invalidate]: () => ({}),
        [MemOpType.Insert]: () => ({}),
      }

      operations.forEach(op =>
        operationMap[op.op](op as any, guildId))
    }
  }
})

export const gatewayListeners = {
  [ReceiveEvent.GuildMemberListUpdate]: (
    data: MemberListPayload
  ) => [ actions.syncMembers(data) ]
}

export { actions, types }
export default rootReducer

import { type EnhancedStore } from '@reduxjs/toolkit'

import {
  type Events,
  User,
  getAssetUrl,
} from '@ierik/revolt'

import { createSlice } from '@utils/redux'


// TODO:
//  - Handle relationship user changes
//  - setRelationship and setRelationshipUser reducers


/*--------------------------------------------------------/
/ -> Types                                                /
/--------------------------------------------------------*/

const RelationshipTypeEnum = User.RelationshipTypeEnum
export { RelationshipTypeEnum }

export enum AuthState {
  Unauthenticated = 'UNAUTHENTHICATED',
  PendingMFA      = 'PENDING_MFA',
  Authenticated   = 'AUTHENTICATED'
}

export type UserRelationship = User.RelationshipType

export type User = {
  id: string
  displayName: string | null
  discriminator: string | null
  status: User.UserStatus | null
  username: string | null
  avatar: string | null
  relationship: UserRelationship
}

export type Self = Omit<User, 'id'> & {
  id: string | null
}


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


export type Member = User.RevoltMember & {
  fullId: string
}


export type UserState = {
  authState: AuthState
  isLoading: boolean
  errors: string[]

  members: Record<string, Member>
  users: Record<string, User>
  relationships: UserRelationships

  self: Self
}


/*--------------------------------------------------------/
/ -> Helpers                                              /
/--------------------------------------------------------*/

const getMemberFullId = (
  { _id }: User.RevoltMember
): string => `${_id.server}-${_id.user}`

/*--------------------------------------------------------/
/ -> Reducer                                              /
/--------------------------------------------------------*/

const initialState: UserState = {
  authState: AuthState.Unauthenticated,
  isLoading: false,
  errors: [],

  members: {},
  users: {},

  self: {
    displayName: null,
    discriminator: null,
    status: null,
    username: null,
    id: null,
    avatar: null,
    relationship: 'User'
  },

  relationships: {
    Friend: [],
    Outgoing: [],
    Incoming: [],
    Blocked: [],
    BlockedOther: []
  },
}

const { types, actions, rootReducer } = createSlice({
  name: 'user',
  state: initialState,
  actions: {
    login: (credentials: {
      email: string,
      password: string
    }) => ({ credentials }),

    mfa: (code: string) => ({ code }),

    logout: null
  },
  reducers: {
    setLoading(state, loading: boolean) {
      state.isLoading = loading
    },

    setErrors(state, errors: string[]) {
      state.errors = [
        ...state.errors,
        ...errors
      ]
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

    setMembers(state, members: User.RevoltMember[]) {
      for (const member of members) {
        const fullId = getMemberFullId(member)
        state.members[fullId] = {
          ...member,
          fullId
        }
      }
    },

    setMember(state, member: User.RevoltMember) {
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

    setSelf(state, self: User) {
      state.self = { ...state.self, ...self }
    },

    authState(
      state,
      authState: AuthState,
      authData?: { user_id: string }
    ) {
      state.authState = authState
      state.self.id = authData?.user_id || state.self.id
    }
  }
})

/*--------------------------------------------------------/
/ -> Mapping Functions                                    /
/--------------------------------------------------------*/

const mapUser = (user: User.RevoltUser): User => ({
  id: user._id,
  displayName: user?.display_name || null,
  discriminator: user?.discriminator,
  status: user?.status || null,
  username: user?.username,
  relationship: user.relationship,
  avatar: getAssetUrl(
    user?.avatar?.tag,
    user?.avatar?._id
  )
})

const filterRelationship = (
  users: User[],
  type: User.RelationshipType
): string[] => users
  .filter(u => u.relationship === type)
  .map(u => u.id)

/*--------------------------------------------------------/
/ -> Bonfire Event Handlers                               /
/--------------------------------------------------------*/


const bonfireListeners = {
  Ready: (
    store: EnhancedStore,
    { users, members }: Events.ReadyEvent
  ) => {
    const mapped = users.map(mapUser)
    const user = mapped.find(u => u.relationship === 'User')

    if (user) store.dispatch(actions.setUser(user))

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
  }
}


export { actions, types, bonfireListeners }
export * from './getters'
export default rootReducer

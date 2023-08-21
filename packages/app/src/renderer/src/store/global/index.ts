import { createReducer } from '@utils/redux'
import type { User, Common } from '@ierik/revolt'

// -> Type Aliases
// ---------------

// -> Types
// --------

type MappedUser = Omit<User.RevoltUser,
  'avatar' | 'profile'
> & {
  avatar: Common.Asset & { src: string }
  profile: Omit<User.UserProfile, 'background'> & {
    background: Common.Asset & { src: string }
  }
}

type UserMention = {
  id: string
  loading: boolean
  user: MappedUser | null

}

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
        loading: true,
        user: null
      })
    }
  },
})

// -> WS Event Handlers
// --------------------

export { actions, types }
export default rootReducer

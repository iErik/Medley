import { createSlice } from '@utils/redux'
import type { User, Common } from '@packages/api'

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


type AppSettings = {
  emojiPack: 'mutant' | 'twemoji' | 'noto' | 'openmoji'
}


type GlobalState = {
  isLoading: boolean
  userMentions: UserMention[]
  settings: AppSettings
}

// -> Store Definition
// -------------------

const initialState: GlobalState = {
  isLoading: false,
  userMentions: [],
  settings: {
    emojiPack: 'mutant'
  }
}

const {
  types,
  actions,
  rootReducer
} = createSlice({
  name: 'global',
  state: initialState,
  actions: {
    fetchUser: (userId: string) => ({ userId })
  },
  reducers: {
    addMention(state, userId: string) {
      const mentionExists = !!state.userMentions
        .find(user => user.id === userId)

      if (!mentionExists) state.userMentions.push({
        id: userId,
        loading: true,
        user: null
      })
    }
  }
})

// -> WS Event Handlers
// --------------------

const bonfireListeners = {

}

export { actions, types, bonfireListeners }
export * from './selectors'
export default rootReducer

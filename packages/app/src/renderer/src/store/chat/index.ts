import { createReducer } from '@utils/redux'
import { getAssetUrl } from '@ierik/revolt'
import type { Common, Chat, Events } from '@ierik/revolt'

// -> Types
// --------

export type MappedAsset = Common.Asset & {
  src: string
}

type MappedChannel = Chat.RevoltChannel & {

}

type MappedCategory = Omit<Chat.ServerCategory,
  'channels'
> & {
  channels: Array<MappedChannel>
}

export type MappedServer = Omit<
  Chat.RevoltServer,
  'categories'
  > & {
  icon: MappedAsset
  banner: MappedAsset
  categories: Array<MappedCategory>
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
  activeServer: string | null
  privateMessages: any[]
  servers: MappedServer[]
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

  activeServer: null,

  privateMessages: [],
  servers: [],
}

const {
  types,
  actions,
  rootReducer
} = createReducer<ChatState>(initialState, {
  setServers: {
    args: [ 'servers' ],
    handler: genericHandler
  },

  setActiveServer: {
    args: [ 'activeServer' ],
    handler: genericHandler
  }
}, 'chat')

// -> Types
// --------


// -> WS Event Handlers
// --------------------

const bonfireEvents = {
  Ready: (data: Events.ReadyEvent) => {
    const servers = data?.servers?.map((server) => ({
      ...server,
      icon: {
        ...(server?.icon || {}),
        src: getAssetUrl(server?.icon?.tag, server?.icon?._id)
      },
      banner: {
        ...(server?.banner || {}),
        src: getAssetUrl(server?.banner?.tag, server?.banner?._id)
      },
      categories: server.categories?.map(category => ({
        ...(category || {}),
        channels: category?.channels
          ?.map(channel => data?.channels
            ?.find(ch => ch._id === channel))
          // Some channels will not be found if the user doesn't
          // have permission to see them, so they will be
          // undefined, we have to filter that out.
          ?.filter(channel => !!channel)
      }))
    }))

    return [ actions.setServers(servers) ]
  }
}

export { actions, types, bonfireEvents }
export default rootReducer

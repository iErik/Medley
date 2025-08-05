import { useParams } from 'react-router'

import { useSelector } from '@store'
import { useNavigation } from '@/routes'

import { styled } from '@stitched'

import {
  type ServerChannel,
  selectServerWithChannels
} from '@store/chat'

import ServerPanel from '@components/ServerPanel'


export default function ServerPanelContainer() {
  const { serverId, channelId } = useParams()
  const navigate = useNavigation()

  const server = useSelector(state =>
    selectServerWithChannels(state, {
      serverId: serverId || ''
    }))

  const unreads = useSelector(state =>
    state.chat.unreads)

  const onSelectChannel = (chan: ServerChannel) => {
    if (serverId) navigate.Server(serverId, chan._id)
  }

  return (
    <Root>
      { server
        ? <ServerPanel
            server={server}
            unreads={unreads}
            activeChannel={channelId}
            onSelectChannel={onSelectChannel}
          />
        : null
      }
    </Root>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Root = styled('div', {
  height: '100%',
  marginRight: '2px'
})

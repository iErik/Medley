import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useServer, actions } from '@store/chat'
import { useAction } from '@hooks'


import ServerPanel from '@components/ServerPanel'

const ChannelsContainer = () => {
  const selectChannel = useAction(actions.selectChannel)
  const { serverId, channelId } = useParams()
  const activeServer = useServer(serverId || '')

  useEffect(() => {
    if (channelId) selectChannel(channelId)
  }, [ channelId ])

  // Can it ever be really null?
  return activeServer
    ? <ServerPanel server={activeServer}/>
    : null
}

export default ChannelsContainer

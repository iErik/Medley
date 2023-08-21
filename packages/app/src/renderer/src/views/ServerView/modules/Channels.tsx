import { useParams } from 'react-router-dom'
import { useSelector } from '@store'

import ServerPanel from '@components/ServerPanel'

const ChannelsContainer = () => {
  const { serverId } = useParams()
  const activeServer = useSelector(state => {
    // If there's no server id, we should redirect instead
    if (!serverId) return null

    return state?.chat?.servers?.find(({ _id }) =>
      _id === serverId)
  })

  // Can it ever be really null?
  return activeServer
    ? <ServerPanel server={activeServer}/>
    : null
}

export default ChannelsContainer

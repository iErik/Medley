import { useParams } from 'react-router'

import { useSelector } from '@store'
import { useAction } from '@hooks'

import {
  selectServerWithChannels
} from '@store/chat/getters'

import ServerPanel from '@components/ServerPanel'


const ServerPanelContainer = () => {
  const { serverId } = useParams()

  const server = useSelector(state =>
    selectServerWithChannels(state, {
      serverId: serverId || ''
    }))

  return (
    <>
      { server ? <ServerPanel server={server} /> : null }
    </>
  )
}

export default ServerPanelContainer

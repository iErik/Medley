import { useNavigate } from 'react-router'

import { useAction } from '@hooks'
import { useSelector } from '@store'

import ServerList from '@components/ServerList'

import {
  type Server,
  actions as chatActions
} from '@store/chat'


// TODO <ServerSidebar>
// 1 - Map the relevant direct message channels, that is,
// the ones that are pinned and the ones who have unread
// messages in them
//
// 2 - Handle direct message navigation

export default function ServerSidebar() {
  const serversMap = useSelector(state =>
    state.chat.servers)
  const servers = Object.values(serversMap)

  const navigate = useNavigate()
  const setActiveServer = useAction(
    chatActions.setActiveServer)

  const onSelectServer = (server: Server) => {
    const {
      _id: id,
      lastSelectedChannel,
      channels
    } = server

    const channelId = lastSelectedChannel || channels[0] || ''

    navigate(`server/${id}/channel/${channelId}`)
    //setActiveServer(_id)
  }

  const onSelectHome = () => {
    navigate(`/`)
  }

  const onSelectDM = () => {

  }

  return (
    <>
      <ServerList
        servers={servers}
        onSelectDM={onSelectDM}
        onSelectHome={onSelectHome}
        onSelectServer={onSelectServer}
      />
    </>
  )
}

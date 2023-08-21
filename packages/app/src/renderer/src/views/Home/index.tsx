import { useSelector } from '@store'

import { Text } from '@ierik/medley-components'
import { styled } from '@stitched'

// -> Guilds
// ------------

const ServerBanner = styled('div', {

})

const ServerChannel = styled(Text, {

})


const ServerCategoryName = styled(Text, {

})

const ServerCategoryWrapper = styled('div', {

})

const ChannelsBox = styled('div', {
  background: '$channelsPanelBgDark',
  borderRadius: '$panelBorderRadius'
})

const ServerContainer = () => {
  const activeServer = useSelector(state => {
    const activeServer = state?.chat?.activeServer

    if (!activeServer) return null

    return state?.chat?.servers?.find(({ _id }) =>
      _id === activeServer)
  })

  return (
    <ChannelsBox />
  )
}

// -> Chat
// -------

const ChatContainer = () => {

}

// -> Members
// ----------

const MembersContainer = () => {

}

// -> Main Component
// -----------------

// -> Fetch server users upon click
// -> Loading states
const Home = () => {
  return (
    <div></div>
  )
}

export default Home

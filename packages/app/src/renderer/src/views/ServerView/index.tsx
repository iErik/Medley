import Channels from './modules/Channels'
import Chat from './modules/Chat'
import Members from './modules/Members'

import { styled } from '@stitched'

const ViewContainer = styled('div', {
  display: 'flex',
  height: '100%'
})

const ServerView = () => {
  return (
    <ViewContainer>
      <Channels />
      <Chat css={{ width: '100%' }} />
      <Members />
    </ViewContainer>
  )
}

export default ServerView

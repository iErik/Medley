import { useSelector } from '@store'

import { styled } from '@stitched'
import { useMessages } from '@store/chat'

import ChatWindow from '@components/ChatWindow'


const Chat = () => {
  const activeChannelId = useSelector(state =>
    state.chat.activeChannel?.id)

  const messages = useMessages(activeChannelId)

  return (
    <Root>
      <ChatWindow messages={messages} />
    </Root>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Root = styled('div', {
  display: 'flex',
  background: '$bg400',

  width: '100%',
  height: '100%',

  borderTopRightRadius: '$baseRadius',
  borderBottomRightRadius: '$baseRadius',
})

export default Chat

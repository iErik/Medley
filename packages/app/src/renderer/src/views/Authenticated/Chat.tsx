import { useEffect } from 'react'

import { useParams } from 'react-router-dom'

import { useSelector } from '@store'
import { useAction } from '@hooks'

import { styled } from '@stitched'
import { useMessages, actions } from '@store/chat'

import ChatWindow from '@components/ChatWindow'


// Fetch channel messages
// fetch messages before message X
// Append messages coming from WebSocket
//
// The revolt client doesn't seem to make REST requests for
// a channels messages if it has already been fetched

// Chat specific scroll position
const Chat = () => {
  const { channelId } = useParams()
  const selectChannel = useAction(actions.selectChannel)

  const channel = useSelector(state =>
    state.chat.channels[channelId || ''])

  useEffect(() => {
    if (channel && !channel.fetched && !channel.loading) {
      selectChannel(channel._id)
    }
  }, [ channel ])

  const messages = channel?.messages || []

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

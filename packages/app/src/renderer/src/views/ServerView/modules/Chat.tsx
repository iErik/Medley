import { styled } from '@stitched'

import ChatWindow from '@components/ChatWindow'
import MessageInput from '@components/MessageInput'

// -> Elements
// -----------

const ContainerEl = styled('div', {
  height: '100%',

  [`& > ${MessageInput}`]: {
    margin: '0 10px'
  }
})

// -> Component
// ------------

const ChatContainer = (props: JSX.IntrinsicAttributes) => {
  return (
    <ContainerEl {...props}>
      <ChatWindow />
      <MessageInput />
    </ContainerEl>
  )
}

export default ChatContainer

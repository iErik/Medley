import { styled } from '@stitched'

import ChatWindow from '@components/ChatWindow'
import MessageInput from '@components/MessageInput'

// -> Elements
// -----------

const ContainerEl = styled('div', {
  display: 'grid',
  gridTemplateRows: 'fit-content(100%) 1fr',
  height: '100%',

  [`& > ${MessageInput}`]: {
    margin: '0 10px'
  }
})

const InputContainerEl = styled('div', {
  padding: '10px'
})

// -> Component
// ------------

const ChatContainer = (props: JSX.IntrinsicAttributes) => {
  return (
    <ContainerEl {...props}>
      <ChatWindow />

      <InputContainerEl>
        <MessageInput />
      </InputContainerEl>
    </ContainerEl>
  )
}

export default ChatContainer

import { styled } from '@stitched'

import MessageInput from '@components/MessageInput'

// -> Elements
// -----------

const ContainerEl = styled('div', {})

// -> Component
// ------------

const ChatContainer = () => {
  return (
    <ContainerEl>
      <MessageInput />
    </ContainerEl>
  )
}

export default ChatContainer

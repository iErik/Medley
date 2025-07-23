import { useSelector } from '@store'
import { useMessages, useChannel } from '@store/chat'
import type { Message } from '@store/chat'
import { useEffect, useRef, memo } from 'react'

import { Wrapper, ScrollView } from '@ierik/medley-components'
import { styled } from '@stitched'

import type {
  ClumpedMessageContent,
  ClumpedMessage
} from './types'

import ChatMessage from './fragments/Message'

// -> Helpers
// ----------

const clumpTimeLimit = 360000

const lastItem = (list: Array<any>) =>
  (list || [])[(list?.length || 1) - 1]

const timeLimitCheck = (
  msg: Message,
  msgClump: ClumpedMessage
) => {
  const msgTime = msg.createdAt.getTime()
  const previousMsg = msgClump.content[0]
  const previousTime = previousMsg.createdAt.getTime()

  return (msgTime - previousTime) < clumpTimeLimit
}

const authorCheck = (
  msg: Message,
  lastMsg: ClumpedMessage
): boolean => lastMsg?.author === msg?.author

const shouldClump = (
  msg: Message,
  lastMsg: ClumpedMessage
) =>
  lastMsg
  && authorCheck(msg, lastMsg)
  && timeLimitCheck(msg, lastMsg)

const clumpContent = (
  message: Message,
): ClumpedMessageContent => ({
  id: message._id,
  key: message._id,
  text: message.content || '',
  createdAt: message.createdAt
})

const mapMessage = (
  message: Message,
  subMessage?: Message
) => ({
  ...message,
  content: [
    ...(Array.isArray(message.content)
      ? message.content
      : [ clumpContent(message) ]),
    ...(subMessage
      ? [ clumpContent(subMessage) ]
      : [])
  ]
})

/**
 *
 */
const clumpMessages = (
  messages: Message[]
): ClumpedMessage[] => (messages || []).reduce((
  acc: ClumpedMessage[],
  msg: Message
) => {
  if (lastItem(acc) && shouldClump(msg, lastItem(acc))) {
    acc[acc.length - 1] = mapMessage(lastItem(acc), msg)
    return acc
  }

  return [ ...(acc || []), mapMessage(msg) ]
}, [])

// -> Elements
// ------------

const MessageList = styled(ScrollView, {
  width: '100%',
  height: '100%',
  overflowY: 'auto',
})

const ChatContainer = styled(Wrapper, {
  width: '100%',
  height: '100%',

  maxHeight: '100vh',
  // This following line is very important so the container
  // doesn't overflow the parent element and fucks shit up
  minHeight: 0
})

// -> Component Export
// -------------------

const ChatWindow = (props: JSX.IntrinsicAttributes) => {
//  const messageListRef = useRef<HTMLDivElement|null>(null)

  const activeChannelId = useSelector(state =>
    state.chat.activeChannel?.id)

  const messages = useMessages(activeChannelId)

  const clumpedMessages = clumpMessages(messages || [])
    ?.map((message: ClumpedMessage) =>
      <ChatMessage
        key={message?._id}
        message={message}
      />)

  return (
    <ChatContainer
      className="chat-window"
      column
      {...props}
    >
      <MessageList>
        { clumpedMessages }
      </MessageList>
    </ChatContainer>
  )
}

ChatWindow.toString = () => '.chat-window'
export default memo(ChatWindow)

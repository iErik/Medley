import { useSelector } from '@store'
import { useEffect, useRef, memo } from 'react'
import { decodeTime } from 'ulid'

import { Wrapper, ScrollView } from '@ierik/medley-components'
import { Chat } from '@ierik/revolt'

import { styled } from '@stitched'
import ChatMessage from './fragments/Message'
import ChatHeader from './fragments/Header'

// -> Types
// --------

type ClumpedMessageContent = {
  id: string
  text: string
  key: string
  timestamp: string
}

interface ClumpedMessage extends Omit<
  Chat.RevoltMessage,
  'content'
> { content: ClumpedMessageContent[] }

// -> Helpers
// ----------

const clumpTimeLimit = 360000

const lastItem = (list: Array<any>) =>
  (list || [])[(list?.length || 0) - 1]

const timeLimitCheck = (
  msg: Chat.RevoltMessage,
  msgClump: ClumpedMessage
) => {
  const msgTime = new Date(decodeTime(msg?._id)).getTime()
  const previousMsg = msgClump.content[0]
  const previousTime = new Date(decodeTime(previousMsg._id))
    .getTime()

  return (msgTime - previousTime) < clumpTimeLimit
}

const authorCheck = (
  msg: Chat.RevoltMessage,
  lastMsg: ClumpedMessage
): boolean => lastMsg?.author === msg?.author

const shouldClump = (
  msg: Chat.RevoltMessage,
  lastMsg: ClumpedMessage
) =>
  lastMsg
  && authorCheck(msg, lastMsg)
  && timeLimitCheck(msg, lastMsg)

const clumpContent = (
  message: Chat.RevoltMessage
): ClumpedMessageContent => ({
  id: message._id,
  key: message._id,
  text: message.content || '',
  timestamp: new Date (decodeTime(message._id)).getTime()
})

const mapMessage = (
  message: Chat.RevoltMessage,
  subMessage?: Chat.RevoltMessage
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
  messages: Chat.RevoltMessage[]
): ClumpedMessage[] => (messages || []).reduce((
  acc: ClumpedMessage[],
  msg: Chat.RevoltMessage
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
  const messageListRef = useRef<HTMLDivElement|null>(null)

  const activeChannelId = useSelector(state =>
    state.chat.activeChannel?.id)

  const channels = useSelector(state => state.chat.servers
    .flatMap(g => g.categories)
    .flatMap(c => c.channels))

  const activeChannel = channels.find(({ _id }) =>
    _id === activeChannelId)

  const messages =
    clumpMessages(activeChannel?.messages || [])
      ?.map((message: ClumpedMessage) =>
        <ChatMessage
          key={message?._id}
          message={message}
        />)

  useEffect(() => {
    const refEl = messageListRef.current
    if (!activeChannelId || !refEl) return

    refEl.scrollTo({
      top: refEl.scrollHeight,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    })
  }, [ activeChannelId ])

  return (
    <ChatContainer
      className="chat-window"
      column
      {...props}
    >
      { activeChannelId &&
        <ChatHeader
          channelName={activeChannel?.name || ''}
          channelDescription={activeChannel?.description || ''}
        />
      }

      <MessageList ref={messageListRef}>
        { messages }
      </MessageList>
    </ChatContainer>
  )
}

ChatWindow.toString = () => '.chat-window'
export default memo(ChatWindow)

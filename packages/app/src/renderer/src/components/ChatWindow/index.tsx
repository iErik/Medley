import { useSelector } from '@store'
import { useEffect, useRef, memo } from 'react'

import { Wrapper, ScrollView } from '@ierik/medley-components'
import { Chat } from '@ierik/discordance-api'

import { styled } from '@/stitches.config'
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
  Chat.ChatMessage,
  'content'
> { content: ClumpedMessageContent[] }

// -> Helpers
// ----------

const clumpTimeLimit = 360000

const lastItem = (list: Array<any>) =>
  (list || [])[(list?.length || 0) - 1]

const timeLimitCheck = (
  msg: Chat.ChatMessage,
  msgClump: ClumpedMessage
) => {
  const msgTime = new Date(msg?.timestamp).getTime()
  const previousMsg = msgClump.content[0]
  const previousTime = new Date(previousMsg.timestamp)
    .getTime()

  return (msgTime - previousTime) < clumpTimeLimit
}

const authorCheck = (
  msg: Chat.ChatMessage,
  lastMsg: ClumpedMessage
): boolean => lastMsg?.author?.id === msg?.author?.id

const shouldClump = (
  msg: Chat.ChatMessage,
  lastMsg: ClumpedMessage
) =>
  lastMsg
  && authorCheck(msg, lastMsg)
  && timeLimitCheck(msg, lastMsg)

const clumpContent = (
  message: Chat.ChatMessage
): ClumpedMessageContent => ({
  id: message.id,
  key: `${message.id}-${message.timestamp}`,
  text: message.content,
  timestamp: message.timestamp
})

const mapMessage = (
  message: Chat.ChatMessage,
  subMessage?: Chat.ChatMessage
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
  messages: Chat.ChatMessage[]
): ClumpedMessage[] => (messages || []).reduce((
  acc: ClumpedMessage[],
  msg: Chat.ChatMessage
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

  const channels = useSelector(state => state.chat.guilds
    .flatMap(g => g.categories)
    .flatMap(c => c.children))

  const activeChannel = channels.find(({ id }) =>
    id === activeChannelId)

  const messages =
    clumpMessages(activeChannel?.messages || [])
      ?.map((message: ClumpedMessage) =>
        <ChatMessage
          key={message?.id}
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
          channelDescription={activeChannel?.topic || ''}
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

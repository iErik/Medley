import { useState, useEffect, memo } from 'react'

import { type Message } from '@store/chat'

import type {
  OverlayScrollbars,
  OnUpdatedEventListenerArgs
} from '@packages/components/ScrollView'

import { Wrapper, ScrollView } from '@packages/components'
import { styled } from '@stitched'

import type {
  ClumpedMessageContent,
  ClumpedMessage
} from './types'

import ChatMessage from './fragments/Message'



type ChatWindowProps = JSX.IntrinsicAttributes & {
  messages: Message[],
  onFetchBefore: (messageId: string) => any
}

const TOP_TOLERANCE = 15
const BOTTOM_TOLERANCE = 5

const ChatWindow = ({
  messages,
  onFetchBefore,
  ...props
}: ChatWindowProps) => {
  const [pinToBottom, setPinToBottom] = useState(false)
  const [atTopEdge, setAtTopEdge] = useState(false)
  const [
    lastScrollHeight,
    setLastScrollHeight
  ] = useState(0)


  useEffect(() => {
    if (atTopEdge && messages.length)
      onFetchBefore(messages[0]?._id)
  }, [ atTopEdge ])

  const getBottomEdge = (el: HTMLElement) => {
    const scrollHeight = el.scrollHeight
    const clientHeight = el.clientHeight

    return (scrollHeight - clientHeight) - BOTTOM_TOLERANCE
  }

  const scrollToBottomEdge = (os: OverlayScrollbars) => {
    const viewport = os.elements().viewport
    const bottomEdge = getBottomEdge(viewport)

    viewport.scrollTop = bottomEdge
  }

  const onInit = (instance: OverlayScrollbars) => {
    const elements = instance.elements()
    const scrollEventEl = elements.viewport

    const scrollHeight = scrollEventEl.scrollHeight
    setLastScrollHeight(scrollHeight)

    scrollEventEl.scrollTop = scrollHeight
  }

  const onUpdate = (
    instance: OverlayScrollbars,
    updates: OnUpdatedEventListenerArgs
  ) => {
    const viewport = instance.elements().viewport
    const scrollHeight = viewport.scrollHeight
    const { updateHints: hints } = updates

    console.log('SCROLL.UPDATE:', {
      updates
    })

    if (hints.overflowAmountChanged) {
      if (atTopEdge) {
        const delta = scrollHeight - lastScrollHeight
        console.log('dude we gotta fix this', {
          scrollHeight,
          lastScrollHeight,
          delta
        })

        viewport.scrollTop = delta
      }

      if (pinToBottom)
        scrollToBottomEdge(instance)
    }

    setLastScrollHeight(scrollHeight)
  }

  const onScroll = (instance: OverlayScrollbars) => {
    const viewport = instance.elements().viewport
    const scrollTop = viewport.scrollTop

    // 5 pixels of tolerance
    const bottomEdge = getBottomEdge(viewport)
    const isAtBottomEdge = scrollTop >= bottomEdge
    const isAtTopEdge = scrollTop <= TOP_TOLERANCE

    if (isAtBottomEdge != pinToBottom)
      setPinToBottom(isAtBottomEdge)

    if (isAtTopEdge != atTopEdge) {
      setAtTopEdge(isAtTopEdge)
    }
  }

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
      <ScrollView
        events={{
          initialized: onInit,
          updated: onUpdate,
          scroll: onScroll
        }}
        css={{
          display: 'flex',
          flexDirection: 'column !important',
          justifyContent: 'flex-end',
          overflowAnchor: 'auto',

          '& .os-viewport': {
            padding: '0 20px !important',
            flexGrow: 'initial !important',
            overflowAnchor: 'auto',
          },
        }}
      >
        { clumpedMessages }
      </ScrollView>
    </ChatContainer>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const ChatContainer = styled(Wrapper, {
  width: '100%',
  height: '100%',

  maxHeight: '100vh',
  // This following line is very important so the container
  // doesn't overflow the parent element and fucks shit up
  minHeight: 0
})


/*--------------------------------------------------------/
/ -> Helpers                                              /
/--------------------------------------------------------*/

const clumpTimeLimit = 360000

const lastItem = (list: Array<any>) =>
  (list || [])[(list?.length || 1) - 1]

const timeLimitCheck = (
  msg: Message,
  msgClump: ClumpedMessage
) => {
  const msgTime = new Date(msg.createdAt).getTime()
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
  createdAt: new Date(message.createdAt)
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



ChatWindow.toString = () => '.chat-window'
export default memo(ChatWindow)

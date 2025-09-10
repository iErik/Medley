import { useState, useEffect, memo } from 'react'

import { useSelector } from '@store'

import {
  type Message,
  ChannelType,
  type Channel
} from '@store/chat'

import { useUser } from '@store/chat'

import type {
  OverlayScrollbars,
  OnUpdatedEventListenerArgs
} from '@packages/components/ScrollView'

import {
  Wrapper,
  Flexbox,
  ScrollView,
  Text
} from '@packages/components'

import { styled } from '@stitched'

import ChatMessage from './fragments/Message'


type ChatWindowProps = JSX.IntrinsicAttributes & {
  channel: Channel
  onFetchBefore: (messageId: string) => any
}

const TOP_TOLERANCE = 15
const BOTTOM_TOLERANCE = 5

const ChatWindow = ({
  channel,
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
    if (atTopEdge && channel.messages.length)
      onFetchBefore(channel.messages[0]?._id)
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

  const { messages = [] } = channel
  const clumpedMessages = clumpMessages(messages || [])
    ?.map((item: ChatItem) =>
      item.type === ChatItemType.Separator
        ? <ChatSeparator key={item.time} sep={item} />
        : <ChatMessage
          key={item?._id}
          message={item}
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
        <ChatStart channel={channel} />

        { clumpedMessages }
      </ScrollView>
    </ChatContainer>
  )
}

const ChatStart = ({ channel }: { channel: Channel }) =>  {
  const isDm =
    channel.channel_type === ChannelType.DirectMessage

  return (
    <ChatStartContainer>
      { isDm
        ? <DMStart recipients={channel.recipients} />
        : <ChannelStart channel={channel}/>
      }
    </ChatStartContainer>
  )
}

const DMStart = (props: { recipients: string[] }) => {
  const selfId = useSelector(state => state.auth.self.id)
  const recipientId = props.recipients.find(id =>
    id != selfId)

  const { user } = useUser(recipientId || '')

  if (!user) return null

  const name = user.displayName || user.username

  return (
    <Flexbox column gap="5">
      <Text size="lg" weight="medium">@{name}</Text>
      <Text>This is the start of your conversation</Text>
    </Flexbox>
  )
}

const ChannelStart = ({ channel }: { channel: Channel }) => {
  const name = 'name' in channel ? channel.name : ''

  return (
    <>
      <Text size="lg" weight="medium">#{name}</Text>
      <Text>This is the start of your conversation</Text>
    </>
  )
}

const ChatSeparator = (
  { sep }: { sep: MessageSeparator}
) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const date = new Date(sep.time)

  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()

  return (
    <Separator>
      { `${month} ${day}, ${year}` }
    </Separator>
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

const ChatStartContainer = styled('div', {
  display: 'flex',
  borderBottom: '1px solid $fg10',
  padding: '20px 0',
  marginBottom: 10
})

const separatorStyle = {
  flexGrow: 1,
  display: 'block',
  content: '',
  height: 1,
  backgroundColor: '$fg10'
}

const Separator = styled('span', {
  display: 'flex',
  color: '$fg40',
  alignItems: 'center',
  justifyContent: 'center',

  textTransform: 'uppercase',
  fontSize: 10,
  fontWeight: 600,

  gap: 15,
  margin: '5px 0',

  '&:before': { ...separatorStyle },
  '&:after': { ...separatorStyle }
})


/*--------------------------------------------------------/
/ -> Helpers                                              /
/--------------------------------------------------------*/

enum ChatItemType {
  Separator,
  Message
}

// A Message describes a singular message object from the
// Revolt database, a ClumpedMessage consists of an object
// that extends from the original Message type, and within
// it's contents property contains all messages that are
// supposed to be displayed in a 'cluster' together, almost
// as if they wer a single one visually.
export type ClumpedMessageContent = {
  id: string
  text: string
  key: string
  createdAt: Date
}

export type ClumpedMessage = Omit<
  Message,
  'content'
> & {
  type: ChatItemType.Message,
  content: ClumpedMessageContent[]
}

export type MessageSeparator = {
  type: ChatItemType.Separator
  time: number
}

export type ChatItem = MessageSeparator | ClumpedMessage

type ChatItems = ChatItem[]

// 6 Minutes / 360 Seconds in milliseconds
const clumpTimeLimit = 360000

/**
 * Returns the last item of an array
 */
const lastItem = <T,>(list: Array<T>): T =>
  (list || [])[(list?.length || 1) - 1]

/**
 * Returns a boolean indicating whether a message should be
 * included in a message clump based on the time it was
 * sent.
 *
 * If the send time between when the clump's last message
 * and the given message 'msg' is less than the
 * clumpTimeLimit constant, then the message should be
 * included in the message clump.
 */
const timeLimitCheck = (
  msg: Message,
  msgClump: ClumpedMessage
): boolean => {
  const msgTime = new Date(msg.createdAt).getTime()
  const previousMsg = msgClump.content[0]
  const previousTime = previousMsg.createdAt.getTime()

  return (msgTime - previousTime) < clumpTimeLimit
}

/*
 * Returns true if msg and lastMsg arguments have the same
 * author id
 */
const authorCheck = (
  msg: Message,
  lastMsg: ClumpedMessage
): boolean => lastMsg?.author === msg?.author


/**
 * Will return true if all of the given conditions are
 * satisfied:
 *  - lastMsg clump is not null
 *  - The authors of msg and the lastMsg clump are the same
 *  - The time between when the clump's last message and msg
 *    was sent is smaller than the clumpTimeLimit constant
 *
 * These conditions indicate the msg should be included in
 * the lastMsg message clump
 */
const shouldClump = (
  msg: Message,
  lastMsg: ClumpedMessage
): boolean =>
  lastMsg
  && authorCheck(msg, lastMsg)
  && timeLimitCheck(msg, lastMsg)

/**
 * Receives a message object and formats it according to the
 * ClumpedMessageContent type, which is used to aggregate
 * information regarding multiple messages in one message
 * clump.
 */
const clumpContent = (
  message: Message,
): ClumpedMessageContent => ({
  id: message._id,
  key: message._id,
  text: message.content || '',
  createdAt: new Date(message.createdAt)
})

/**
 * Will take a message argument which can be either a
 * Message type or a ClumpedMessage, and the returned type
 * is guaranteed to be a ClumpedMessage type.
 *
 * If subMessage is present, will add that to the message's
 * clumped contents, and if the type of the message argument
 * is indeed Message, will use the contents of message as
 * the clump's contents
 */
const mapMessage = (
  message: Message | ClumpedMessage,
  subMessage?: Message
): ClumpedMessage => ({
  type: ChatItemType.Message,
  ...message,
  content: [
    ...(Array.isArray(message.content)
      ? message.content
      : [ clumpContent(message as Message) ]),
    ...(subMessage
      ? [ clumpContent(subMessage) ]
      : [])
  ]
})

const mapSeparator = (message: Message): MessageSeparator => ({
  type: ChatItemType.Separator,
  time: message.createdAt
})

const insertSeparatorBetween = (
  msg: Message | ClumpedMessage,
  msgClump: ClumpedMessage
): boolean => {
  const msgTime = new Date(msg.createdAt).getDate()
  const previousMsg = msgClump.content[0]
  const previousTime = previousMsg.createdAt.getDate()

  return msgTime != previousTime
}

// TODO: 24h / date separators
/**
 * Will go through each message in the list and decide
 * which ones should be rendered in a 'clump' of messages
 */
const clumpMessages = (
  messages: Message[]
): ChatItems => (messages || []).reduce((
  acc: ChatItems,
  msg: Message
) => {
  const lastMsg = lastItem(acc)

  if (
    !lastMsg ||
    lastMsg.type === ChatItemType.Separator
  ) return [
    ...(acc || []),
    mapMessage(msg)
  ]

  if (insertSeparatorBetween(msg, lastMsg)) return [
    ...(acc || []),
    mapSeparator(msg),
    mapMessage(msg)
  ]

  if (lastItem(acc) && shouldClump(msg, lastMsg)) {
    acc[acc.length - 1] = mapMessage(lastMsg, msg)
    return acc
  }

  return [ ...(acc || []), mapMessage(msg) ]
}, [])



ChatWindow.toString = () => '.chat-window'
export default memo(ChatWindow)

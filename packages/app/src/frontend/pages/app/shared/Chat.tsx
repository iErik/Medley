import { useEffect } from 'react'

import { useAction } from '@hooks'
import { actions, useChannel } from '@store/chat'

import { useSelector } from '@store'
import { styled } from '@stitched'

import { Flexbox, If } from '@packages/components'

import ChatWindow from '@components/ChatWindow'
import MessageInput from '@components/MessageInput'

import Loader from '@components/Loader'


type ChatProps = {
  channelId: string
}

const Chat = (props: ChatProps) => {
  const channel = useChannel(props.channelId || '')
  const channelsFetched = useSelector(state =>
    state.chat.channelsFetched)

  const sendMsg = useAction(actions.sendMsg)
  const selectChannel = useAction(actions.selectChannel)
  const fetchMsgsBefore = useAction(actions.fetchMsgsBefore)

  useEffect(() => {
    if (!channelsFetched)
      return

    if (channel && !channel.fetched && !channel.loading) {
      selectChannel(channel._id)
    }
  }, [ channel, channelsFetched ])


  const showLoader = channel?.loading && !channel?.fetched

  const onFetchMsgsBefore = (messageId: string) => {
    if (channel.loading) return

    fetchMsgsBefore(props.channelId, messageId)
  }

  // TODO: Optimistic updates & Error Handling
  const onMsgSend = (text: string) => {
    sendMsg(props.channelId, {
      content: text
    })
  }

  return (
    <Root>
      <If condition={showLoader}>
        <Flexbox fill vAlign="center" hAlign="center">
          <Loader />
        </Flexbox>
      </If>

      <If condition={!showLoader && !!channel}>
        <ChatWindow
          key={props.channelId}
          channel={channel}
          onFetchBefore={onFetchMsgsBefore}
        />

        <MessageInputWrapper>
          <MessageInput onEnter={onMsgSend} />
        </MessageInputWrapper>
      </If>
    </Root>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Root = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  background: '$bg300',

  width: '100%',
  height: '100%',

  '&:not(:last-child)': {
    marginRight: '2px',
  },

  borderTopRightRadius: '$baseRadius',
  borderBottomRightRadius: '$baseRadius',
})


const MessageInputWrapper = styled('div', {
  //padding: '20px 10px',
  padding: '0 5px 5px 5px',

  //background: '$bg300'
})

export default Chat

import { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'wouter'

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

  const selectChannel = useAction(actions.selectChannel)
  const fetchMsgsBefore = useAction(actions.fetchMsgsBefore)

  useEffect(() => {
    if (channel && !channel.fetched && !channel.loading) {
      selectChannel(channel._id)
    }
  }, [ channel ])


  const showLoader = channel.loading && !channel.fetched

  const onFetchMsgsBefore = (messageId: string) => {
    if (channel.loading) return

    fetchMsgsBefore(props.channelId, messageId)
  }

  return (
    <Root>
      <If condition={showLoader}>
        <Flexbox fill vAlign="center" hAlign="center">
          <Loader />
        </Flexbox>
      </If>

      <If condition={!showLoader}>
        <ChatWindow
          key={props.channelId}
          messages={channel?.messages || []}
          onFetchBefore={onFetchMsgsBefore}
        />

        <MessageInputWrapper>
          <MessageInput />
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
  padding: '20px 10px',

  background: '$bg300'
})

export default Chat

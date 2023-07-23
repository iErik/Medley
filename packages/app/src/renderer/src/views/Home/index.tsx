import { ReactEditor } from 'slate-react'

import { useSelector } from '@store'
import { styled } from '@/stitches.config'

import { Wrapper } from '@ierik/concord-generics'
import MemberList from '@components/Members/List'
import GuildList from '@components/Guilds/List'
import ChatWindow from '@components/ChatWindow'
import MessageInput from '@components/MessageInput'

import { actions as chatActions } from '@store/chat'
import { useAction } from '@hooks'


// -> Elements
// -----------

const Container = styled('div', {
  display: 'grid',
  gridTemplateRows: 'max(100%)',
  gridTemplateColumns: 'auto minmax(100px, 3fr) auto',

  padding: '0 10px',
  height: '100vh',

  [`& > ${ChatWindow}`]: {
    flexGrow: 1,
    flexShrink: 0
  }
})

// -> Chat
// -------

const ChatWrapper = styled(Wrapper, {
  height: '100vh',
  padding: '0 20px',

  [`& > ${ChatWindow}`]: { },

  [`& > ${MessageInput}`]: {
    margin: '10px 0'
  },
})

const Chat = () => {
  const activeChannelId = useSelector(state =>
    state.chat.activeChannel?.id)
  const sendMsg = useAction(chatActions.sendMsg)

  const onSendMsg = (value: string, editor: ReactEditor) => {
    editor.deleteBackward('block')
    sendMsg(activeChannelId, value)
  }

  return (
    <ChatWrapper column>
      <ChatWindow />
      <MessageInput onEnter={onSendMsg} />
    </ChatWrapper>
  )
}

// -> Main Component
// -----------------

const Home = () => {
  const guilds = useSelector(state => state.chat.guilds)
  const selectChannel = useAction(
    chatActions.selectChannel
  ) as (channelId: string, guildId: string) => void

  const activeGuildId = useSelector(state =>
    state.chat.activeChannel?.guildId)
  const activeGuild = useSelector(state =>
    state.chat.guilds.find(g => g.id === activeGuildId))
  const memberItems = activeGuild?.members?.items || []

  return (
    <Container>
      <GuildList
        guilds={guilds}
        onSelectChannel={selectChannel}
      />

      <Chat />
      <MemberList members={memberItems} />
    </Container>
  )
}

export default Home

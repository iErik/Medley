import { memo } from 'react'
import { useSelector } from '@store'

import { Wrapper, Text }  from '@ierik/concord-generics'
import { styled } from '@/stitches.config'
import parseMsg from '@parser'

// -> Types
// --------

interface ChatMessageProps extends JSX.IntrinsicAttributes {
  message: Record<string, any>
}

type AuthorProps = {
  authorId: string
  guildId: string
}

// -> Author
// ---------

const AuthorAvatar = styled('img', {
  width: 40,
  height: 40,
  borderRadius: '100%',
  marginRight: 12
})

const AuthorName = styled(Text, {
  fontFamily: '$sans',
  fontWeight: 'bold',
})

const AuthorDiscriminator = styled('span', {

})

const Author = ({
  authorId,
  guildId,
}: AuthorProps) => {
  const author = useSelector(state =>
    state.global.users[authorId])
  const member = author?.mergedMembers?.[guildId]
  const avatarSrc = member.avatar_src || author.avatar_src

  return (
    <Wrapper>
      <AuthorAvatar src={avatarSrc} />

      <Wrapper column>
        <AuthorName>
          { member?.username }
          <AuthorDiscriminator>
            #{ member?.discriminator }
          </AuthorDiscriminator>
        </AuthorName>

      </Wrapper>
    </Wrapper>
  )
}

const MessageText = styled(Text, {
  fontFamily:    '$sans',
  whiteSpace:    'pre-wrap',
  wordBreak:     'break-word',
  fontWeight:    '$medium',
  verticalAlign: 'middle',

  padding: '2px 0',

  '& > *': { flexShrink: 0 },
  '& > .emoji': { margin: '0 2px' }
})

const MessageBox = styled('div', {
  display: 'flex',
  padding: '8px 0',
})

// -> Message
// ----------

export const ChatMessage = ({
  message,
  ...props
}: ChatMessageProps) => {
  const authorId = message.author?.id
  const guildId = message.guild_id

  const author = useSelector(state =>
    state.global.users[authorId])
  const member = author?.mergedMembers?.[guildId]

  const userRoles = useSelector(state => {
    const guild = state.chat.guilds.find(guild =>
      guild.id === guildId)
    const roles = guild?.roles

    return roles?.filter(role => member?.roles
      ?.includes(role.id))
  })

  const avatarSrc = member?.avatar_src || author?.avatar_src
  const authorName = member?.nick || author?.username
  const authorDiscriminator = author?.discriminator

  const color = userRoles?.reduce((colorRole, role) =>
    role.color && role.position > colorRole.position
      ? role
      : colorRole, { position: 0 })?.color

  if (!author) console.log({
    author,
    member,
    authorId,
    guildId,
    message
  })

  const messageList = message?.content?.map(content =>
    <MessageText key={content.key}>
      { parseMsg(content?.text) }
    </MessageText>)

  return (
    <MessageBox {...props}>
      <AuthorAvatar src={avatarSrc} />

      <Wrapper column>
        <AuthorName css={{ color }} children={authorName} />
        <Wrapper column children={messageList} />
      </Wrapper>
    </MessageBox>
  )
}

export default memo(ChatMessage)

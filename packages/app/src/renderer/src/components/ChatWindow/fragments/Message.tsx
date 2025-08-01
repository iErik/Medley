import { memo } from 'react'
import { useSelector } from '@store'
import { useUser } from '@store/chat'

import { Wrapper, Text }  from '@ierik/medley-components'
import { styled } from '@stitched'
import parseMsg from '@parser'

import type { ClumpedMessage } from './types'



interface ChatMessageProps extends JSX.IntrinsicAttributes {
  message: ClumpedMessage
}

type AuthorProps = {
  authorId: string
  guildId: string
}

export const ChatMessage = ({
  message,
  ...props
}: ChatMessageProps) => {
  const { user, member } = useUser(
    message.author,
    message.serverId
  )

  /*
  const user = useSelector(state => state.user.users[message.author])
  const member = useSelector(state =>
    state.user.members[`${message.serverId}-${message.author}`])
    */

  const { masquerade } = message

  const avatarSrc = masquerade?.avatar || user?.avatar
  const authorName = masquerade?.name || user?.username
  const authorDiscriminator = user?.discriminator

  if (!avatarSrc) {
    console.log("Couldn't get user avatar for message")
    console.log({ message, masquerade, user, member })
  }

  const messageList = message?.content
    ?.map((content, idx) =>
      <MessageText key={`${content.key}-${idx}`}>
        { parseMsg(content?.text) }
      </MessageText>)

  return (
    <MessageBox>
      <AuthorAvatar src={avatarSrc} />

      <Wrapper column>
        <AuthorName>
          { authorName }
        </AuthorName>

        <Wrapper column >
          {messageList}
        </Wrapper>
      </Wrapper>
    </MessageBox>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

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

// -> Message
// ----------

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


export default memo(ChatMessage)

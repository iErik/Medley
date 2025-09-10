import { memo } from 'react'
import { useSelector } from '@store'
import { useUser } from '@store/chat'

import {
  If,
  Wrapper,
  Flexbox,
  Text
}  from '@packages/components'

import { styled } from '@stitched'
import parseMsg from '@parser'

import type {
  ClumpedMessage,
  ClumpedMessageContent
} from '../'



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

  const { masquerade } = message

  const avatarSrc = masquerade?.avatar || user?.avatar
  const authorName = masquerade?.name || user?.username
  const authorDiscriminator = user?.discriminator

  if (!avatarSrc) {
    console.error('Couldn\'t get user avatar for message!', {
      message, masquerade, user, member
    })
  }

  const messageList = message?.content
    ?.map((content, idx) => idx === 0
      ? <Message
          key={content.key}
          avatarSrc={avatarSrc}
          username={authorName}
          content={content}
        />
      : <Message key={content.key} content={content} />)

  return (
    <Root>
      { messageList }
    </Root>
  )
}

const Message = (props: {
  avatarSrc?: string
  username?: string
  content: ClumpedMessageContent
}) => {
  const date = new Date(props.content?.createdAt)
  const intl = Intl.DateTimeFormat(undefined, {
    timeStyle: 'short'
  })
  const time = intl.format(date)

  return (
    <MessageBox>
      <Flexbox
        hAlign="center"
        vAlign="top"
        padding={props.avatarSrc ? '5px 0 0' : '7px 0 0'}
      >
        <If condition={!!props.avatarSrc}>
          <AuthorAvatar src={props.avatarSrc} />
        </If>

        <If condition={!props.avatarSrc}>
          <MessageTime aside>
            {time}
          </MessageTime>
        </If>
      </Flexbox>

      <Flexbox column>
        <If condition={!!props.username}>
          <Flexbox vAlign="center" gap="10">
            <AuthorName>
              { props.username }
            </AuthorName>

            <MessageTime>
              {time}
            </MessageTime>
          </Flexbox>
        </If>

        <MessageText>
          { parseMsg(props.content?.text) }
        </MessageText>
      </Flexbox>
    </MessageBox>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Root = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 0',
})

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

const MessageTime = styled(Text, {
  fontSize: 12,
  lineHeight: '12px',
  fontWeight: '$medium',
  color: '$fg30',
  paddingTop: '2px',

  //padding: '10px 0 0'
  variants: {
    aside: {
      true: {
        paddingTop: '0px',
        fontSize: 11,
        lineHeight: '11px',
        color: '$fg30',
      }
    }
  }
})

const MessageBox = styled('div', {
  display: 'grid',
  gridTemplateColumns: '65px 1fr',

  padding: '0 10px',

  [`& > ${Flexbox} > ${MessageTime}`]: { opacity: 0 },

  '&:hover': {
    background: '$bg500',
    [`& > ${Flexbox} > ${MessageTime}`]: { opacity: 1 },
  },
})

const MessageText = styled(Text, {
  display: 'flex',

  fontFamily:    '$sans',
  whiteSpace:    'pre-wrap',
  wordBreak:     'break-word',
  fontWeight:    '$medium',
  verticalAlign: 'middle',
  fontSize: 14,

  padding: '2px 0',

  '& > *': { flexShrink: 0 },
  '& > .emoji': { margin: '0 2px' }
})




export default memo(ChatMessage)

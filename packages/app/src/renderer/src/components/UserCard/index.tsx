import { styled } from '@/stitches.config'
import { Wrapper } from '@ierik/medley-components'

const Avatar = styled('img', {
  height: 35,
  width: 35,
  borderRadius: '100%'
})

const Username = styled('p', {
  fontFamily: '$sans',
  fontWeight: 600,
  fontSize: 14,
  color: '$fgBase'
})

const UserCard = ({
  user,
  ...props
}) => {
  return (
    <Wrapper
      css={{ height: 'fit-content' }}
      hAlign="center"
    >
      <Avatar src={user.avatarSrc} />

      <Wrapper
        column
        css={{
          marginLeft: 15,
          height: 'fit-content'
        }}
      >
        <Username>
          { user.username }
        </Username>
        <span></span>
      </Wrapper>
    </Wrapper>
  )
}

export default UserCard

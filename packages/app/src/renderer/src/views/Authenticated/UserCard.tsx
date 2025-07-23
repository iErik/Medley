import { styled } from '@stitched'

import { Wrapper } from '@ierik/medley-components'
import { type User } from '@store/user'

const Root = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  padding: 5,
  gap: 12,
  borderRadius: '$baseRadius'
})

const Avatar = styled('div', {
  borderRadius: 11,
  width: 40,
  height: 40,

  flexShrink: 0,
  backgroundPosition: 'center',
  backgroundSize: 'contain'
})

const Username = styled('p', {
  color: '$fg70',
  fontWeight: '$medium',
  fontSize: 14
})

const Status = styled('p', {
  color: '$fg50',
  fontSize: 14
})

const UserCard = (props: { user: User }) => {

  return (
    <Root>
      <Avatar style={{
          backgroundImage: `url(${props.user.avatar})`
        }}
      />

      <Wrapper column>
        <Username>{ props.user.username }</Username>

        { props.user.status?.text
          ? <Status>{ props.user.status?.text }</Status>
          : null
        }
      </Wrapper>
    </Root>
  )
}

export default UserCard

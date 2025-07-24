import { styled } from '@stitched'

import { Wrapper, If } from '@ierik/medley-components'
import {
  type User,
  type Self,
  UserPresenceEnum
} from '@store/user'



type BackgroundColorVariant
  = 'transparent'
  | '100' | 100
  | '200' | 200
  | '300' | 300
  | '400' | 400
  | '500' | 500

export type UserCardProps = {
  user: User | Self
  background?: BackgroundColorVariant
  hoverBg?: BackgroundColorVariant
}


const UserCard = ({ user, ...props }: UserCardProps) => {
  const isOffline =
    !user?.status ||
    user?.status?.presence === UserPresenceEnum.Invisible

  const _statusText = user?.status?.text?.trim()
  const presence = user?.status?.presence?.trim()

  const statusText = isOffline
    ? 'Offline'
    : _statusText || presence || ''


  return (
    <Root
      background={props.background || 'transparent'}
      hoverBg={props.hoverBg || 300}
    >
      <Avatar avatar={user.avatar} />

      <Wrapper column>
        <Username>{ user.username }</Username>

        <If condition={statusText}>
          <Status>{ statusText }</Status>
        </If>
      </Wrapper>
    </Root>
  )
}


/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Root = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',

  padding: 5,
  gap: 12,
  borderRadius: '$baseRadius',

  transition: 'background-color 200ms ease',
  cursor: 'pointer',

  variants: {
    background: {
      transparent: {
        backgroundColor: 'transparent'
      },

      100: { backgroundColor: '$bg100' },
      200: { backgroundColor: '$bg200' },
      300: { backgroundColor: '$bg300' },
      400: { backgroundColor: '$bg400' },
      500: { backgroundColor: '$bg500' },
    },

    hoverBg: {
      transparent: {
        '&:hover': { backgroundColor: 'transparent' }
      },

      100: { '&:hover': { backgroundColor: '$bg100' } },
      200: { '&:hover': { backgroundColor: '$bg200' } },
      300: { '&:hover': { backgroundColor: '$bg300' } },
      400: { '&:hover': { backgroundColor: '$bg400' } },
      500: { '&:hover': { backgroundColor: '$bg500' } },
    }
  },

  defaultVariants: {
    background: 'transparent',
    hoverBg: 300
  }
})

const AvatarEl = styled('div', {
  borderRadius: 11,
  width: 40,
  height: 40,

  userSelect: 'none',

  flexShrink: 0,
  backgroundPosition: 'center',
  backgroundSize: 'contain'
})

const Avatar = (props: { avatar: string | null }) => {

  return (
    <AvatarEl
      style={{ backgroundImage: `url(${props.avatar})` }}
    >
    </AvatarEl>
  )
}

const Status = styled('p', {
  color: '$fg40',
  fontWeight: '$medium',
  userSelect: 'none',
  fontSize: 14,
  height: '1em'
})


const Username = styled('p', {
  color: '$fg70',
  userSelect: 'none',
  fontWeight: '$medium',
  fontSize: 15,
  marginBottom: 2,
  height: '1em'
})



export default UserCard

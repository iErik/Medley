import { type User } from '@store/shared/types'
import { type Self } from '@store/auth'
import { UserPresenceEnum } from '@store/chat'

import InfoCard, {
  type BackgroundColorVariant
} from '@components/InfoCard'



export type UserCardProps = {
  user: User | Self
  background?: BackgroundColorVariant
  hoverBg?: BackgroundColorVariant
  onClick?: (
    user: User | Self,
    ev: React.MouseEvent<HTMLDivElement>
  ) => any
}

type MouseEv = React.MouseEvent<HTMLDivElement>

const UserCard = ({ user, ...props }: UserCardProps) => {
  const isOffline =
    !user?.status ||
    user?.status?.presence === UserPresenceEnum.Invisible

  const _statusText = user?.status?.text?.trim()
  const presence = user?.status?.presence?.trim()

  const statusText = isOffline
    ? 'Offline'
    : _statusText || presence || ''

  const handleClick = (ev: MouseEv) => {
    if (props.onClick) props.onClick(user, ev)
  }

  return (
    <InfoCard
      background={props.background || 'transparent'}
      hoverBg={props.hoverBg || 300}
      headline={user.displayName || user.username || ''}
      lowerline={statusText}
      image={user.avatar || ''}
      onClick={handleClick}
    />
  )
}


export default UserCard

import Icon from '@components/Icon'
import InfoCard, {
  type BackgroundColorVariant
} from '@components/InfoCard'

import type { MGroupChannel } from '@store/chat/getters'

import { styled } from '@stitched'

type MouseEv = React.MouseEvent<HTMLDivElement>

export type GroupCardProps = {
  group: MGroupChannel
  background?: BackgroundColorVariant
  hoverBg?: BackgroundColorVariant
  onClick?: (
    group: MGroupChannel,
    ev: MouseEv
  ) => any
}


// TODO: Support for group picture
const GroupCard = (props: GroupCardProps) => {
  const memberCount = (props.group?.recipients || []).length

  const lowerline = memberCount === 1
    ? `${memberCount} member`
    : `${memberCount} members`

  const hasIcon = props.group.icon && props.group.icon.src

  const handleClick = (ev: MouseEv) => {
    if (props.onClick) props.onClick(props.group, ev)
  }

  return (
    <InfoCard
      background={props.background || 'transparent'}
      hoverBg={props.hoverBg || 300}
      headline={props.group.name}
      lowerline={lowerline}
      image={props.group?.icon?.src || undefined}
      imageEl={!hasIcon ? <GroupIcon /> : undefined}
      onClick={handleClick}
    />
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const GroupIconEl = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,

  width: 40,
  height: 40,
  userSelect: 'none',
  borderRadius: 11,

  backgroundColor: '$bg100'
})

const GroupIcon = () => {
  return (
    <GroupIconEl>
      <Icon icon="Profiles" />
    </GroupIconEl>
  )
}

export default GroupCard

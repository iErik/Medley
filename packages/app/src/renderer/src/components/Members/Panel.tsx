import { memo } from 'react'

import { Panel } from '@ierik/concord-generics'
import { styled } from '@/stitches.config'

import { OpMember, MappedGroup } from '@store/chat'

// -> Elements
// -----------

const PanelWrapper = styled(Panel, {
  width: 230
})

// -> Header
// ---------

const PanelHeader = styled(Panel.Header, {
  display: 'flex',
  alignItems: 'center',
  color: '$fgBase',
  padding: '0 10px'
})

const GroupName = styled('span', {
  fontFamily: '$sans',
  fontSize: '$base',
  fontWeight: '$semibold'
})

const GroupIcon = styled('span', {
  display: 'inline-block',
  marginRight: 10,
  size: 23,

  backgroundSize: 'cover',
})

// -> Body
// -------

const UserAvatar = styled('span', {
  display: 'inline-block',
  borderRadius: '100%',
  size: 36,
})

const UserName = styled('span', {
  fontFamily: '$sans',
  fontSize: '$base',
  color: '$fgBase',
  fontWeight: '$extrabold',
  marginLeft: 10,
  ellipsis: '100%'
})

const User = styled('div', {
  display: 'flex',
  alignItems: 'center',
})

const MemberList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  padding: '10px 20px',

  [`& ${User}`]: { gapBottom: 12 }
})

const PanelBody = styled(Panel.Body, {
})

// -> Types
// --------

type MemberPanelProps = JSX.IntrinsicAttributes & {
  group: MappedGroup
  css?: Record<string, any>
}

// -> Component Export
// -------------------

const MemberPanel = ({
  group,
  ...props
}: MemberPanelProps) => {
  const groupName = group.name
  const { unicode_emoji: emoji, icon } = group || {}

  const getName = (member: OpMember) =>
    member?.nick || member?.user?.username
  const getAvatar = (member: OpMember) =>
    member?.avatar_src || member?.user?.avatar_src

  const members = group.members.map(member =>
    <User key={member?.user?.id}>
      <UserAvatar css={{ bgImg: getAvatar(member) }} />
      <UserName>{ getName(member) }</UserName>
    </User>)

  return (
    <PanelWrapper {...props}>
      <PanelHeader>
        <GroupIcon css={{ bgImg: icon || '' }} >
          { emoji }
        </GroupIcon>
        <GroupName css={{ color: group.color }}>
          { groupName }
        </GroupName>
      </PanelHeader>

      <PanelBody>
        <MemberList>
          { members }
        </MemberList>
      </PanelBody>
    </PanelWrapper>
  )
}

export default memo(MemberPanel)

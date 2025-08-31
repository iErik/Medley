import { memo, useMemo } from 'react'

import { styled } from '@/stitches.config'

import MemberPanel from '@components/Members/Panel'

import { Wrapper, ScrollView } from '@packages/components'
import {
  MappedOperationItem,
  MappedGroup,
  MemberItemKind
} from '@store/chat'


// -> Elements
// -----------

const ListWrapper = styled(Wrapper, {
  paddingTop: 60
})

// -> Types
// --------

export interface MemberListProps {
  members: MappedOperationItem[]
}

// -> Helpers
// ----------

const mapGroups = (
  item: MappedOperationItem[]
): MappedGroup[] => item
  ?.reduce((
    acc: MappedGroup[],
    item: MappedOperationItem
  ) => {
    // TODO: Consider just doing that on the reducer
    if (item.kind === MemberItemKind.Group)
      acc.push(JSON.parse(JSON.stringify(item)))
    else if (item.kind === MemberItemKind.Member)
      acc[acc.length - 1]?.members.push(item)

    return acc
  }, [])

// -> Component Export
// -------------------

const MemberList = ({
  members
}: MemberListProps) => {
  const mappedPanels = useMemo(() =>
    mapGroups(members)?.map(group =>
      <MemberPanel
        key={group.id}
        group={group}
        css={{ gapBottom: '20px' }}
      />), [ members ])

  return (
    <ListWrapper column>
      <ScrollView>
        { mappedPanels }
      </ScrollView>
    </ListWrapper>
  )
}

export default memo(MemberList)

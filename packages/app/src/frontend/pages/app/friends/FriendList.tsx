import { useState } from 'react'

import { useNavigator } from '@/routes'
import { useSelector } from '@store'
import useAction from '@hooks/useAction'


import {
  selectDMsWithUsers,
  selectUserRelationships,
  type DMsWithUsers
} from '@store/chat/getters'
import {
  type UserRelationship,
  RelationshipTypeEnum,
  actions as chatActions,
} from '@store/chat'


import { styled } from '@stitched'

import { ScrollView } from '@packages/components'
import UserCard from '@components/UserCard'
import Icon, { IconName } from '@components/Icon'


// TODO: Support for Group Chats
// TODO: Add OverlayScrollbar here
enum ListFilter {
  Conversations = 'Conversations',
}

type FilterType
  = 'relationships'
  | 'conversations'

const FriendList = () => {
  const gotoDirect = useNavigator('direct')
  const [listFilter, setFilter] = useState<
    UserRelationship
  >('Friend')

  const selectChannel = useAction(chatActions.selectChannel)

  const relationships = useSelector(selectUserRelationships)
  const channels = useSelector(selectDMsWithUsers)

  const onSelect = (channel: DMsWithUsers) => {
    gotoDirect(channel._id)
  }

  return (
    <Container>
      <ScrollView
        css={{ padding: 10}}
      >
        { channels?.map(c =>
          <UserCard
            key={c.user.id}
            user={c.user}
            hoverBg="500"
            onClick={onSelect.bind(null, c)}
          />)
        }
      </ScrollView>

      <Actions />
    </Container>
  )
}

const Actions = () => {
  type Action = { icon: IconName, action: () => any }
  const actions: Action[] = [
    { icon: 'MessageNotif'
    , action: () => {}
    },
    { icon: 'UserTag'
    , action: () => {}
    },
    { icon: 'UserTick'
    , action: () => {}
    },
    { icon: 'People'
    , action: () => {}
    }
  ]

  const actionBtns = actions.map(action => (
    <ActionButton>
      <Icon icon={action.icon}/>
    </ActionButton>
  ))

  return (
    <ActionsRoot>
      { actionBtns }
    </ActionsRoot>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  height: '100%',
  minWidth: 250,
  background: '$bg300',

  marginRight: 2
})

const List = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flexGrow: '1',
  padding: 10,
  gap: 5,
})


const ActionsRoot = styled('div', {
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gap: 2,
  padding: 2,

  background: '$bg500',
  height: 45,
  width: 'calc(100% - 4px)',
  margin: '0 2px 2px 2px',
  borderRadius: 5
})

const ActionButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  background: 'transparent',
  transition: 'background 300ms ease',
  flexShrink: 0,
  borderRadius: 5,


  //width: '$serverList',

  [`& ${Icon}`]: { },

  '&:hover': { background: '$bg300' },

  variants: {
    active: {
      true: { background: '$bg300' }
    }
  }
})

export default FriendList

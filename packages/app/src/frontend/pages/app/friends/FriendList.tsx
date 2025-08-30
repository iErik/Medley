import { useState } from 'react'

import { useNavigator } from '@/routes'
import { useSelector } from '@store'
import useAction from '@hooks/useAction'

import {
  selectDMsWithUsers,
  type DMsWithUsers
} from '@store/chat/getters'
import {
  type UserRelationship,
  RelationshipTypeEnum,
  actions as chatActions,
} from '@store/chat'


import { styled } from '@stitched'

import UserCard from '@components/UserCard'


enum ListFilter {
  Conversations = 'Conversations',
}

type FilterType
  = typeof RelationshipTypeEnum.Friend
  | typeof RelationshipTypeEnum.Outgoing
  | typeof RelationshipTypeEnum.Incoming
  | 'Conversations'

const FriendList = () => {
  const gotoDirect = useNavigator('direct')
  const [listFilter, setFilter] = useState<
    UserRelationship
  >('Friend')

  const selectChannel = useAction(chatActions.selectChannel)

  // TODO: Support for Group Chats (We gonna need a
  // component other than UserCard, identical but more
  // generic)

  const channels = useSelector(selectDMsWithUsers)

  const onSelect = (channel: DMsWithUsers) => {
    //selectChannel(channel._id)
    gotoDirect(channel._id)
  }

  return (
    <Container>
      <List>
        { channels?.map(c =>
          <UserCard
            key={c.user.id}
            user={c.user}
            hoverBg="500"
            onClick={onSelect.bind(null, c)}
          />)
        }
      </List>
    </Container>
  )
}

const Actions = () => {
  const actions = [
    { icon: 'MessageNotif'
    , action: () => {}
    },
    { icon: 'UserAdd'
    , action: () => {}
    },
    { icon: 'UserTick'
    , action: () => {}
    },
    { icon: 'People'
    , action: () => {}
    }
  ]

  return (
    <ActionsRoot>

    </ActionsRoot>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Container = styled('div', {
  display: 'flex',
  height: '100%',
  minWidth: 250,
  background: '$bg300',

  marginRight: 2
})

const List = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: 10,
  gap: 5,
})


const ActionsRoot = styled('div', {
  display: 'flex',
  background: '$bg500',
  height: 45

})

const ActionButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  background: 'transparent',
  //padding: 10,
  //borderRadius: 5,
  flexShrink: 0,

  width: '$serverList',
})

export default FriendList

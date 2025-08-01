import { useNavigate } from 'react-router'

import { useState } from 'react'

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

import UserCard from './UserCard'


enum ListFilter {
  Conversations = 'Conversations',
}

type FilterType
  = typeof RelationshipTypeEnum.Friend
  | typeof RelationshipTypeEnum.Outgoing
  | typeof RelationshipTypeEnum.Incoming
  | 'Conversations'

const FriendList = () => {
  const navigate = useNavigate()
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
    console.log('navigating')
    navigate(`/directs/${channel._id}`)
  }

  return (
    <Container>
      <List>
        {
          channels?.map(c =>
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


export default FriendList

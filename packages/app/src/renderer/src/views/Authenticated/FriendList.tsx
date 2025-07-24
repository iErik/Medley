import { useState } from 'react'

import { shallowEqual } from 'react-redux'
import { useSelector } from '@store'
import { Chat } from '@ierik/revolt'

import {
  type UserRelationship,
  RelationshipTypeEnum
} from '@store/user'

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

/**
* Filter: can be one of ...UserRelationship | 'Conversations'
*
* When Filter === 'Conversations':
*   - Map user DirectMessages so that each item can be
*   rendered as an UserCard
* Else:
*   - Assume Filter points to UserRelationship, map users
* in relationship as UserCards
*/

const FriendList = () => {
  const [listFilter, setFilter] = useState<
    UserRelationship
  >('Friend')

  // TODO: Consider memoizing
  const channels = useSelector(state => {
    const directs = Object
      .values(state.chat.channels)
      .filter(c =>
        c.channel_type === Chat.ChannelType.DirectMessage)

    return directs as Chat.DirectMessage[]
  }, shallowEqual)

  const recipients = new Set(channels
    .flatMap(c => c?.recipients || []))

  const users = useSelector(state => Array.from(recipients)
      .map(userId => state.user.users[userId]),
    shallowEqual)


  return (
    <Container>
      <List>
        {
          users?.map(u =>
            <UserCard
              key={u.id}
              user={u}
              hoverBg="500"
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
  background: '$bg400',

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

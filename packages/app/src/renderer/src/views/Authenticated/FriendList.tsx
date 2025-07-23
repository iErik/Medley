import { useState } from 'react'

import { useSelector } from '@store'
import {
  type UserRelationship,
  RelationshipTypeEnum
} from '@store/user'

import { styled } from '@stitched'

import UserCard from './UserCard'

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
  padding: 10,
  gap: 5,
})


const UserCardEl = styled('div', {

})

enum ListFilter {
  Conversations = 'Conversations',
}

type FilterType
  = typeof RelationshipTypeEnum.Friend
  | typeof RelationshipTypeEnum.Outgoing
  | typeof RelationshipTypeEnum.Incoming
  | 'Conversations'

console.log({RelationshipTypeEnum})

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

  const relationships: any[] = []

  return (
    <Container>
      <List>
        {
          relationships?.map(u =>
            <UserCard user={u} key={u.id} />)
        }
      </List>
    </Container>
  )
}

export default FriendList

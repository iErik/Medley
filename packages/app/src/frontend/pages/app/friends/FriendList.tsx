import {
  useState,
  useMemo,
  createContext,
  useContext
} from 'react'

import { useParams } from 'wouter'

import { useNavigator } from '@/routes'
import { useSelector } from '@store'
import { useAction } from '@hooks'

import type { User } from '@store/shared/types'

import {
  selectUserRelationships,
  selectDMsAndGroups,
  selectDMs,
  selectUserFromDirect,

  type MDirectChannel,
  type MGroupChannel,
  type MDirectOrGroup,
  type MUserRelationships
} from '@store/chat/getters'

import {
  ChannelType,
  UserPresenceEnum,
  type Channel,
  type UserPresence,
  actions as chatActions
} from '@store/chat'

import { styled } from '@stitched'

import {
  If,
  Flexbox,
  ScrollView,
  Text,
} from '@packages/components'

import { fuzzySearch } from '@packages/ts-utils'

import UserCard from '@components/UserCard'
import GroupCard from '@components/GroupCard'
import TextField from '@components/TextField'
import ResizeableDiv from '@components/ResizeableDiv'
import Icon, { IconName } from '@components/Icon'



enum Filter {
  DMs = 'DMs',
  Relationships = 'Relationships',
}

// TODO: Highlight active conversation
const FriendList = () => {
  const [listFilter, setFilter] = useState<
   Filter
  >(Filter.DMs)

  return (
    <FriendListCtx.Provider
      value={{ listFilter, setFilter }}
    >
      <ResizeableDiv handlePos="right" css={containerCss}>
        <ScrollView>
          <If condition={listFilter === Filter.DMs}>
            <Chats />
          </If>

          <If condition={listFilter === Filter.Relationships}>
            <Relationships />
          </If>
        </ScrollView>

        <Actions onSetFilter={setFilter} />
      </ResizeableDiv>
    </FriendListCtx.Provider>
  )
}

type ActionsProps = {
  onSetFilter: (filter: Filter) => any
}

const Actions = (props: ActionsProps) => {
  type Action = { icon: IconName, action: () => any }

  const actions: Action[] = [
    { icon: 'MessageNotif'
    , action: () =>
        props.onSetFilter(Filter.DMs)
    },
    { icon: 'UserTag'
    , action: () =>
        props.onSetFilter(Filter.Relationships)
    },
    { icon: 'UserTick'
    , action: () => {}
    },
    { icon: 'People'
    , action: () => {}
    }
  ]

  const actionBtns = actions.map(action => (
    <ActionButton key={action.icon} onClick={action.action}>
      <Icon icon={action.icon}/>
    </ActionButton>
  ))

  return (
    <ActionsRoot>
      { actionBtns }
    </ActionsRoot>
  )
}


type Chat = MDirectChannel | MGroupChannel

const Chats = () => {
  const { channelId: directId = '' } = useParams()
  const chats = useSelector(selectDMsAndGroups)
  const activeUser = useSelector(state =>
    selectUserFromDirect(state, { directId }))

  const gotoDirect = useNavigator('direct')
  const onSelect = (channel: MDirectOrGroup) =>
    gotoDirect(channel._id)

  const mapGroup = (group: MGroupChannel) => (
    <GroupCard
      key={group._id}
      group={group}
      hoverBg="500"
      onClick={onSelect.bind(null, group)}
    />
  )

  const mapDirect = (direct: MDirectChannel) => (
    <UserCard
      key={direct.user.id}
      user={direct.user}
      hoverBg="500"
      background={direct.user.id === activeUser?.id
        ? '500' : undefined}
      onClick={onSelect.bind(null, direct)}
    />
  )

  const mapChat = (chat: Chat) =>
    chat.channel_type === ChannelType.Group
      ? mapGroup(chat)
      : mapDirect(chat)

  return (
    <ChatList>
      { chats.map(mapChat) }
    </ChatList>
  )
}


type UserStatus =
  typeof UserPresenceEnum[UserPresence] | 'Offline'

type UsersByStatus = {
  [S in UserStatus]: User[]
}

const Relationships = () => {
  const ctx = useContext(FriendListCtx)

  const gotoDirect = useNavigator('direct')
  const openDm = useAction(chatActions.openDM)
  const listChannel = useAction(chatActions.setChannelListed)
  const directs = useSelector(selectDMs)

  const messageUser = (channelId: string) => {
    if (ctx) ctx.setFilter(Filter.DMs)

    listChannel(channelId, true)
    gotoDirect(channelId)
  }

  const onClickUser = (target: User) => {
    // 1 - Find direct channel containing target user id
    // 2 - If direct channel found:
    //   2.1 - Set channel's 'listed' property to true via
    //         store action
    //   2.2 - Grab its ID
    //
    // 3 - If direct channel not found:
    //   3.1 - Dispatch openDM store action
    //   3.2 - Look for new direct channel in the store
    //         state
    //   3.3 - Once found, grab its id
    //
    // 4 - Set FriendList filter to 'DMs'
    // 5 - Navigate to direct channel route with
    //     target's channel ID

    const channel = directs.find(c =>
      c.recipients.includes(target.id))

    if (channel)
      return messageUser(channel._id)

    console.log('Opening new DM!')
    openDm(target.id, (c: Channel) => messageUser(c._id))
  }

  const [hiddenLists, setVisibility] = useState<{
    [K: string ]: boolean
  }>({})

  const toggleHidden = (name: string) =>
    setVisibility({
      ...hiddenLists,
      [name]: !hiddenLists[name]
    })

  const [searchQuery, setSearchQuery] = useState('')
  const onSearch = (text: string) =>
    setSearchQuery(text)


  const relationships = useSelector(selectUserRelationships)

  const splitByStatus = (users: User[]) => (users || [])
    .reduce((acc, user) => {
      const presence = user?.status?.presence
      const status =
        !presence || presence === UserPresenceEnum.Invisible
          ? 'Offline'
          : presence

      const statusList = (acc[status] || [])

      return {
        ...acc,
        [status]: [ ...statusList, user ]
      }
    }, {} as UsersByStatus)

  const sortUsers = (a: User, b: User) => {
    const aName = a.displayName || a.username || ''
    const bName = b.displayName || b.username || ''

    return aName.localeCompare(bName)
  }

  const computedRelationships = useMemo(
    () => {
      const filteredRels = Object.entries(relationships)
        .reduce((acc, [ relName, users ]) => {
          return {
            ...acc,
            [relName]: users
              .filter(user => fuzzySearch(
                searchQuery,
                user.displayName || user.username || ''))
              .sort(sortUsers)
          }
        }, {} as MUserRelationships)

      const {
        Friend,
        BlockedOther,
        ...rels
      } = filteredRels

      const friends = splitByStatus(Friend)

      return {
        ...friends,
        ...rels,
        Blocked: [
          ...(rels.Blocked || []),
          ...(BlockedOther || [])
        ]
      }
    },
    [ searchQuery, relationships ]
  )

  const renderRelationship = (
    [ name, users ]: [ string, User[] ]
  ) => users?.length <= 0 ? null : (
    <Relationship key={name} hide={hiddenLists[name]}>
      <RelationshipTitle
        onClick={() => { toggleHidden(name) }}
      >
        <Icon icon="ArrowDown" size={17} />

        <Text decorative noSelect color="fg600">
          { name }
        </Text>
      </RelationshipTitle>

      <Flexbox column>
        { users.sort(sortUsers).map(user =>
          <UserCard
            hoverBg="500"
            key={user.id}
            user={user}
            onClick={(u) => onClickUser(u as User)}
          />)
        }
      </Flexbox>
    </Relationship>
  )

  const renderRelationships = () => Object
    .entries(computedRelationships)
    .map(renderRelationship)

  return (
    <Flexbox column vExpand>
      <TextField
        placeholder="Search"
        iconBefore="Search"
        onChange={onSearch}
        css={{ margin: '10px 10px 16px 10px' }}
      />

      <ScrollView css={{ padding: '0 10px' }}>
        { renderRelationships() }
      </ScrollView>
    </Flexbox>
  )
}

/*--------------------------------------------------------/
/ -> Context                                              /
/--------------------------------------------------------*/

type FriendListCtx = {
  listFilter: Filter,
  setFilter: (f: Filter) => any
}

const FriendListCtx = createContext<
  FriendListCtx | null
>(null)

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const containerCss = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',

  height: '100%',
  minWidth: 250,
  maxWidth: 300,
  width: 250,

  background: '$bg300',

  marginRight: 2
}

const ChatList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flexGrow: '1',
  gap: 2,
  padding: 10
})

// -> Actions
// ----------

const ActionsRoot = styled('div', {
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gap: 2,
  padding: 2,

  background: '$bg500',
  height: 50,
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

  [`& ${Icon}`]: { },

  '&:hover': { background: '$bg300' },

  variants: {
    active: {
      true: { background: '$bg300' }
    }
  }
})

// -> Relationships
// ----------------

const Relationship = styled('div', {
  marginBottom: 16,
  //paddingRight: 20,

  overflow: 'hidden',

  [`& > ${Flexbox}`]: {
    marginTop: 10,
    transition: 'height 150ms ease',
  },

  variants: {
    hide: {
      true: { [`& > ${Flexbox}`]: { height: 0 } }
    }
  }
})

const RelationshipTitle = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 7,

  cursor: 'pointer',

  [`& ${Icon}`]: {}
})

export default FriendList

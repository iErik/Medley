import { useSelector } from '@store'
import type { UserRelationshipType } from '@store/user'

export function useSelf() {
  const self = useSelector(state => state.user.self)
  return self
}

export function useUser(userId: string, serverId?: string) {
  const user = useSelector(state =>
    state.user.users[userId])

  const memberId = serverId ? `${serverId}-${userId}` : null
  const member = memberId
    ? useSelector(state => state.user.members[memberId])
    : null

  if (!user) return { user: null, member: null }

  return {
    user,
    member
  }
}

export function useRelationship(type: UserRelationshipType) {
  const users = useSelector(state => state.user.users)
  const relationship = useSelector(state =>
    state.user.relationships[type])

  return (relationship || []).map(userId => users[userId])
}

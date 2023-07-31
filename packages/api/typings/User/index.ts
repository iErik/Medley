import type { Asset } from "../Common"

export enum RelationshipType {
  None         = 'None',
  User         = 'User',
  Friend       = 'Friend',
  Outgoing     = 'Outgoing',
  Incoming     = 'Incoming',
  Blocked      = 'Blocked',
  BlockedOther = 'BlockedOther',
}

export enum UserPresence {
  Online    = 'Online',
  Idle      = 'Idle',
  Focus     = 'Focus',
  Busy      = 'Busy',
  Invisible = 'Invisible'
}

export type UserRelation = {
  _id: string
  status: RelationshipType
}

export type UserStatus = {
  text: string
  presence: UserPresence
}

export type UserProfile = {
  content: string
  background: Asset
}

export type RevoltUser = {
  _id: string
  username: string
  discriminator: string
  display_name: string | null
  avatar: Asset | null
  relations: UserRelation[] | null
  badges: number | null
  status: UserStatus | null
  profile: UserProfile | null
  flags: number | null
  privileged: boolean
  bot: { owner: string } | null
  relationship: RelationshipType | null
  online: boolean | null
}

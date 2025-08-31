import {
  type Common,
  User as ApiUser
} from '@packages/api'


export interface Asset extends Common.Asset {
  src: string | null
}

export type User = {
  id: string
  displayName: string | null
  discriminator: string | null
  status: ApiUser.UserStatus | null
  username: string | null
  avatar: string | null
  relationship: ApiUser.RelationshipType
}

import {
  type Common,
  User as ApiUser
} from '@ierik/revolt'


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

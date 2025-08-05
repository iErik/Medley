import type { Asset } from '@/types/Common'

export type ServerCategory = {
  id: string
  title: string
  channels: string[]
}

export type ServerSystemMessages = {
  user_joined: string
  user_left: string
  user_kicked: string
  user_banned: string
}

export type ServerRolePermissions = {
  [key: string]: number
}

export type ServerRole = {
  name: string
  permissions: ServerRolePermissions
  colour: string
  hoist: boolean
  rank: number
}

export type RevoltServer = {
  _id: string
  owner: string
  name: string
  description?: string | null

  channels: string[]
  categories?: ServerCategory[] | null

  system_messages?: ServerSystemMessages | null
  roles: { [key: string]: ServerRole }
  default_permissions: number
  icon?: Asset | null
  banner?: Asset | null
  flags: number
  nsfw: boolean
  analytics: boolean
  discoverable: boolean
}

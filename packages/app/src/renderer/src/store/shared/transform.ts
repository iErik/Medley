import {
  type Common,
  User as APIUser,
  getAssetUrl
} from '@ierik/revolt'

import type { User, Asset } from './types'

import { delta } from '@/revolt'



export const getUserAvatar = (
  user: APIUser.RevoltUser
): string =>
  getAssetUrl(
    user?.avatar?.tag || '',
    user?.avatar?._id || '')

export const mapUser = (
  user: APIUser.RevoltUser
): User => ({
  id: user._id,
  displayName: user?.display_name || null,
  discriminator: user?.discriminator,
  status: user?.status || null,
  username: user?.username,
  relationship: user.relationship,
  avatar:  user?.avatar?._id
    ? getUserAvatar(user)
    : delta.users.getDefaultAvatarUrl(user._id)
})

export const mapAsset = (
  asset?: Common.Asset
): Asset | null => asset
  ? ({ ...asset, src: getAssetUrl(asset.tag, asset._id) })
  : null

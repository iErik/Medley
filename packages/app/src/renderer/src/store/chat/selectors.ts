import { createSelector } from '@reduxjs/toolkit'

import { type RootState } from '@store'
import { isDirect } from './helpers'
import { type DirectChannel } from './types'
import {
  type User,
  type Self
} from '@store/user'


export type DMsWithUsers = DirectChannel & {
  userId: string
  user: User | Self
}

type DMsWithMaybeUsers = DirectChannel & {
  userId?: string | null
  user: User | Self | null
}


export const selectDMs = createSelector(
  [ (state: RootState) => state.chat.channels ],
  (channels) => Object
    .values(channels)
    .filter(isDirect))

export const selectActiveDMs = createSelector(
  [ selectDMs ],
  (channels) => channels.filter(c => c.active))


export const selectDMsWithUsers = createSelector(
  [
    selectActiveDMs,
    (state: RootState) => state.user.users,
    (state: RootState) => state.user.self.id
  ],
  (channels, users, selfId) => channels
    .map((c): DMsWithMaybeUsers => {
      const userId = c.recipients.find(r => r !== selfId)

      return {
        ...c,
        userId,
        user: userId ? users[userId] : null
      }
    })
    .filter((c): c is DMsWithUsers =>
      !!c.user && !!c.userId))


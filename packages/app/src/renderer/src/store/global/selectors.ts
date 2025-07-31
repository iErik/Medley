import { type RootState, useSelector } from '@store'

export const selectEmojiPack = (state: RootState) =>
  state.global.settings.emojiPack


export function useEmojiPack() {
  return useSelector(selectEmojiPack)
}

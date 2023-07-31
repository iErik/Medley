export type RevoltEmoji = {
  _id: string
  parent: { type: 'Server', id: string }
  creator_id: string
  name: string
  animated: boolean
  nsfw: boolean
}

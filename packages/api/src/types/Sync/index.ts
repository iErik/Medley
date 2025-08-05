export type ChannelUnread = {
  /* Composite primary key consisting of channel and user id
   */
  _id: {
    /* Channel ID
     */
    channel: string

    /* User ID
     */
    user: string
  }
  /* Id of the last message read in this channel by a user
   */
  last_id?: string | null

  /* Array of message ids that mention the user
   */
  mentions?: string[]
}

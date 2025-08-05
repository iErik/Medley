import { useParams } from 'react-router'
import { styled } from '@stitched'

import { useChannel } from '@store/chat'



export default function ChatHeader() {
  const { channelId } = useParams()
  const channel = useChannel(channelId || '')

  return (
    <>
    </>
  )
}

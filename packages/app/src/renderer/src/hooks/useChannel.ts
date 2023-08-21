import { useSelector } from '@store'

const useChannel = (channelId: string) => {
  const channels = useSelector(state => state.chat.servers
    .flatMap(g => g.categories)
    .flatMap(c => c.channels))

  const channel = channels.find(channel =>
    channel._id === channelId)

  return channel
}

export default useChannel

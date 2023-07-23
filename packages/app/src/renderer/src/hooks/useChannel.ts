import { useSelector } from '@store'

const useChannel = (channelId: string) => {
  const channels = useSelector(state => state.chat.guilds
    .flatMap(g => g.categories)
    .flatMap(c => c.children))

  const channel = channels.find(channel =>
    channel.id === channelId)

  return channel
}

export default useChannel

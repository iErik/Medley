import { useSelector } from '@store'

const useChannel = (channelId: string) => {
  const channel = useSelector(state => state.chat.channels
    ?.find(channel => channel._id === channelId))

  return channel
}

export default useChannel

import { useSelector } from '@store'

const useRole = (roleId: string) => {
  const activeChannel = useSelector(state =>
    state.chat.activeChannel)
  const { guildId } = activeChannel || {}

  if (!guildId) return null

  const guild = useSelector(state =>
    state.chat.guilds.find(g => g?.id === guildId))
  const role = guild?.roles?.find(r => r?.id === roleId)

  return role
}

export default useRole

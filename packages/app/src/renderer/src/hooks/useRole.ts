import { useSelector } from '@store'

const useRole = (roleId: string) => {
  const activeServer = useSelector(state =>
    state.chat.activeServer)

  if (!activeServer) return null

  const guild = useSelector(state =>
    state.chat.servers.find(g => g?._id === activeServer))
  const role = (guild?.roles || {})[roleId]

  return role
}

export default useRole

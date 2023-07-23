import { useSelector } from '@store'
import { useAction } from '@hooks'
import { actions } from '@store/global'

const useUser = (userId: string) => {
  const requestUser = useAction(actions.fetchUser)
  const user = useSelector(state =>
    state.global.userMentions?.find(u => u.id === userId))

  if (!user) requestUser(userId)

  return user
}


export default useUser

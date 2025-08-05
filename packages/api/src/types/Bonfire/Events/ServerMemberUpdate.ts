import { RevoltMember } from '@/types/User'

type UserClearFieldType = 'Nickname' | 'Avatar'

export type ServerMemberUpdate = {
  type: 'ServerMemberUpdate'

  /* Composite key containing the Server ID and the User ID
   */
  id: {
    /* Server ID */
    server: string
    /* User ID */
    user: string
  }

  /* Partial Server Member Object */
  data: Partial<RevoltMember>

  /* Fields to remove */
  clear: UserClearFieldType[]
}

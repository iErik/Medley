import http from '@utils/http'

import type {
  ClientContext,
  ContextSetter
} from '@/types/Client'

import type { ServiceReturn } from '@/types/Delta'
import type {
  RevoltUser,
  UserProfile,
  UserStatus,
  FieldsUser
} from '@/types/User'

import type {
  RevoltChannel
} from '@/types/Chat'

// -> Types
// --------

type SetUserParams = {
  display_name: string | null
  avatar: string | null
  status: UserStatus | null
  profile: {
    content: string | null
    background: string | null
  } | null
  badges: number | null
  flags: number | null
  remove: FieldsUser
}

type SetUsernameParams = {
  username: string
  password: string
}

// -> Module definition
// --------------------

const DeltaUsers = (
  _: ClientContext,
  __: ContextSetter
) => {
  /**
   * Retrieve a user's information
   */
  const getUser = async (
    userId: string
  ): ServiceReturn<RevoltUser> => {
    const [ err, data ] = await http.get(`users/${userId}`)
    return [ err, data ]
  }

  /**
   * Retrieve information from the currently authenticated user.
   */
  const getSelf = async (): ServiceReturn<RevoltUser> => {
    const [ err, data ] = await http.get('users/@me')
    return [ err, data ]
  }

  /**
   * Retrieve a user's flags.
   */
  const getUserFlags = async (
    userId: string
  ): ServiceReturn<{ flags: number }> => {
    const [ err, data ] = await http.get(`users/${userId}/flags`)
    return [ err, data ]
  }

  /**
   * This returns a default avatar based on the given id.
   */
  const getDefaultAvatar = async (
    userId: string
  ): ServiceReturn<string> => {
    const [ err, data ] = await http
      .get(`users/${userId}/default_avatar`)

    return [ err, data ]
  }

  // TODO: Refactor
  const getDefaultAvatarUrl = (userId: string): string => {
    return `${http.baseApi()}/users/${userId}/default_avatar`
  }

  /**
   * Retrieve a user's profile data.
   * Will fail if you do not have permission to access the other
   * user's profile.
   */
  const getUserProfile = async (
    userId: string
  ): ServiceReturn<UserProfile> => {
    const [ err, data ] = await http
      .get(`users/${userId}/profile`)

    return [ err, data ]
  }

  /**
   * Edit currently authenticated user.
   */
  const setUser = async (
    userId: string,
    params: SetUserParams
  ): ServiceReturn<RevoltUser> => {
    const [ err, data ] = await http
      .patch(`users/${userId}`, params)

    return [ err, data ]
  }

  /**
   * Changes the username of the currently authenticated
   * user.
   */
  const setUsername = async (
    params: SetUsernameParams
  ): ServiceReturn<UserProfile> => {
    const [ err, data ] = await http
      .patch('users/@me/username', params)

    return [ err, data ]
  }

  /**
   * Open a DM with another user.
   * If the target is oneself, a saved messages channel is
   * returned.
   */
  const dmUser = async (
    userId: string
  ): ServiceReturn<RevoltChannel> => {
    const [ err, data ] = await http
      .get(`/users/${userId}/dm`)

    return [ err, data ]
  }

  return {
    getUser,
    getSelf,
    getUserFlags,
    getDefaultAvatar,
    getDefaultAvatarUrl,
    getUserProfile,
    setUser,
    setUsername,
    dmUser
  }
}

export default DeltaUsers

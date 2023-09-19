import http from '@utils/http'
import { withQueryParams } from '@utils/queryParams'

import type {
  ClientContext,
  ContextSetter
} from '@root/typings/Client'

import type { Asset } from '@typings/Common'
import type { ServiceReturn } from '@typings/Delta'
import type { ChannelInvite } from '@typings/Chat'
import { RevoltUser, RevoltMember } from '@typings/User'

// -> Types
// --------

type MembersReturn = {
  members: RevoltMember[]
  users: RevoltUser[]
}

type BanUserReturn = {
  /**
   * Composite primary key consisting of server and user id
   */
  id: {
    server: string
    user: string
  }

  /**
   * Reason for ban creating
   */
  reason?: string | null
}

type GetBansReturn = {
  /**
   * Users objects
   */
  users: Array<{

    /**
     * ID of the banned user
     */
    _id: string

    /**
     * Username of the banned user
     */
    username: string

    avatar?: Asset | null
  }>

  /**
   * Ban objects
   */
  bans: Array<{
    /**
     * Composite primary key consisting of server and user ID
     */
    _id: { server: string, user: string }

    /**
     * Reason for ban creating
     */
    reason?: string | null
  }>
}

type EditMemberParams = {
  /**
   * Member nickname
   */
  nickname?: string | null

  /**
   * Attachment ID to set for avatar
   */
  avatar?: string | null

  /**
   * Array of role IDs
   */
  roles?: string[] | null

  /**
   * ISO8601 formatted timestamp
   */
  timeout?: string | null

  /**
   * Fields to remove from channel object
   */
  remove?: 'Nickname' | 'Avatar' | 'Roles' | 'Timeout'
}

// -> Module definition
// --------------------

const DeltaServers = (
  _: ClientContext,
  __: ContextSetter
) => {
  /**
   * Fetches all server members.
   *
   * @param queryParams.exclude_offline: Whether to exclude
   * offline users
   */
  const getMembers = async (
    serverId: string,
    queryParams?: { exclude_offline: boolean }
  ): ServiceReturn<MembersReturn> => {
    const [ err, data ] = await http.get(withQueryParams(
      `servers/${serverId}/members`, queryParams || {}))

    return [ err, data ]
  }

  /**
   * Retrieves a single member
   */
  const getMember = async (
    serverId: string,
    memberId: string
  ): ServiceReturn<RevoltMember> => {
    const [ err, data ] = await http
      .get(`servers/${serverId}/members/${memberId}`)

    return [ err, data ]
  }

  /**
   * Removes a member from the server
   */
  const kickMember = async (
    serverId: string,
    memberId: string
  ): ServiceReturn<null> => {
    const [ err, data ] = await http
      .delete(`servers/${serverId}/members/${memberId}`)
    return [ err, data ]
  }

  /**
   * Edits a member by their ID.
   */
  const editMember = async (
    serverId: string,
    memberId: string,
    params: EditMemberParams
  ): ServiceReturn<RevoltMember> => {
    const [ err, data ] = await http.patch(
      `servers/${serverId}/members/${memberId}`,
      params)

    return [ err, data ]
  }

  /**
   * Ban an user by their ID.
   */
  const banUser = async (
    serverId: string,
    memberId: string,
    reason: string
  ): ServiceReturn<BanUserReturn> => {
    const [ err, data ] = await http
      .put(`servers/${serverId}/bans/${memberId}`, { reason })

    return [ err, data ]
  }

  /**
   * Removes an user's ban.
   */
  const unbanUser = async (
    serverId: string,
    memberId: string
  ): ServiceReturn<null> => {
    const [ err, data ] = await http
      .delete(`servers/${serverId}/bans/${memberId}`)

    return [ err, data ]
  }

  /**
   * Fetches all bans on a server.
   */
  const getBans = async (
    serverId: string
  ): ServiceReturn<GetBansReturn> => {
    const [ err, data ] = await http
      .get(`servers/${serverId}/bans`)

    return [ err, data ]
  }

  /**
   * Fetches all server invites.
   */
  const getInvites = async (
    serverId: string
  ): ServiceReturn<Array<ChannelInvite>> => {
    const [ err, data ] = await http
      .get(`servers/${serverId}/invites`)

    return [ err, data ]
  }

  return {
    getMembers,
    getMember,
    kickMember,
    editMember,
    banUser,
    unbanUser,
    getBans,
    getInvites
  }
}

export default DeltaServers

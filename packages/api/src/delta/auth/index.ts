import http from '@utils/http'

import type {
  ClientContext,
  ContextSetter
} from '@/types/Client'

import { ServiceReturn } from '@/types/Delta'

// -> Module Enums
// ---------------

export const MFAMethods = {
  Password: 'Password',
  Recovery: 'Recovery',
  Totp: 'Totp'
} as const

export type MFAMethod = keyof typeof MFAMethods

// -> Types
// --------

export type MFAResponse = {
  result: 'MFA'
  ticket: string
  allowed_methods: MFAMethod[]
}

export type LoginResponse = {
  result: 'Success'

  /**
   * Unique id (of the session?)
   */
  id: string

  /**
   * The id of the user
   */
  user_id: string

  /**
   * Session's authentication token
   */
  token: string

  /**
   * User's display name
   */
  name: string

  /**
   * Web Push subscription
   */
  subscription: null | {
    endpoint: string
    p256dh: string
    auth: string
  }
}

export type DisabledResponse = {
  result: 'Disabled'
  user_id: string
}

export type AuthenticationData
  = MFAResponse
  | LoginResponse
  | DisabledResponse


export interface LoginParams {
  email: string
  password: string
  friendly_name?: string | null
}

export type MFAParams = {
  mfa_ticket: string
  mfa_response:
    { password: string } |
    { totp_code: string } |
    { recovery_code: string }
  friendly_name?: string | null
}

// -> Module definition
// --------------------

const DeltaAuth = (
  _: ClientContext,
  setContext: ContextSetter,
) => {
  const setLoginData = (data: AuthenticationData) => Object
    .entries(data)
    .forEach(([ key, value ]) =>
      localStorage.setItem(key, JSON.stringify(value)))

  const login = async (
    params: LoginParams | MFAParams
  ): ServiceReturn<AuthenticationData> => {
    const [ err, data ] = await http
      .post('/auth/session/login', params)

    if (data?.token) {
      setContext({ token: data.token })
      setLoginData(data)
    }

    return [ err, data ]
  }

  return {
    login
  }
}

export default DeltaAuth

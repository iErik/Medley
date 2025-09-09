import type { RevoltError } from '@/types/Error'

// -> Authentication
// -----------------

export type UserCredentials = {
  email: string
  password: string
}

// -> General
// ----------

export type GenericServiceError =
  RevoltError | Error | Response | boolean | null

export type ServiceReturn = [
  GenericServiceError,
  any
]

export type ApiMethod = 'post' | 'get' | 'delete'

export type ApiFn = {
  [method in ApiMethod]: Function
}

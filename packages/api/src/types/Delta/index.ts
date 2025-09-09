import type { RevoltError } from '@/types/Error'

export type ServiceError =
  RevoltError | Error | Response | boolean | null

export type ServiceReturn<
  ReturnType = any,
  ErrorType = ServiceError
> = Promise<[
  ErrorType,
  ReturnType
]>

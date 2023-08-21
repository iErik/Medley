
export type ServiceError =
  Error | Response | boolean | null

export type ServiceReturn<ReturnType = any> = Promise<[
  ServiceError,
  ReturnType
]>

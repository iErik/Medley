import type {
  ErrorType,
  SimpleErrorType,
  CompoundErrors
} from './errorType'



export interface BaseError<Type extends ErrorType> {
  type: Type
  location: string
}

export interface TooManyPendingFriendRequests
  extends BaseError<
    CompoundErrors['TooManyPendingFriendRequests']
  >
{
  max: number
}

export interface TooManyAttachments
  extends BaseError<CompoundErrors['TooManyAttachments']>
{
  max: number
}

export interface TooManyEmbeds
  extends BaseError<CompoundErrors['TooManyEmbeds']>
{
  max: number
}

export interface TooManyReplies
  extends BaseError<CompoundErrors['TooManyReplies']>
{
  max: number
}

export interface TooManyChannels
  extends BaseError<CompoundErrors['TooManyChannels']>
{
  max: number
}

export interface GroupTooLarge
  extends BaseError<CompoundErrors['GroupTooLarge']>
{
  max: number
}

export interface TooManyServers
  extends BaseError<CompoundErrors['TooManyServers']>
{
  max: number
}

export interface TooManyEmoji
  extends BaseError<CompoundErrors['TooManyEmoji']>
{
  max: number
}

export interface TooManyRoles
  extends BaseError<CompoundErrors['TooManyRoles']>
{
  max: number
}

export interface MissingPermission
  extends BaseError<CompoundErrors['MissingPermission']>
{
  permission: string
}

export interface MissingUserPermission
  extends BaseError<CompoundErrors['MissingUserPermission']>
{
  permission: string
}

export interface DatabaseError
  extends BaseError<CompoundErrors['DatabaseError']>
{
  operation: string
  collection: string
}

export interface FailedValidation
  extends BaseError<CompoundErrors['FailedValidation']>
{
  error: string
}

export interface FileTooLarge
  extends BaseError<CompoundErrors['FileTooLarge']>
{
  max: number
}

export interface FeatureDisabled
  extends BaseError<CompoundErrors['FeatureDisabled']>
{
  feature: string
}

export interface GenericError
  extends BaseError<SimpleErrorType> { }



export type RevoltError
  = GenericError
  | TooManyPendingFriendRequests
  | TooManyAttachments
  | TooManyEmbeds
  | TooManyReplies
  | TooManyChannels
  | GroupTooLarge
  | TooManyServers
  | TooManyEmoji
  | TooManyRoles
  | MissingPermission
  | MissingUserPermission
  | DatabaseError
  | FailedValidation
  | FileTooLarge
  | FeatureDisabled


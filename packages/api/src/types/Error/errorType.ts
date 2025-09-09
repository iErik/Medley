// Error types that have no additional payload with them,
// only a type and location attributes
const SimpleErrorsEnum = {
  // This error was not labeled :(
  LabelMe: 'LabelMe',

  // Onboarding related errors
  AlreadyOnboarded: 'AlreadyOnboarded',

  // User related errors
  UsernameTaken: 'UsernameTaken',
  InvalidUsername: 'InvalidUsername',
  DiscriminatorChangeRatelimited:
    'DiscriminatorChangeRatelimited',
  UnknownUser: 'UnknownUser',
  AlreadyFriends: 'AlreadyFriends',
  AlreadySentRequest: 'AlreadySentRequest',
  Blocked: 'Blocked',
  BlockedByOther: 'BlockedByOther',
  NotFriends: 'NotFriends',

  // Channel related errors
  UnknownChannel: 'UnknownChannel',
  UnknownAttachments: 'UnknownAttachments',
  UnknownMessage: 'UnknownMessage',
  CannotEditMessage: 'CannotEditMessage',
  CannotJoinCall: 'CannotJoinCall',
  EmptyMessage: 'EmptyMessage',
  PayloadTooLarge: 'PayloadTooLarge',
  CannotRemoveYourself: 'CannotRemoveYourself',
  AlreadyInGroup: 'AlreadyInGroup',
  NotInGroup: 'NotInGroup',
  AlreadyPinned: 'AlreadyPinned',
  NotPinned: 'NotPinned',

  // Server related errors
  UnknownServer: 'UnknownServer',
  InvalidRole: 'InvalidRole',
  Banned: 'Banned',
  AlreadyInServer: 'AlreadyInServer',
  CannotTimeoutYourself: 'CannotTimeoutYourself',

  // Bot related errors
  ReachedMaximumBots: 'ReachedMaximumBots',
  IsBot: 'IsBot',
  IsNotBot: 'IsNotBot',
  BotIsPrivate: 'BotIsPrivate',

  // User safety related errors
  CannotReportYourself: 'CannotReportYourself',

  // Permission related errors
  NotElevated: 'NotElevated',
  NotPrivileged: 'NotPrivileged',
  CannotGiveMissingPermissions:
    'CannotGiveMissingPermissions',
  NotOwner: 'NotOwner',

  // General errors
  InternalError: 'InternalError',
  InvalidOperation: 'InvalidOperation',
  InvalidCredentials: 'InvalidCredentials',
  InvalidProperty: 'InvalidProperty',
  InvalidSession: 'InvalidSession',
  InvalidFlagValue: 'InvalidFlagValue',
  NotAuthenticated: 'NotAuthenticated',
  DuplicateNonce: 'DuplicateNonce',
  NotFound: 'NotFound',
  NoEffect: 'NoEffect',

  // Micro-service errors
  ProxyError: 'ProxyError',
  FileTooSmall: 'FileTooSmall',
  FileTypeNotAllowed: 'FileTypeNotAllowed',
  ImageProcessingFailed: 'ImageProcessingFailed',
  NoEmbedData: 'NoEmbedData',

  // Legacy errors
  VosoUnavailable: 'VosoUnavailable',
} as const

// Error types that carry additional payload with them
const CompoundErrorsEnum = {
  // User related errors
  TooManyPendingFriendRequests:
    'TooManyPendingFriendRequests',

  // Channel related errors
  TooManyAttachments: 'TooManyAttachments',
  TooManyEmbeds: 'TooManyEmbeds',
  TooManyReplies: 'TooManyReplies',
  TooManyChannels: 'TooManyChannels',
  GroupTooLarge: 'GroupTooLarge',

  // Server related errors
  TooManyServers: 'TooManyServers',
  TooManyEmoji: 'TooManyEmoji',
  TooManyRoles: 'TooManyRoles',

  // Permission related errors
  MissingPermission: 'MissingPermission',
  MissingUserPermission: 'MissingUserPermission',

  // General errors
  DatabaseError: 'DatabaseError',
  FailedValidation: 'FailedValidation',

  // Micro-service errors
  FileTooLarge: 'FileTooLarge',

  // Legacy errors
  FeatureDisabled: 'FeatureDisabled',
} as const


export type CompoundErrorKey =
  keyof typeof CompoundErrorsEnum
export type CompoundErrors = typeof CompoundErrorsEnum
export type CompoundErrorType =
  typeof CompoundErrorsEnum[CompoundErrorKey]

export type SimpleErrorKey = keyof typeof SimpleErrorsEnum
export type SimpleErrors = typeof SimpleErrorsEnum
export type SimpleErrorType =
  typeof SimpleErrorsEnum[SimpleErrorKey]

export type ErrorType = CompoundErrorType | SimpleErrorType

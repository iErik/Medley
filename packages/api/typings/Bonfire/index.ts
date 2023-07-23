// -> Enums
// --------

export enum ClientEvent {
  Authenticate = 'Authenticate',
  BeginTyping  = 'BeginTyping',
  EndTyping    = 'EndTyping',
  Ping         = 'Ping',
}

export enum ServerEvent {
  Error         = 'Error',
  Authenticated = 'Authenticated',
  Bulk          = 'Bulk',
  Pong          = 'Pong',
  Ready         = 'Ready',

  Message               = 'Message',
  MessageUpdate         = 'MessageUpdate',
  MessageAppend         = 'MessageAppend',
  MessageDelete         = 'MessageDelete',
  MessageReact          = 'MessageReact',
  MessageUnreact        = 'MessageUnreact',
  MessageRemoveReaction = 'MessageRemoveReaction',

  ChannelCreate      = 'ChannelCreate',
  ChannelUpdate      = 'ChannelUpdate',
  ChannelDelete      = 'ChannelDelete',
  ChannelGroupJoin   = 'ChannelGroupJoin',
  ChannelGroupLeave  = 'ChannelGroupLeave',
  ChannelStartTyping = 'ChannelStartTyping',
  ChannelStopTyping  = 'ChannelStopTyping',
  ChannelAck         = 'ChannelAck',

  ServerCreate = 'ServerCreate',
  ServerUpdate = 'ServerUpdate',
  ServerDelete = 'ServerDelete',

  ServerMemberUpdate = 'ServerMemberUpdate',
  ServerMemberJoin   = 'ServerMemberJoin',
  ServerMemberLeave  = 'ServerMemberLeave',

  ServerRoleUpdate = 'ServerRoleUpdate',
  ServerRoleDelete = 'ServerRoleDelete',

  UserUpdate       = 'UserUpdate',
  UserRelationship = 'UserRelationship',
  UserPlatformWipe = 'UserPlatformWipe',

  EmojiCreate = 'EmojiCreate',
  EmojiDelete = 'EmojiDelete',

  Auth = 'Auth',
}

// -> Types
// --------

export type BonfireEvent = {
  type: ServerEvent | ClientEvent
  [key: string]: any
}

export type BonfireListener =
  ((...args: any) => any) | Function

import { Chat } from '@ierik/revolt'
import { useEmojiPack } from '@store/global'
import { useRole, useChannel, useUser } from '@store/chat'


import {
  emojiDictionary,
  mkEmojiHref
} from './emojiMap'

import {
  Bold,
  Italics,
  Strike,
  Normal,
  Spoiler,
  Role,
  Mention,
  Channel,
} from './elements'

// const ENV = __APP_ENV__

// -> Types
// --------

enum TokenType {
  Emoji   = 'EMOJI',
  Text    = 'TEXT',
  Role    = 'ROLE',
  Mention = 'MENTION',
  Channel = 'CHANNEL'
}

type ProtoToken = { kind: TokenType }

interface MentionToken extends ProtoToken {
  exists: boolean
  loading: boolean
  name: string
  avatar: string
  banner: string
  kind: TokenType.Mention
}

interface RoleToken extends ProtoToken {
  roleId: string
  name: string
  color: string
  exists: boolean
  kind: TokenType.Role
}

interface ChannelToken extends ProtoToken {
  channelId: string
  serverId: string
  name: string
  type: Chat.ChannelType | null
  exists: boolean
  unread: boolean
  kind: TokenType.Channel
}

interface TextToken extends ProtoToken {
  content: string
  italics: boolean
  bold: boolean
  spoiler: boolean
  strike: boolean
  kind: TokenType.Text
}

interface EmojiToken extends ProtoToken {
  id: string
  jumboable: boolean
  src: string
  size: number
  kind: TokenType.Emoji
}

type Token =
  TextToken
  | EmojiToken
  | ChannelToken
  | RoleToken
  | MentionToken

type ExtractorOptions = {
  preserveTokens?: boolean
  origin?: string[]
}

// -> Regular expressions
// ----------------------

export const emojiRegex = ':\\w+:'
export const roleRegex = '<@&\\d+>'
export const mentionRegex = '<@.+>'
//export const channelRegex = '<#([A-Z0-9])+>'
export const channelRegex = '<#.+>'

// -> Text Regexes
// ---------------

export const italicsRegex = (
  captureTokens: boolean = false,
  captureMatch: boolean = false,
) => [
  `(?<!\\*)`,
  captureTokens ? '(' : '(?:',
  `\\*{5}|\\*{3}|\\*{1})`,
  captureMatch ? '(' : '',
  `[\\w\\s'"-]+`,
  captureMatch ? ')' : '',
  `(?<!\\*)`,
  captureTokens ? '(' : '(?:',
  `\\*{5}|\\*{3}|\\*{1})`
].join('')

export const boldRegex = (
  captureTokens: boolean = false,
  captureMatch: boolean = false,
) => [
  captureTokens ? '(' : '(?:',
  `\\*{2,4})`,
  captureMatch ? '(' : '',
  `[\\w\\s'"-]+`,
  captureMatch ? ')' : '',
  captureTokens ? '(' : '(?:',
  `\\*{2,4})`,
].join('')

export const spoilerRegex = (
  captureTokens: boolean = false,
  captureMatch: boolean = false
) => [
  captureTokens ? '(' : '(?:',
  `\\|{2})`,
  captureMatch ? '(' : '',
  `[\\w\\s]+`,
  captureMatch ? ')' : '',
  captureTokens ? '(' : '(?:',
  `\\|{2})`
].join('')

export const strikeRegex = (
  captureTokens: boolean = false,
  captureMatch: boolean = false,
) => [
  captureTokens ? '(' : '(?:',
  `~{2})`,
  captureMatch ? '(' : '',
  `[\\w\\s]+`,
  captureMatch ? ')' : '',
  captureTokens ? '(' : '(?:',
  `~{2})`,
].join('')

export const regexUnion = new RegExp([
  `(${emojiRegex}`,
  `|${roleRegex}`,
  `|${mentionRegex}`,
  `|${channelRegex}`,
  `|${italicsRegex()}`,
  `|${boldRegex()}`,
  `|${strikeRegex()}`,
  `|${spoilerRegex()})`
].join(''), 'g')

// -> Token Extractors
// -------------------

// TODO: Fetch emoji pack setting from global store state
// TODO: Only use gif when window is focused
export const emojiExtractor = (
  token: string,
  { origin = [] }: ExtractorOptions = {}
): EmojiToken =>  {
  const isEmojiToken = (token: string): boolean => {
    const regex = new RegExp(emojiRegex, 'g')
    return regex.test(token)
  }

  const emojiPack = useEmojiPack()
  const id = token.replace(/:/g, '')
  const jumboable = origin.every(isEmojiToken)
  const src =  id in emojiDictionary
    ? mkEmojiHref(emojiPack, id)
    : `https://autumn.revolt.chat/emojis/${id}`

  const size = jumboable ? 60 : 22

  return {
    id,
    jumboable,
    src,
    size,
    kind: TokenType.Emoji as TokenType.Emoji,
  }
}

export const clearTextTokens = (token: string) => {
  const replace = (regex: RegExp, target: string) => target
    .replace(regex, (_, match: string) => match)

  const testAndReplace = (
    regexStr: string,
    target: string
  ) => {
    const regex = new RegExp(regexStr, 'g')

    return regex.test(target)
      ? replace(regex, target)
      : target
  }

  const clear = (list: string[]) => list.reduce(
    (acc, string) => testAndReplace(string, acc), token)

  return clear([
    boldRegex(false, true),
    strikeRegex(false, true),
    italicsRegex(false, true),
    spoilerRegex(false, true)
  ])
}

export const textExtractor = (
  token: string,
  { preserveTokens = false }: ExtractorOptions = {}
): TextToken => ({
  content: preserveTokens ? token :clearTextTokens(token),
  italics: !!token.match(italicsRegex()),
  spoiler: !!token.match(spoilerRegex()),
  strike:  !!token.match(strikeRegex()),
  bold:    !!token.match(boldRegex()),
  kind:    TokenType.Text as TokenType.Text
})

export const roleExtractor = (token: string): RoleToken => {
  const roleId = token.replace(/\D+/g, '')
  const role = useRole(roleId)

  return {
    roleId,
    exists: !!role,
    name: role?.name || '',
    color: role?.colour || '',
    kind: TokenType.Role
  }
}

export const mentionExtractor = (token: string): MentionToken => {
  const userId = token.match(/([A-Z0-9])+/)?.[0] || ''
  const user = useUser(userId)

  return {
    exists: !user?.loading && !!user?.id,
    loading: !!user?.loading,
    name: user?.user?.username || '',
    avatar: user?.user?.avatar?.src || '',
    banner: user?.user?.profile?.background?.src || '',
    kind: TokenType.Mention
  }
}

export const channelExtractor = (token: string): ChannelToken => {
  const channelId = token.match(/([A-Z0-9])+/)?.[0] || ''
  const channel = useChannel(channelId)

  return {
    channelId,
    exists: !!channel?._id,
    serverId: channel?.server || '',
    name: channel?.name || '',
    type: channel?.channel_type || null,
    unread: !!channel?.unread,
    kind: TokenType.Channel
  }
}

export const extractorMap = {
  [roleRegex]:    roleExtractor,
  [emojiRegex]:   emojiExtractor,
  [mentionRegex]: mentionExtractor,
  [channelRegex]: channelExtractor
}

export const extractToken = (
  token: string,
  options: ExtractorOptions = {}
): Token => {
  const extractor = Object.entries(extractorMap)
    .find(([ key ]) => {
      const regex = new RegExp(key, 'g')
      return regex.test(token)
    })?.[1] || textExtractor

  return extractor(token, options)
}

export const extractTokens = (
  contents: string,
  options: ExtractorOptions = {}
): Token[] =>
  contents
    .split(regexUnion)
    .filter(token => !!token)
    .map((token: string, _, origin: string[]) =>
      extractToken(token, { ...options, origin }))

// -> Parsers
// -----------

const textTypeMap = {
  bold:    Bold,
  italics: Italics,
  spoiler: Spoiler,
  strike:  Strike
}

const parseText = (token: TextToken) => Object
  .entries(textTypeMap)
  .reduce((acc, [ key, Component ]) =>
    token[key as keyof TextToken]
      ? <Component>{ acc }</Component>
      : acc,
    <Normal key={token.content}>
      { token.content }
    </Normal>)

const randomStr = () => Math.floor(Math.random() * 1000)
  .toString()

const parseEmoji = (token: EmojiToken) =>
  <img
    className="emoji"
    key={token.id + randomStr()}
    src={token.src}
    alt={token.id}
    style={{ width: token.size, height: token.size }}
  />

const parseRole = (token: RoleToken) => token?.exists
  ? <Role> @{ token?.name } </Role>
  : <Role> @Deleted Role </Role>

const parseMention = (token: MentionToken) => token?.loading
  ? <Mention> @Loading... </Mention>
  : <Mention> @{ token?.name } </Mention>

const parseChannel = (token: ChannelToken) => token?.exists
  ? <Channel> #{ token?.name } </Channel>
  : <Channel> #Deleted Channel </Channel>

const parserMap: { [key in TokenType]: Function } = {
  [TokenType.Mention]: parseMention,
  [TokenType.Channel]: parseChannel,
  [TokenType.Emoji]:   parseEmoji,
  [TokenType.Text]:    parseText,
  [TokenType.Role]:    parseRole,
}

const parseTokens = (tokens: Token[]) => tokens
  ?.map(token => parserMap[token.kind](token))

/**
 * For now we're only giving support for emojis, in the near
 * future though we probably want to parse different kinds
 * of content such as gifs, stickers, etc
 */
const parseMsg = (message: string) =>
  parseTokens(extractTokens(message))

// -> Exports
// ----------

export default parseMsg

import { call, put, takeEvery } from 'typed-redux-saga'
import { actions, types } from '@store/chat'
import { gateway, chat } from '@ierik/discordance-api'

const { selectChannel } = gateway.send

// -> onSelectChannel
// ------------------

// TODO: Error Handling
type SelectChannelParams = ReduxAction<{
  channelId: string,
  guildId: string
}>

function* onSelectChannel ({ args }: SelectChannelParams) {
  yield* put(actions.setLoadingChannel(true))
  const [ , messages ] = yield* call(
    chat.getMessages,
    { channelId: args.channelId })

  yield* call(selectChannel,
    args?.guildId,
    args?.channelId)

  yield* put(actions.appendMessages(
    messages,
    args.guildId,
    args.channelId))

  yield* put(actions.setActiveChannel(
    args?.channelId,
    args?.guildId))

  yield* put(actions.setLoadingChannel(false))
}

// -> onSendMsg
// ------------

type SendMsgParams = ReduxAction<{
  channelId: string,
  content: string
}>

function* onSendMsg ({ args }: SendMsgParams) {
  const [ , message ] = yield* call(chat.sendMsg, args)

  yield* put(actions.appendMessages(message))
}

export default function* chatSaga () {
  yield* takeEvery(
    types.selectChannel,
    onSelectChannel)

  yield* takeEvery(
    types.sendMsg,
    onSendMsg)
}

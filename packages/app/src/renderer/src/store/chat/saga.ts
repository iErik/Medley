import { call, put, takeLeading, takeLatest } from 'typed-redux-saga'
import { actions, types } from '@store/chat'

import { delta } from '@/revolt'

// -> onSelectChannel
// ------------------

// TODO: Error Handling
type SelectChannelParams = ReduxAction<{
  channelId: string,
  serverId: string
}>

function* onSelectChannel ({ args }: SelectChannelParams) {
  yield* put(actions.setLoadingChannel(true))
  const [ , messages ] = yield* call(
    delta.channels.getMessages, args?.channelId)

  yield* put(actions.appendMessages(
    messages,
    args.serverId,
    args.channelId))

  yield* put(actions.setActiveChannel(
    args?.channelId,
    args?.serverId))

  yield* put(actions.setLoadingChannel(false))
}

// -> onSendMsg
// ------------

type SendMsgParams = ReduxAction<{
  channelId: string,
  content: string
}>

function* onSendMsg ({ args }: SendMsgParams) {
}

export default function* chatSaga () {
  yield* takeLatest(types.selectChannel, onSelectChannel)
}

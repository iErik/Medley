import { call, put, takeLatest } from 'typed-redux-saga'

import { type ReduxAction } from '@utils/redux'
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
  yield* put(actions.setLoadingChannel(
    args.channelId,
    true))

  const [ , data ] = yield* call(
    delta.channels.getMessages,
    args?.channelId,
    { include_users: true })

  yield* put(actions.setFetched(args.channelId, true))

  yield* put(actions.appendMessages(
    data.messages,
    args.channelId,
    args.serverId))

  yield* put(actions.setLoadingChannel(
    args.channelId,
    false))
}


type FetchMessageParams = ReduxAction<{
  channelId: string
}>

function* onFetchMessages({ args }: FetchMessageParams) { }


type FetchPreviousMsgsParams = ReduxAction<{
  channelId: string
}>

function* onFetchPreviousMsgs(
  { args }: FetchPreviousMsgsParams
) {
}


type FetchNewerMsgsParams = ReduxAction<{
  channelId: string
}>

function* onFetchNewerMsgs(
  { args }: FetchNewerMsgsParams
) {
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

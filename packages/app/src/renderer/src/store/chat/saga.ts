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

// -> onSetActiveServer
// --------------------

type SetActiveServerParams = ReduxAction<{
  activeServer: string
}>
function* onSetActiveServer ({ args }: SetActiveServerParams) {
  console.log({ args })
  const [ , data ] = yield* call(
    delta.servers.getMembers,
    args?.activeServer
  )

  yield* put(actions.setMembers(data?.members))
  yield* put(actions.setUsers(data?.users))
}

// -> onSendMsg
// ------------

type SendMsgParams = ReduxAction<{
  channelId: string,
  content: string
}>

function* onSendMsg ({ args }: SendMsgParams) {
}

console.log({ types })

export default function* chatSaga () {
  yield* takeLatest(types.selectChannel, onSelectChannel)
  yield* takeLatest(types.setActiveServer, onSetActiveServer)
}

import { call, put, takeEvery } from 'typed-redux-saga'
import { actions, types } from '@store/chat'

// -> onSelectChannel
// ------------------

// TODO: Error Handling
type SelectChannelParams = ReduxAction<{
  channelId: string,
  guildId: string
}>

function* onSelectChannel ({ args }: SelectChannelParams) {
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
}

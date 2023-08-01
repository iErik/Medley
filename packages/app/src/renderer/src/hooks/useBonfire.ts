import type { ActionSignature } from '@utils/redux'
import { useDispatch } from '@store'
import { bonfire } from '@/revolt'

import { Bonfire } from '@ierik/revolt'

import { bonfireEvents as chatListeners } from '@store/chat'

const useBonfire = () => {
  const dispatch = useDispatch()

  const dispatchAll = (actions: ActionSignature[]) =>
    actions.forEach(action => dispatch(action))

  type EventMap = {
    [key in Bonfire.ServerEvent]?: (...args: any) =>
      ActionSignature[]
  }

  const handlerHoist = (listener: Function) =>
    (data: any) => dispatchAll(listener(data))

  const bindEvents = (eventMap: EventMap) => Object
    .entries(eventMap)
    .forEach(([ eventName, listener ]) =>
      bonfire.onEvent(eventName, handlerHoist(listener)))

  bindEvents(chatListeners)
}

export default useBonfire

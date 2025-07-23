import type { EnhancedStore } from '@reduxjs/toolkit'

import { Bonfire } from '@ierik/revolt'
import { bonfire } from '@/revolt'


type EventMap = {
  [key in Bonfire.ServerEvent]?: (...args: any) => void
}

function bindBonfire<S = any>(
  store: EnhancedStore<S>,
  listeners: EventMap[]
) {
  const bindEvents = (eventMap: EventMap) => Object
    .entries(eventMap)
    .forEach(([ eventName, listener ]) =>
      bonfire.onEvent(
        eventName,
        listener.bind(null, store)
      ))

  for (const eventMap of listeners) {
    bindEvents(eventMap)
  }
}

export default bindBonfire

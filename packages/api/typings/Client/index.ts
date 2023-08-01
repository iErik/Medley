import type { BonfireListener } from "../Bonfire"

// -> Bonfire
// ----------

export type BonfireSocket = {
  connection: undefined | null | WebSocket
  active: boolean
  pingIntervalId: number | null
  eventListeners: Record<string, BonfireListener[]>
  catchallListeners: BonfireListener[]
  connect: () => void
}

// -> General Client
// -----------------

export type ClientContext = {
  token: string
  socket: Partial<BonfireSocket> | null
}

/*
export type ContextPartial = Partial<{
  token: string
  socket: Partial<BonfireSocket | null>
}>
*/

export type ContextPartial = Partial<ClientContext>

export type ContextSetter = (state: ContextPartial) => void

export type ContextFn = () => [
  ClientContext,
  (state: ContextPartial) => void
]


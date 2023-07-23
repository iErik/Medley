import { serializeStore } from '@utils/redux'

const gatewayMid = store => next => action => {
  serializeStore(store.getState())

  next(action)
}

export default gatewayMid

import { serializeStore } from '@utils/redux'

const serialize = store => next => action => {
  serializeStore(store.getState())
  next(action)
}

export default serialize

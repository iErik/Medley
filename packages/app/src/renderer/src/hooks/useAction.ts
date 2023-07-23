import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export default function useAction (action: Function): Function {
  const dispatch = useDispatch()
  const actionDispacther = useCallback((...args: Array<any>) =>
    dispatch(action.apply(null, args)), [ dispatch ])

  return actionDispacther
}

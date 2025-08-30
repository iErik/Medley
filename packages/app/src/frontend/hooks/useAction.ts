import { useCallback } from 'react'
import { useDispatch } from '@store'

export default function useAction (
  action: Function
): Function {
  if (!action) {
    console.error('useAction called with an invalid argument')
  }

  const dispatch = useDispatch()
  const actionDispacther = useCallback((...args: Array<any>) =>
    dispatch(action.apply(null, args)), [ dispatch ])

  return actionDispacther
}

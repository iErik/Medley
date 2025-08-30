import { useSelector } from '@store'

export function useSelf() {
  const self = useSelector(state => state.auth.self)
  return self
}


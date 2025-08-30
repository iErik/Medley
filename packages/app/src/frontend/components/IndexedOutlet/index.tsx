import { useContext } from 'react'

import {
  UNSAFE_RouteContext as RouteContext
} from 'react-router'


type IndexedOutletProps = {
  index: number | string
}

const IndexedOutlet = (props: IndexedOutletProps) => {
  const outlet =  useContext(RouteContext).outlet
  const { routeContext } = outlet?.props || {}
  const { route } = outlet?.props?.match || {}

  const index = Number(props.index)
  const element = route.element[index]

  return (
    <RouteContext.Provider value={routeContext}>
      { element }
    </RouteContext.Provider>
  )
}

export default IndexedOutlet

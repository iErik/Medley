import { useContext } from 'react'

import {
  UNSAFE_RouteContext as RouteContext
} from 'react-router-dom'

const NamedOutlet = () => {
  const { outlet } = useContext(RouteContext)

  return (
    <>
    </>
  )
}

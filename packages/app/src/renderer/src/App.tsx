import { Outlet, useNavigate } from 'react-router-dom'

import { useEffect } from 'react'
import { useSelector } from '@store'

import { AuthState } from '@store/user'

import { styled } from '@stitched'
import globalStyles from '@stitched/global'


// -> Elements
// -----------

const MainContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',

  backgroundColor: '$bg500',
})

// -> Constants
// ------------

const locationMap = {
  [AuthState.Unauthenticated]: '/auth',
  [AuthState.PendingMFA]: '/auth/mfa',
  [AuthState.Authenticated]: '/'
}

// -> Component export
// -------------------

const App = () => {
  globalStyles()

  const navigate = useNavigate()
  const forceLocation = useSelector(state =>
    locationMap[state.user.authState])

  console.log({ forceLocation })

  useEffect(() =>
    { forceLocation && navigate(forceLocation) },
    [ forceLocation ])

  return (
    <MainContainer>
      <Outlet />
    </MainContainer>
  )
}

export default App

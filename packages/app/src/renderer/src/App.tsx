import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { AuthState } from '@store/user'
import { styled } from '@/stitches.config'
import useGateway from '@hooks/useGateway'

// -> Elements
// -----------

const MainContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',

  backgroundColor: '$bgBase',
  //opacity: .8
})

const ContentWrapper = styled('div', {
  backgroundColor: '$bgBase',

  flexGrow: 1,
  flesShrink: 0,
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
  const navigate = useNavigate()
  const authState = useSelector(state =>
    state.user.authState)
  const forceLocation = useSelector(state =>
    locationMap[state.user.authState])

  useEffect(() =>
    { forceLocation && navigate(forceLocation) },
    [ forceLocation ])

  useGateway(authState)

  return (
    <MainContainer>
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </MainContainer>
  )
}

export default App

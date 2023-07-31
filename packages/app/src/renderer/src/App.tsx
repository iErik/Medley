import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from '@store'

import { AuthState } from '@store/user'
import { stitch } from '@ierik/medley-components'

// -> Elements
// -----------

const MainContainer = stitch('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',

  backgroundColor: '$bgBase',
})

const ContentWrapper = stitch('div', {
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
  const forceLocation = useSelector(state =>
    locationMap[state.user.authState])

  useEffect(() =>
    { forceLocation && navigate(forceLocation) },
    [ forceLocation ])

  return (
    <MainContainer>
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </MainContainer>
  )
}

export default App

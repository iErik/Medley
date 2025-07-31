import {
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom'

import { useEffect } from 'react'
import { useSelector } from '@store'
import { AuthState } from '@store/user'

import { styled } from '@stitched'
import globalStyles from '@stitched/global'



const locationMap = {
  [AuthState.Unauthenticated]: '/auth',
  [AuthState.PendingMFA]: '/auth/mfa',
  [AuthState.Authenticated]: '/'
}

export default function RootLayout() {
  globalStyles()

  const navigate = useNavigate()
  const location = useLocation()
  const authState = useSelector(state =>
    state.user.authState)

  useEffect(() => {
    const forceLocation = locationMap[authState]
    const isAuthenticated =
      authState === AuthState.Authenticated

    if (!isAuthenticated) {
      navigate(forceLocation)
    }

    if (
      isAuthenticated &&
      location.pathname.startsWith('/auth')
    ) {
      navigate(forceLocation)
    }
  }, [ authState ])

  /*
  useEffect(() => {
    if (forceLocation === AuthState.Unauthenticated)

    if (forceLocation) {
      console.log('Forcing navigation!')
      navigate(forceLocation)
    }

    //forceLocation && navigate(forceLocation)
  }, [ forceLocation ])
  */

  return (
    <MainContainer>
      <Outlet />
    </MainContainer>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const MainContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',

  backgroundColor: '$bg500',
})



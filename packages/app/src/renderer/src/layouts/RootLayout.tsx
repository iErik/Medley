import {
  Outlet,
  useNavigate,
  useLocation
} from 'react-router'

import { useEffect } from 'react'
import { useAction } from '@hooks'
import { useSelector } from '@store'
import { AuthStage } from '@store/auth'
import { actions } from '@store/chat'

import { styled } from '@stitched'
import globalStyles from '@stitched/global'



const locationMap = {
  [AuthStage.Unauthenticated]: '/auth',
  [AuthStage.PendingMFA]: '/auth/mfa',
  [AuthStage.Authenticated]: '/'
}

export default function RootLayout() {
  globalStyles()

  const fetchUnreads = useAction(actions.fetchUnreads)
  const navigate = useNavigate()
  const location = useLocation()
  const authStage = useSelector(state =>
    state.auth.authStage)

  useEffect(() => {
    console.log('RootLayout: ', { authStage })

    const forceLocation = locationMap[authStage]
    const isAuthenticated =
      authStage === AuthStage.Authenticated

    if (!isAuthenticated) {
      navigate(forceLocation)
    }

    if (isAuthenticated) {
      fetchUnreads()

      if (location.pathname.startsWith('/auth'))
        navigate(forceLocation)
    }
  }, [ authStage ])

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


import type { ReactNode } from 'react'

import { useEffect } from 'react'
import { useLocation } from 'wouter'

import { useAction } from '@hooks'
import { useSelector } from '@store'
import { AuthStage } from '@store/auth'
import { actions } from '@store/chat'

import { styled } from '@stitched'
import globalStyles from '@stitched/global'


type Props = {
  children: ReactNode
}


const locationMap = {
  [AuthStage.Unauthenticated]: '/auth',
  [AuthStage.PendingMFA]: '/auth/mfa',
  [AuthStage.Authenticated]: '/'
}

export default function RootLayout(props: Props) {
  globalStyles()

  const fetchUnreads = useAction(actions.fetchUnreads)
  const [location, navigate] = useLocation()
  const authStage = useSelector(state =>
    state.auth.authStage)

  useEffect(() => {
    const forceLocation = locationMap[authStage]
    const isAuthenticated =
      authStage === AuthStage.Authenticated

    if (!isAuthenticated) {
      navigate(forceLocation)
    }

    if (isAuthenticated) {
      fetchUnreads()

      if (location.startsWith('/auth')) {
        navigate(forceLocation)
      }
    }
  }, [ authStage ])

  return (
    <MainContainer>
      { props.children }
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


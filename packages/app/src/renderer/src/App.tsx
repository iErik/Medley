import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from '@store'

import { AuthState } from '@store/user'
import type { MappedServer } from '@store/chat'

import { actions as chatActions } from '@store/chat'

import { styled } from '@stitched'
import globalStyles from '@stitched/global'

import { useBonfire, useAction } from '@hooks'

import Header from '@components/Header'

// -> Elements
// -----------

const MainContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',

  backgroundColor: '$bgBase',
})

const ContentWrapper = styled('div', {
  backgroundColor: '$bgBase',

  flexGrow: 1,
  flesShrink: 0,
  maxHeight: 'calc(100% - $headerHeight)'
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
  useBonfire()

  const setActiveServer = useAction(chatActions.setActiveServer)
  const navigate = useNavigate()
  const forceLocation = useSelector(state =>
    locationMap[state.user.authState])

  useEffect(() =>
    { forceLocation && navigate(forceLocation) },
    [ forceLocation ])

  const onSelectServer = ({ _id }: MappedServer) => {
    navigate(`servers/${_id}`)
    setActiveServer(_id)
  }

  return (
    <MainContainer>
      <Header
        onSelectServer={onSelectServer}
      />

      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </MainContainer>
  )
}

export default App

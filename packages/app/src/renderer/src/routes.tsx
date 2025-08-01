import {
  type RouteObject,
  type NavigateFunction,
  useNavigate as _useNavigate,
  createBrowserRouter
} from 'react-router'

import RootLayout from '@layouts/RootLayout'

import DynamicView from '@views/Dynamic'

import FriendList from '@views/Authenticated/FriendList'
import ServerPanel from '@views/Authenticated/ServerPanel'
import Chat from '@views/Authenticated/Chat'

import Unauthenticated from '@views/Unauthenticated/Main'
import LoginForm from '@views/Unauthenticated/LoginForm'
import MFAForm from '@views/Unauthenticated/MFAForm'



export const routes: RouteObject[] = [
  {
    Component: RootLayout,
    children: [
      {
        path: '/',
        id: 'Home',
        Component: DynamicView,
        children: [
          {
            index: true,
            element: [ <FriendList />, <></> ]
          },
          {
            id: 'DirectMessage',
            path: 'directs/:channelId',
            element: [ <FriendList />, <Chat /> ]
          },
          {
            id: 'Server',
            path: 'server/:serverId/channel/:channelId?',
            element: [ <ServerPanel />, <Chat /> ]
          }
        ]
      },
      {
        path: '/auth',
        Component: Unauthenticated,
        children: [
          { id: 'Login', index: true, Component: LoginForm },
          { id: 'MFA', path: 'mfa', Component: MFAForm },
        ]
      }
    ]
  }
]

export const browserRouter = createBrowserRouter(routes)

export const navigators = (nav: NavigateFunction) => ({
  Home: () => nav('/'),
  Direct: (channelId: string) =>
    nav(`directs/${channelId}`),
  Server: (serverId: string, channelId?: string) =>
    nav(`/server/${serverId}/channel/${channelId || ''}`),

  Login: () => nav('/auth'),
  MFA: () => nav('/auth/mfa')
})

export const useNavigation = () => {
  const navigate = _useNavigate()
  return navigators(navigate)
}

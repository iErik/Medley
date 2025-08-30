import { Route, Switch, useLocation } from 'wouter'

import RootLayout from '@layouts/Root'

import MessagingPage from '@pages/app'
import Auth from '@pages/auth'


export default function Router() {
  return (
    <RootLayout>
      <Switch>
        <Route nest path="/auth" component={Auth} />
        <Route nest path="/" component={MessagingPage} />
      </Switch>
    </RootLayout>
  )
}


type NavigateFn = (path: string, ...args: any[]) => any

// These are navigation helpers created with the goal to
// centralize navigation in one place where we could provide
// some degree of compile time type-safety and avoid
// reliance on hardcoded route strings throughout the app.
//
// However, due to the nature of Wouter, there is no
// guarantee that the route paths referenced by these
// helpers actually exist, and it's our responsibility to
// make sure these are correct.
const navigators = (nav: NavigateFn) => ({
  direct: (directId: string) =>
    nav(`~/directs/${directId}`),
  server:  (serverId: string, channelId: string) =>
    nav( `~/server/${serverId}/channel/${channelId}`),
  home: () =>
    nav('~/'),
  login: () =>
    nav('~/auth'),
  mfa: () =>
    nav('~/auth/mfa'),
})

type Navigators = ReturnType<typeof navigators>

export const useNavigator = <N extends keyof Navigators>(
  route: N
): Navigators[N] => {
  const [ _, navigate ] = useLocation()
  return navigators(navigate)[route]
}

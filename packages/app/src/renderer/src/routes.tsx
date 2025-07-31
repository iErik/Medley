import {
  BrowserRouter,
  Routes,
  Route,
  type PathRouteProps,
  type RouteProps
} from 'react-router-dom'

import App from './App'

import RootLayout from '@layouts/RootLayout'

import DynamicView from '@views/Dynamic'
import Authenticated from '@views/Authenticated'
import ServerView from '@views/ServerView'


import FriendList from '@views/Authenticated/FriendList'
import Chat from '@views/Authenticated/Chat'

import Unauthenticated from '@views/Unauthenticated/Main'
import LoginForm from '@views/Unauthenticated/LoginForm'
import MFAForm from '@views/Unauthenticated/MFAForm'

export default () =>
  <BrowserRouter>
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<DynamicView />}>
          <Route index element={[
            <FriendList />,
            <p>boceta</p>,
          ]}
          />

          <Route path="directs/:channelId" element={[
              <FriendList/>,
              <Chat />
            ]}
          >
            <Route path="picole" element={<p>perok</p>}/>
          </Route>

        </Route>

        <Route path="/auth" element={<Unauthenticated />}>
          <Route index element={<LoginForm />} />
          <Route path="mfa" element={<MFAForm />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>

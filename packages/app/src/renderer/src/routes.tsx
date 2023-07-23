import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import App from './App'
import Home from '@views/Home'

import Unauthenticated from '@views/Unauthenticated/Main'
import LoginForm from '@views/Unauthenticated/LoginForm'
import MFAForm from '@views/Unauthenticated/MFAForm'

// Pages:
// - Server View
// - DM's view
// - Log in

export default () =>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />

        <Route path="/auth" element={<Unauthenticated />}>
          <Route index element={<LoginForm />} />
          <Route path="mfa" element={<MFAForm />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>

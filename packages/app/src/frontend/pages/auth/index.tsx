import { Route, Switch } from 'wouter'
import { Flexbox, Text } from '@ierik/medley-components'

import { LoginForm } from './login'
import { MFAForm } from './mfa'

const Auth = () => (
  <Flexbox column hAlign="center" vAlign="top">
    <Text
      mono
      type="h2"
      css={{ marginTop: '300px', marginBottom: '50px' }}
    >
      You should totally log in
    </Text>

    <Switch>
      <Route path="mfa" component={MFAForm} />
      <Route component={LoginForm} />
    </Switch>
  </Flexbox>
)

export default Auth

import { useAction } from '@hooks'
import { actions } from '@store/user'
import { Wrapper, Form } from '@ierik/medley-components'

// -> Login Form template
// ----------------------

const LoginTemplate = [
  {
    name: 'email',
    type: 'email',
    placeholder: 'E-mail',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
  }
]

// -> Component export
// -------------------

const LoginForm = () => {
  const requestLogin = useAction(actions.login)

  return (
    <Wrapper
      column
      hAlign="center"
      vAlign="top"
    >
      <Form
        schema={LoginTemplate}
        submitText="Log in"
        onSubmit={requestLogin}
        css={{ width: '100%', maxWidth: 300 }}
      />
    </Wrapper>
  )
}

export default LoginForm

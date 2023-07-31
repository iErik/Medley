import { useAction } from '@hooks'
import { actions } from '@store/user'
import { Wrapper, Form } from '@ierik/medley-components'

// -> MultiFactor Authentication Form
// ----------------------------------

const MFATemplate = [
  {
    type: 'text',
    name: 'code',
    placeholder: 'Code',
  }
]

// -> Component export
// -------------------

const MFAForm = () => {
  const requestMfa = useAction(actions.mfa)
  const onSubmit = ({ code } = {}) => requestMfa(code)

  return (
    <Wrapper
      column
      hAlign="center"
      vAlign="top"
    >
      <Form
        schema={MFATemplate}
        submitText="Log in"
        onSubmit={onSubmit}
        css={{ width: '100%', maxWidth: 300 }}
      />
    </Wrapper>
  )
}

export default MFAForm


import { useForm, InputType, FieldSchema } from '@ierik/react-generics'
import { styled } from '../stitched'

import Input from '../Input'
import Button from '../Button'

// -> Types
// --------

type FormProps = {
  schema: FieldSchema[],
  submitText: string,
  disabled?: boolean,
  onSubmit: Function
}

// -> Elements
// -----------

const FormBox = styled('form', {
  display: 'flex',
  flexDirection: 'column',
})

const FormInput = styled(Input.Text, {
  '&:not(:last-child)': { marginBottom: 10 }
})

const FormRadio = styled(Input.Radio, {
  '&:not(:last-child)': { marginBottom: 10 }
})

const FormSelect = styled('select', {
})


// -> Form
// -------

const typeMap = {
  [InputType.Text]: FormInput,
  [InputType.Number]: FormInput,
  [InputType.Radio]: FormRadio,
  [InputType.Select]: FormSelect,
}

const Form = ({
  schema,
  submitText,
  onSubmit,
  disabled,
  ...props
}: FormProps): React.ReactElement => {
  const { formFields, formData } = useForm(schema, typeMap)

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    ev.stopPropagation()

    onSubmit(formData)
  }

  return (
    <FormBox onSubmit={handleSubmit} {...props}>
      { formFields }

      <Button type="submit" css={{ marginTop: '10px' }}>
        { submitText }
      </Button>
    </FormBox>
  )
}

export default Form

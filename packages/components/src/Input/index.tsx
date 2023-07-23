import { styled } from '../stitches.config'

const TextInputEl = styled('input', {
  minHeight: 50,
  height: '100%',
  borderRadius: 50,
  backgroundColor: '$bgDark',

  padding: '0 30px',
  border: 'none',
  cursor: 'text',
  outline: 'none',

  fontFamily: '$decorative',
  fontSize: 17,
  color: '$fgBase',
})

const TextInputWrapperEl = styled('div', {
  borderRadius: 50,
  padding: 1,

  //maxHeight: 50,
  height: '100%',

  $$colorA: '$colors$primaryBase',
  $$colorB: '$colors$secondaryBase',

  linearGradient: '145deg, $$colorA 0%, $$colorB 60%',
  boxShadow: '0px 6px 16px -3px rgba(0, 0, 0, 0.22)',
  transition: 'box-shadow 300ms ease',

  '&:hover': {
    boxShadow: '0px 7px 30px -3px rgba(0, 0, 0, 0.25)',
  },

  [`& > ${TextInputEl}`]: { width: '100%' },

  variants: {
    square: {
      true: {
        borderRadius: 10,

        [`& > ${TextInputEl}`]: {
          borderRadius: 10
        }
      }
    }
  }
})

const RadioInputEl = styled('input', {

})

interface TextWrapperProps extends JSX.IntrinsicAttributes {
  square?: boolean
  type?: 'text' | 'password' | 'email'
  placeholder?: string
  className?: string
  onInput?: React.FormEventHandler<HTMLInputElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
}

const handleInput = (
  e: React.FormEvent<HTMLInputElement>,
  onInput?: Function
) => {
  const { value } = e?.currentTarget
  if (onInput) onInput(value, e)
}


const TextInput = ({
  square,
  onInput,
  onKeyDown,
  placeholder,
  type = 'text',
  ...props
}: TextWrapperProps) =>
  <TextInputWrapperEl
    square={square}
    className="cg-text-input"
    { ...props }
  >
    <TextInputEl
      type={type}
      placeholder={placeholder}
      onInput={e => handleInput(e, onInput)}
      onKeyDown={onKeyDown}
      spellCheck={false}
    />
  </TextInputWrapperEl>

TextInput.toString = () => '.cg-text-input'

const RadioInput = (props: JSX.IntrinsicAttributes) =>
  <RadioInputEl type="radio" {...props} />


interface InputProps extends JSX.IntrinsicAttributes {
  /**
   * The type of the input
   */
  type: 'text' | 'radio'

  /**
   * input event handler
   */
  onInput?: Function
  onEnter?: Function
}

const Input = ({
  type,
  onInput,
  onEnter,
  ...props
}: InputProps) => {
  const typeMap = {
    'text': Input.Text,
    'radio': Input.Radio
  }

  const Component = typeMap[type]

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const { value } = e?.target || {}
    const { key } = e

    if (key === 'Enter' && onEnter)
      onEnter(value || '', e)
  }

  const handleInput = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    const { value } = e?.currentTarget

    if (onInput) onInput(value, e)
  }

  return (
    <Component
      className="cg-input"
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      { ...props }
    />
  )
}

Input.Text = TextInput
Input.Radio = RadioInput
Input.toString = () => '.cg-input'

export default Input

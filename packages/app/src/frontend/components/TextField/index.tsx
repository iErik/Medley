import type * as Stitches from '@stitches/react'

import type {
  KeyboardEvent,
  ChangeEvent as _ChangeEvent,
  ReactElement
} from 'react'

import { styled } from '@stitched'

import Icon, { type IconName } from '@components/Icon'
import { If } from '@packages/components'


type KeebEvent = KeyboardEvent<HTMLInputElement>
type ChangeEvent = _ChangeEvent<HTMLInputElement>

type TextFieldProps = {
  beforeEl?: ReactElement
  afterEl?: ReactElement
  iconBefore?: IconName
  iconAfter?: IconName
  placeholder?: string
  spellcheck?: boolean

  onChange: (text: string, ev: ChangeEvent) => any
  onKeyDown?: (ev: KeebEvent) => any

  fontStyle?: 'sans' | 'decorative'
  css?: Stitches.CSS
}

const TextField = (props: TextFieldProps) => {
  const handleChange = (ev: ChangeEvent) => {
    const value = ev?.target?.value || ''
    props.onChange(value, ev)
  }

  const handleKeyDown = (ev: KeebEvent) => {
    console.log('keyDown: ', ev)

    if (props.onKeyDown)
      props.onKeyDown(ev)
  }

  return (
    <InputWrapper css={props.css}>
      <If condition={!!props.iconBefore}>
        <Icon
          size={20}
          icon={props.iconBefore!}
          css={{ marginRight: 8 }}
        />
      </If>

      <InputEl
        type="text"
        placeholder={props.placeholder}
        spellCheck={props.spellcheck}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        fontStyle={props.fontStyle ?? 'decorative'}
      />

      <If condition={!!props.iconBefore}>
        <Icon
          size={20}
          icon={props.iconAfter!}
          css={{ marginLeft: 8 }}
        />
      </If>
    </InputWrapper>
  )
}


/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const InputEl = styled('input', {
  height: '100%',
  padding: '0 5px',
  color: '$fg70',

  '&::placeholder': {
    fontWeight: '$normal'
  },

  variants: {
    fontStyle: {
      sans: {
        fontFamily: '$sans',
        '&:placeholder': { fontFamily: '$sans' }
      },
      decorative: {
        fontFamily: '$decorative',
        '&:placeholder': { fontFamily: '$sans' }
      }
    }
  }
})

const InputWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  padding: '0 13px',
  borderRadius: '$baseRadius',
  background: '$bg500',
  height: 40,

  cursor: 'text'
})

export default TextField

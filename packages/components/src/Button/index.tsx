import type * as Stitches from '@stitches/react'
import { BaseButton } from '@ierik/react-generics'
import { stitch } from '..'

// -> Types
// --------

interface ButtonProps extends React.PropsWithChildren {
  text?: string,
  square?: boolean,
  children?: React.ReactNode,
  css?: Stitches.CSS
  type?: 'button' | 'submit' | 'reset'
}

// -> Partial Styles
// -----------------

const disabledStyle = {
  pointerEvents: 'none',
  userSelect: 'none',
  opacity: 0.3,
}

// -> Elements
// -----------

const ButtonEl = stitch(BaseButton, {
  $$colorA: '$colors$primaryBase',
  $$colorB: '$colors$secondaryBase',
  $$txtColor: '$colors$fgBase',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  position: 'relative',
  top: '0px',
  left: '0px',
  transform: 'translate(0px, 0px)',

  height: 50,
  opacity: 1,
  borderRadius: 6,
  border: 'none',
  padding: '13px 50px',
  linearGradient: '135deg, $$colorA -8%, $$colorB 100%',
  transition: 'transform 400ms linear, opacity 400ms',

  fontFamily: '$decorative',
  fontSize: 20,
  color: '$$txtColor',
  textShadow: '$textShadow',

  '&:before': {
    content: '',
    display: 'block',
    position: 'absolute',
    zIndex: -1,

    width: '95%',
    //height: '90%',
    height: '80%',
    borderRadius: 6,

    top: '8px',
    left: '50%',
    transform: 'translateX(-50%)',

    linearGradient: '135deg, $$colorA -8%, $$colorB 95%',
    filter: 'blur(15px) opacity(0.55)',

    transition: [
      'opacity',
      'filter',
      'width',
      'height',
      'top',
    ].map(prop => prop + ' 200ms ease').join(', ')
  },

  '&:hover': { transform: 'translate(0px, -2px)' },

  '&:hover:before': {
    filter: 'blur(19px) opacity(0.30)',
    width: '110%',
    //width: '105%',
    height: '95%',
    top: '10px'
  },

  variants: {
    disabled: { true: { ...disabledStyle } },
    loading: { true: { ...disabledStyle } },
    round: {
      true: {
        borderRadius: 50,
        '&:before': { borderRadius: 50 }
      }
    }
  }
})


const Button = ({
  children,
  text,
  ...props
}: ButtonProps) =>
  <ButtonEl { ...props }>
    { children ? children : text }
  </ButtonEl>

export default Button
export type { ButtonProps }

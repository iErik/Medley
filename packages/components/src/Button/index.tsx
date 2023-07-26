import type * as Stitches from '@stitches/react'
import { BaseButton } from '@ierik/react-generics'
import { styled } from '../stitched'

// -> Types
// --------

interface ButtonProps extends React.PropsWithChildren {
  text?: string,
  children?: React.ReactNode,
  css?: Stitches.CSS
  type?: 'button' | 'submit' | 'reset'
}

// -> Elements
// -----------

const ButtonEl = styled(BaseButton, {
  $$colorA: '$colors$primaryBase',
  $$colorB: '$colors$secondaryBase',
  $$txtColor: '$colors$fgBase',

  position: 'relative',
  top: '0px',
  left: '0px',
  transform: 'translate(0px, 0px)',

  height: 50,
  borderRadius: 50,
  border: 'none',
  padding: '13px 50px',
  linearGradient: '135deg, $$colorA -8%, $$colorB 100%',
  transition: 'transform 200ms ease-out',

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
    height: '90%',
    borderRadius: 50,
    top: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    linearGradient: '135deg, $$colorA -8%, $$colorB 95%',
    filter: 'blur(15px)',
    opacity: 0.55,
    transition: [
      'opacity 300ms ease',
      'filter 300ms ease',
      'width 300ms ease',
      'height 300ms ease',
      'top 300ms ease',
    ].join(', ')
  },

  '&:hover': {
    transform: 'translate(0px, -1px)'
  },

  '&:hover:before': {
    filter: 'blur(19px)',
    opacity: 0.33,
    width: '110%',
    height: '95%',
    top: '10px'
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

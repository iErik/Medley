import { BaseText } from '@ierik/react-generics';
import { stitch } from '..'

// -> Types
// --------

type TextType
  = 'p'
  | 'em'
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'

export type TextProps = React.PropsWithChildren & {
  decorative?: boolean
  type?: TextType
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  sans?: boolean
  serif?: boolean
  mono?: boolean
}

// -> Component
// ------------

const TextEl = stitch(BaseText, {
  color: '$fgBase',
  fontFamily: '$sans',
  fontWeight: '$normal',
  fontSize: '$base',

  variants: {
    decorative: { true: { fontFamily: '$decorative' } },
    sans: { true: { fontFamily: '$sans' } },
    serif: { true: { fontFamily: '$serif' } },
    mono: { true: { fontFamily: '$mono' } },

    size: {
      xs: { fontSize: '$xs' },
      sm: { fontSize: '$sm' },
      base: { fontSize: '$base' },
      lg: { fontSize: '$lg' },
      xl: { fontSize: '$xl' },
      '2xl': { fontSize: '$2xl' },
      '3xl': { fontSize: '$3xl' },
    },

    weight: {
      thin: { fontWeight: '$thin' },
      light: { fontWeight: '$light' },
      normal: { fontWeight: '$normal' },
      medium: { fontWeight: '$medium' },
      semiBold: { fontWeight: '$semiBold' },
      bold: { fontWeight: '$bold' },
      extraBold: { fontWeight: '$extraBold' },
    },

    type: {
      p: { fontSize: '$base' },
      span: { fontSize: '$sm' },
      em: {
        fontSize: '$base',
        fontWeight: '$bold'
      },

      h1: {
        fontFamily: '$decorative',
        fontSize: '$h1'
      },

      h2: {
        fontFamily: '$decorative',
        fontSize: '$h2'
      },

      h3: {
        fontFamily: '$decorative',
        fontSize: '$h3'
      },

      h4: {
        fontFamily: '$decorative',
        fontSize: '$h4'
      },

      h5: {
        fontFamily: '$decorative',
        fontSize: '$h5'
      },
    }
  }
})

const Text = (props: TextProps) => {
  return (
    <TextEl as={props.type || 'p'} {...props}>
      { props.children }
    </TextEl>
  )
}

export default Text

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

type TextSize
  = 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'

type TextColor
  = 'fg'
  | 'fg100'
  | 'fg200'
  | 'fg300'
  | 'fg400'
  | 'fg500'
  | 'fg600'
  | 'fg700'
  | 'fg800'
  | 'fg900'

export type TextProps = React.PropsWithChildren & {
  decorative?: boolean
  type?: TextType
  size?: TextSize
  sans?: boolean
  serif?: boolean
  mono?: boolean
  color?: TextColor
  ellipsis?: boolean
  noSelect?: boolean
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

    noSelect: { true: { userSelect: 'none' } },

    ellipsis: {
      true: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },

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
    },

    color: {
      fg: { color: '$fgBase' },
      fg100: { color: '$fg10' },
      fg200: { color: '$fg20' },
      fg300: { color: '$fg30' },
      fg400: { color: '$fg40' },
      fg500: { color: '$fg50' },
      fg600: { color: '$fg60' },
      fg700: { color: '$fg70' },
      fg800: { color: '$fg80' },
      fg900: { color: '$fg90' },
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

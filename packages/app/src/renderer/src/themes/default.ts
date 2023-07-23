import commonProps from '@/themes/common'
import { extendConfig } from '@ierik/concord-generics'


const extended = extendConfig({
  ...commonProps,

  fonts: {
    //sans: 'gg sans, Lato, apple-system, sans-serif',
    sans: 'Chillax',
    serif: 'serif',
    mono: 'Share Tech Mono, Inconsolata, monospace',
    decorative: 'Share Tech Mono'
  },
})

extended.theme.colors = {
  ...extended.theme.colors,

  boldColor: '#00D091',
  italicsColor: '#ff8fab',
  textUnderlay: '#6143A3',
  textOverlay: '#FF8FAB'
}


export default extended

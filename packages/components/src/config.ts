import { utils } from '@ierik/react-generics'

const toRgba = (
  color: string,
  opacity: number
): string | undefined =>
  utils.hexToRgb(color, opacity)?.css

export default {
  theme: {
    colors: {
      primaryBase: '#3BB0E2',
      secondaryBase: '#F9BAFF',

      fgBase: '#FFF',
      fg10: toRgba('#FFFFFF', .1) as string,
      fg20: toRgba('#FFFFFF', .2) as string,
      fg30: toRgba('#FFFFFF', .3) as string,
      fg40: toRgba('#FFFFFF', .4) as string,
      fg50: toRgba('#FFFFFF', .5) as string,
      fg60: toRgba('#FFFFFF', .6) as string,
      fg70: toRgba('#FFFFFF', .7) as string,
      fg80: toRgba('#FFFFFF', .8) as string,
      fg90: toRgba('#FFFFFF', .9) as string,

      bgBase: '#141720',
      bgDark: '#101218',
    },
    shadows: {
      textShadow: '0 2px 6px rgba(0, 0, 0, .27)'
    },

    fonts: {
      mono: 'Share Tech Mono, monospace',
      sans: 'Chillax',
      serif: 'serif',

      decorative: '$mono'
    }
  }
}

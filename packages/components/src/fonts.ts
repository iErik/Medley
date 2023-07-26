import * as Chillax from './static/fonts/Chillax'
import * as ShareTechMono from './static/fonts/ShareTechMono'

// -> Types
// --------

type FontFormat
  = 'woff'
  | 'woff2'
  | 'truetype'
  | 'opentype'
  | 'embedded-opentype'
  | 'svg'

export type FontFace = {
  fontFamily: string,
  fontWeight: number | string,
  fontStyle: 'normal' | 'italic',
  src: string
}

export type FontFaceConfig = {
  family: string
  weight: number
  style?: 'normal' | 'italic'
  src: Array<{
    url: string
    format: FontFormat
  }>
}

export type FontFamilyConfig = {
  name: string,
  path: string,
  format: FontFormat,
  weights: {
    [weight: number]: {
      style?: 'normal' | 'italic'
      src: string
    }
  }
}

// -> Helpers
// ----------

const fontFace = (fontConfig: FontFaceConfig): FontFace => ({
  fontFamily: fontConfig.family,
  fontWeight: fontConfig.weight,
  fontStyle: fontConfig.style || 'normal',
  src: fontConfig.src
    ?.map(({ url, format }) => [
      `local('${fontConfig.family}')`,
      `url('${url}')`,
    ].join(', ') + `format('${format}')`)
    ?.join(', ')
})

const fontFaces = (fontConfigs: FontFaceConfig[]) => ({
  '@font-face': fontConfigs.map(fontFace)
})

const fontFamily = (familyConfig: FontFamilyConfig) =>
  Object.entries(familyConfig.weights)
    .map(([ weight, { src, style } ]) => ({
      family: familyConfig.name,
      weight: +weight,
      style: style || 'normal',
      src: [ { url: src, format: familyConfig.format } ]
    }))

const fontFamilies = (familyConfigs: FontFamilyConfig[]) =>
  fontFaces(familyConfigs.flatMap(fontFamily))

// -> Fonts
// --------

const chillaxFonts: FontFamilyConfig = {
  name: 'Chillax',
  path: './fonts/Chillax',
  format: 'woff2',
  weights: {
    400: { src: Chillax.Regular },
    500: { src: Chillax.Medium },
    600: { src: Chillax.Semibold },
    700: { src: Chillax.Bold },
    800: { src: Chillax.Variable }
  }
}

const shareTechMonoFonts: FontFamilyConfig = {
  name: 'Share Tech Mono',
  path: './fonts/ShareTechMono',
  format: 'woff2',
  weights: {
    400: { src: ShareTechMono.Regular },
  }
}

export default fontFamilies([
  chillaxFonts,
  shareTechMonoFonts
])

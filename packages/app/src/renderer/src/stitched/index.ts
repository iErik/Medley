import { mkStitches } from '@ierik/medley-components'
import config from './config'

export const {
  styled,
  css,
  globalCss,
  keyframes,
  theme,
  createTheme,
  getCssText,
} = mkStitches(config)

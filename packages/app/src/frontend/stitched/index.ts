import { mkStitches } from '@packages/components'
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

import { utils } from '@ierik/react-generics'
import config from './config'

export const {
  styled,
  css,
  globalCss,
  keyframes,
  theme,
  createTheme,
  getCssText,
} = utils.mkStitches(config)

import { baseGlobalCss } from '@ierik/react-generics'

import { globalCss } from './stitched'
import fonts from './fonts'

export const globalConfig = {
  ...baseGlobalCss,
  ...fonts
}

export default globalCss(globalConfig)

import { baseGlobalCss } from '@ierik/react-generics'

import { globalCss } from './stitched'
import fonts from './fonts'

export default globalCss({
  ...baseGlobalCss,
  ...fonts
})

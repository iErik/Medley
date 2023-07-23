import 'overlayscrollbars/overlayscrollbars.css'
import './fonts.css'

import { utils } from '@ierik/react-generics'
import config from './config'

export { config }
export const extendConfig = (theme: Record<string, any>) =>
  utils.extendObj(config, theme)

// -> Type Exports
// ---------------

export type { ButtonProps } from './Button'
export type { PanelProps} from './Panel'

// -> Component Exports
// --------------------

export { default as Button } from './Button'
export { default as Panel } from './Panel'
export { default as Wrapper } from './Wrapper'
export { default as Input } from './Input'
export { default as Text } from './Text'
export { default as Heading } from './Heading'
export { default as Form } from './Form'
export { default as ScrollView } from './ScrollView'


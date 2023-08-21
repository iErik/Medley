import 'overlayscrollbars/overlayscrollbars.css'
import { createStitches } from '@stitches/react'
import { utils } from '@ierik/react-generics'
import config from './config'

export * from '@ierik/react-generics'

// -> CSS Helpers Exports
// ----------------------

export { config }
export { default as globalStyles } from './global'
export { globalConfig } from './global'
export {
  styled as stitch,
  keyframes,
  globalCss
} from './stitched'

// -> General utils
// ----------------

export const extendObj = utils.extendObj

export const extendConfig = (theme: Record<string, any>) => {
  const mergedConfig = utils.extendObj(config, theme)
  return utils.extendConfig(mergedConfig)
}

export const mkStitches = (config: Record<string, any>) => {
  const result = extendConfig(config)
  return createStitches(result)
}

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


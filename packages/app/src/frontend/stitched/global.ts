import {
  globalConfig as baseGlobalConfig,
  globalCss,
  extendObj
} from '@ierik/medley-components'

export default globalCss(extendObj(baseGlobalConfig, {
  '@media (prefers-reduced-motion: no-preference)': {
    html: { interpolateSize: 'allow-keywords' }
  },

  'html, body, #root, #root > .app': {
    //borderTopLeftRadius: 10,
    //borderTopRightRadius: 10
  },
}))



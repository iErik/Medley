import {
  globalConfig as baseGlobalConfig,
  globalCss,
  extendObj
} from '@ierik/medley-components'

export default globalCss(extendObj(baseGlobalConfig, {
  'html, body, #root, #root > .app': {
    //borderTopLeftRadius: 10,
    //borderTopRightRadius: 10
  },
}))



import { createStitches } from '@stitches/react'
import { extendConfig } from '@ierik/concord-generics'
import defaultTheme from '@/themes/default'

const config = extendConfig({
  theme: defaultTheme,
})

export const { styled, css } = createStitches(config)

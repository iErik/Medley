import type * as Stitches from '@stitches/react'
import React, { type SVGProps, Ref } from 'react'

import { styled } from '@stitched'

import * as Icons from './components'


export type IconName = keyof typeof Icons

export type IconProps = SVGProps<SVGSVGElement> & {
  icon: IconName
  size?: number
  ref?: Ref<SVGSVGElement>
  css?: Stitches.CSS
}

const DEFAULT_SIZE = 24

export default function Icon({
  icon,
  size,
  ...props
}: IconProps) {
  const icnSize = size || DEFAULT_SIZE

  if (!(icon in Icons)) return null

  const Component = React.createElement(Icons[icon], {
    ...props,
    width: icnSize,
    height: icnSize
  })

  return (
    <IconWrapper className="icon-wrapper" css={props.css}>
      { Component }
    </IconWrapper>
  )
}

Icon.toString = () => '.icon-wrapper'

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const IconWrapper = styled('div', {
  display: 'flex',
  color: '$fg60',

  // Allows us to use 'color' to set the icon color, instead
  // of having to use fill directly
  '& svg': { fill: 'currentColor' }
})

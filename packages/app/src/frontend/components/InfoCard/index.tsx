import type { ReactElement } from 'react'

import { styled } from '@stitched'
import { Flexbox, If } from '@packages/components'



export type BackgroundColorVariant
  = 'transparent'
  | '100' | 100
  | '200' | 200
  | '300' | 300
  | '400' | 400
  | '500' | 500

type InfoCardProps = {
  headline: string,
  lowerline?: string,
  image?: string,
  imageEl?: ReactElement,
  background?: BackgroundColorVariant
  hoverBg?: BackgroundColorVariant
  noClick?: boolean
  onClick?: (ev: React.MouseEvent<HTMLDivElement>) => any
}

const InfoCard = (props: InfoCardProps) => (
  <Root
    background={props.background || 'transparent'}
    hoverBg={props.hoverBg || 300}
    onClick={props.noClick ? undefined : props.onClick}
    clickable={!props.noClick}
  >
    <If condition={!!props.imageEl}>
      { props.imageEl }
    </If>

    <If condition={!props.imageEl && !!props.image}>
      <Image source={props.image!}/>
    </If>

    <Flexbox column overflow="hidden">
      <Headline>{ props.headline }</Headline>

      <If condition={!!props.lowerline}>
        <Lowerline>{ props.lowerline }</Lowerline>
      </If>
    </Flexbox>
  </Root>
)

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Root = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',

  padding: 5,
  gap: 12,
  borderRadius: '$baseRadius',

  transition: 'background-color 200ms ease',

  variants: {
    background: {
      transparent: {
        backgroundColor: 'transparent'
      },

      100: { backgroundColor: '$bg100' },
      200: { backgroundColor: '$bg200' },
      300: { backgroundColor: '$bg300' },
      400: { backgroundColor: '$bg400' },
      500: { backgroundColor: '$bg500' },
    },

    clickable: {
      true: {
        cursor: 'pointer'
      }
    },

    hoverBg: {
      transparent: {
        '&:hover': { backgroundColor: 'transparent' }
      },

      100: { '&:hover': { backgroundColor: '$bg100' } },
      200: { '&:hover': { backgroundColor: '$bg200' } },
      300: { '&:hover': { backgroundColor: '$bg300' } },
      400: { '&:hover': { backgroundColor: '$bg400' } },
      500: { '&:hover': { backgroundColor: '$bg500' } },
    }
  },

  defaultVariants: {
    background: 'transparent',
    hoverBg: 300
  }
})

const ImageEl = styled('div', {
  borderRadius: 11,
  width: 40,
  height: 40,

  userSelect: 'none',

  flexShrink: 0,
  backgroundPosition: 'center',
  backgroundSize: 'contain'
})

const Image = (props: { source: string }) => {

  return (
    <ImageEl
      style={{ backgroundImage: `url(${props.source})` }}
    />
  )
}

const Lowerline = styled('p', {
  color: '$fg40',
  fontWeight: '$medium',
  userSelect: 'none',
  fontSize: 14,
  ellipsis: '100%',
})


const Headline = styled('p', {
  color: '$fg70',
  userSelect: 'none',
  fontWeight: '$medium',
  fontSize: 15,
  ellipsis: '100%',
})



export default InfoCard

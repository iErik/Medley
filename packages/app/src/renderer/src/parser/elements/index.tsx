import type {
  FunctionComponent as FC,
  PropsWithChildren as Props
} from 'react'

import { useState } from 'react'
import { styled } from '@/stitched'

// We have to wrap Stitches components otherwise
// typescript gets really confused about their typing
// when we use them in the reduce operation that happens
// in the `parseText` function, and breaks. :(
const wrapStitches = (Element: FC<Props>): FC<Props> =>
  (props: React.PropsWithChildren) =>
    <Element>{ props.children }</Element>

export const Bold = wrapStitches(styled('strong', {
  fontFamily: '$sans',
  display: 'inline',
  fontWeight: '$extrabold',
  whiteSpace: 'pre-wrap',
  color: '$boldColor'
}))

export const Italics = wrapStitches(styled('i', {
  fontFamily: '$sans',
  display: 'inline',
  fontStyle: 'italic',
  whiteSpace: 'pre-wrap',
  color: '$italicsColor'
}))

export const Strike = wrapStitches(styled('span', {
  fontFamily: '$sans',
  display: 'inline',
  whiteSpace: 'pre-wrap',
  textDecoration: 'line-through',
  textDecorationThickness: 2,
  textDecorationColor: '$boldColor'
}))

export const Normal = wrapStitches(styled('span', { }))

export const Channel = styled('span', {
  display: 'inline-block',
  background: '$textUnderlay',
  padding: '0 3px',
  borderRadius: 5,
  opacity: .5,
  cursor: 'pointer',
  transition: 'opacity 100ms',

  '&:hover': { opacity: 1 }
})

export const Role = styled('span', {
  display: 'inline-block',
  background: '$textUnderlay',
  padding: '0 3px',
  borderRadius: 5,
  opacity: .5,
  cursor: 'pointer',
  transition: 'opacity 100ms',

  '&:hover': { opacity: 1 }
})

export const Mention = styled('span', {
  display: 'inline-block',
  background: '$textUnderlay',
  padding: '0 3px',
  borderRadius: 5,
  opacity: .5,
  cursor: 'pointer',
  transition: 'opacity 100ms',

  '&:hover': { opacity: 1 }
})

// -> Spoiler
// ----------

const SpoilerEl = styled('span', {
  fontFamily: '$sans',
  display: 'inline',
  whiteSpace: 'pre-wrap',
  position: 'relative',

  '&:before': {
    position: 'absolute',
    zindex: 10,
    top: 0,
    left: 0,

    content: '',
    width: '100%',
    height: '100%',
    borderRadius: 4,

    background: '$textOverlay',
    opacity: 0.3,
    transition: 'opacity 100ms ease'
  },

  '& > .text': {
    position: 'relative',
    zIndex: 20,
    opacity: 1,
  },

  variants: {
    hidden: {
      true: {
        '&:before': { opacity: 1 },

        '& > .text': {
          opacity: 0,
          userSelect: 'none',
          cursor: 'pointer',
        }
      }
    }
  }
})

export const Spoiler = (props: React.PropsWithChildren) => {
  const [ hidden, setHidden ] = useState(true)
  const toggle = () => setHidden(!hidden)

  return (
    <SpoilerEl hidden={hidden} onClick={toggle}>
      <span className="text">
        { props.children }
      </span>
    </SpoilerEl>
  )
}


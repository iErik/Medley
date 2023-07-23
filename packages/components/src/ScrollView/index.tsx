import {
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'

import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentRef
} from 'overlayscrollbars-react'

import 'overlayscrollbars/overlayscrollbars.css'

import { styled } from '../stitches.config'

// -> Types
// --------

interface ScrollViewProps extends React.PropsWithChildren {
  className?: string
  css?: Record<string, any>
  ref?: React.RefObject<HTMLDivElement>
}

// -> Elements
// -----------

const ScrollEl = styled(OverlayScrollbarsComponent, {
  height: '100%',

  '& .os-scrollbar': {},

  '& .os-scrollbar .os-scrollbar-track': {},

  '& .os-scrollbar .os-scrollbar-handle': {
    background: '$primaryBase',
    borderRadius: 10,
    width: 3,

    '&:hover': {
      background: '$primaryBase',
      width: 5
    }
  },

  '& .os-scrollbar .os-scrollbar-handle:active': {},

  '& .os-scrollbar-corner': {},
})

// -> Main Component
// -----------------

type ScrollRef = OverlayScrollbarsComponentRef<
  keyof JSX.IntrinsicElements
>

type RefType = React.ForwardedRef<HTMLDivElement | undefined>

const ScrollView = (
  props: ScrollViewProps,
  ref: RefType
) => {
  const overlayScrollRef = useRef<ScrollRef|null>(null)

  useImperativeHandle(ref, ()  => {
    if (overlayScrollRef.current) {
      const element = overlayScrollRef.current.getElement()
      const scrollView = element?.children[1]

      return scrollView as HTMLDivElement
    }

    return
  }, [ overlayScrollRef.current ])

  return (
    <ScrollEl
      defer
      ref={overlayScrollRef}
      element="div"
      options={{
        scrollbars: {
          autoHide: 'scroll',
          autoHideDelay: 500,
        },
      }}
      children={props.children}
    />
  )
}

export default forwardRef(ScrollView)
export type { ScrollViewProps }

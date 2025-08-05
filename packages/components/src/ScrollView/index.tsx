import {
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'

import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentRef
} from 'overlayscrollbars-react'

import {
  OverlayScrollbars,
  OnUpdatedEventListenerArgs,
  EventListeners,
} from 'overlayscrollbars'

import 'overlayscrollbars/overlayscrollbars.css'

import { styled } from '../stitched'

// -> Types
// --------

// TODO: Make it so that the component accepts a
// margin/padding prop, and allows the scroll view to be
// pinned to the bottom through a prop as well
interface ScrollViewProps extends React.PropsWithChildren {
  className?: string
  css?: Record<string, any>
  ref?: React.RefObject<HTMLDivElement>
  events?: EventListeners | null
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

  useImperativeHandle(ref, () => {
    if (overlayScrollRef.current) {
      const element = overlayScrollRef.current.getElement()
      const scrollView = element?.children[1]

      console.log({
        hasElement: !!element,
        hasChildren: !!element?.children?.length,
        element,
        scrollView,
        overlayScrollRef
      })

      //return scrollView as HTMLDivElement
      return element as HTMLDivElement
    }

    return
  }, [ overlayScrollRef.current ])

  return (
    <ScrollEl
      defer
      ref={overlayScrollRef}
      css={props.css}
      element="div"
      events={props.events}
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

ScrollView.toString = () => '.rg-scroll-view'
export default forwardRef(ScrollView)
export type {
  ScrollViewProps,
  OnUpdatedEventListenerArgs,
  OverlayScrollbars
}

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect
} from 'react'

import ScrollView from '../ScrollView'
import { styled } from '../stitched'

// -> Types
// --------

interface PanelProps extends React.PropsWithChildren {
  initialBodyHeight?: number | undefined
  initialHide?: boolean
  className?: string
}

type PanelContext = {
  hideBody: boolean
  initialBodyHeight: number | undefined
  setBodyHidden: React.Dispatch<
    React.SetStateAction<boolean>
  >
}

// -> Header
// -----------

const HeaderEl = styled('div', {
  minHeight: 45,
  height: 'fit-content',
  maxHeight: 'fit-content',

  flexShrink: 0,
  btRadius: 10,
  border: '2px solid $bgDark',

  background: '$bgBase',
})

const PanelHeader = ({
  children,
  ...props
}: React.PropsWithChildren) => {
  const { hideBody, setBodyHidden } =
    useContext(PanelContext)

  const onHeaderClick = () =>
    setBodyHidden(!hideBody)

  return (
    <HeaderEl
      className="cg-panel-header"
      onClick={onHeaderClick}
      {...props}
    >
      { children }
    </HeaderEl>
  )
}

// -> Body
// -------

const BodyEl = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  flexGrow: 1,
  background: '$bgDark',
  bbRadius: 10,

  minHeight: 20,
  height: 'fit-content',
  overflowY: 'hidden',

  variants: {
    hidden: {
      true: {  }
    }
  }
})

const BodyInner = styled(ScrollView, {
  height: '100%',
  maxHeight: 'calc(100% - 10px)',
})

const ResizeHandle = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: 'calc(100% - 2px)',
  height: 10,
  backgroundColor: '$bgBase',
  border: '1px solid $bgDark',
  bbRadius: 10,

  '&::before': {
    content: '',
    width: 35,
    height: 1,
    backgroundColor: '$fg30',
    cursor: 'pointer'
  }
})

const PanelBody = ({
  children,
  ...props
}: React.PropsWithChildren) => {
  const bodyRef = useRef<HTMLDivElement|null>(null)
  const { hideBody, initialBodyHeight } =
    useContext(PanelContext)

  const [ isDragging, setIsDragging ] = useState(false)
  const [ bodyHeight, setBodyHeight ] =
    useState(initialBodyHeight)

  const getBodyRect = (): DOMRect | null => bodyRef.current
    ? bodyRef.current.getBoundingClientRect()
    : null

  const getScrollHeight = (): number => bodyRef.current
    ? bodyRef.current.scrollHeight + 10
    : 0

  const onResizeMouseDown = (
    ev: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ): void => {
    ev.stopPropagation()
    ev.preventDefault()

    if (!isDragging) setIsDragging(true)
  }

  const onResizeMouseUp = (): boolean | void =>
    isDragging && setIsDragging(false)

  const onResizeMouseMove = (ev: MouseEvent): void => {
    const bodyRect = getBodyRect()
    if (!bodyRect || !isDragging) return

    const movement = ev?.clientY - bodyRect?.bottom
    const currentHeight = (bodyHeight || bodyRect.height)
    const newHeight = Math.min(
      Math.max(currentHeight + movement, 20),
      getScrollHeight())

    setBodyHeight(newHeight)
  }

  useEffect(() => {
    const bodyRect = getBodyRect()

    if (bodyRect && !bodyHeight)
      setBodyHeight(getScrollHeight())

    window.addEventListener('mouseup', onResizeMouseUp)
    window.addEventListener('mousemove', onResizeMouseMove)

    return () => {
      window.removeEventListener('mouseup', onResizeMouseUp)
      window.removeEventListener(
        'mousemove',
        onResizeMouseMove
      )
    }
  })

  return (
    <BodyEl
      className="cg-panel-body"
      hidden={hideBody}
      css={{ height: bodyHeight }}
      {...props}
    >
      <BodyInner ref={bodyRef} children={children} />
      <ResizeHandle onMouseDown={onResizeMouseDown} />
    </BodyEl>
  )
}

// -> Context
// ----------

const PanelContext = createContext({
  hideBody: true,
  initialBodyHeight: 0,
  setBodyHidden: () => {},
} as PanelContext)

// -> Main
// -------

const ContainerEl = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 10,

  minWidth: 200,
  boxShadow: '0px 4px 17px -5px rgba(0, 0, 0, .25)'
})


const Panel = ({
  children,
  initialBodyHeight,
  initialHide = false,
  ...props
}: PanelProps) => {
  const [ hideBody, setBodyHidden ] = useState(initialHide)
  const contextVal = {
    initialBodyHeight,
    hideBody,
    setBodyHidden
  }

  return (
    <ContainerEl className="cg-panel" {...props}>
      <PanelContext.Provider value={contextVal}>
        { children }
      </PanelContext.Provider>
   </ContainerEl>
  )
}

Panel.toString = () => '.cg-panel'
Panel.Header = PanelHeader
Panel.Header.toString = () => '.cg-panel-header'
Panel.Body = PanelBody
Panel.Body.toString = () => '.cg-panel-body'

export default Panel
export type { PanelProps }

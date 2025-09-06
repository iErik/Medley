import type * as Stitches from '@stitches/react'
import { useRef, useState } from 'react'
import { styled } from '@stitched'


type ResizeableDivProps = {
  children?: React.ReactNode
  css?: Stitches.CSS
  handlePos: 'top' | 'bottom' | 'left' | 'right'
}

enum GrowAxis {
  XAxis,
  YAxis
}

const ResizeableDiv = (props: ResizeableDivProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(0)

  const axis = ['top', 'bottom'].includes(props.handlePos)
    ? GrowAxis.YAxis
    : GrowAxis.XAxis

  const sizeProp = axis === GrowAxis.XAxis
    ? 'width'
    : 'height'
  const elSizeProp = axis === GrowAxis.XAxis
    ? 'offsetWidth'
    : 'offsetHeight'
  const evPosProp = axis === GrowAxis.XAxis
    ? 'movementX'
    : 'movementY'

  // Of course it is very convinient to use movementX/Y
  // here, but according to MDN it can problematic in
  // certain scenarios depending on the browser/platform,
  // so we should keep that in mind.
  const onResize = (ev: MouseEvent) => {
    setSize(prev => prev + ev[evPosProp])
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onResize)
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('mouseout', onMouseUp)
  }

  const onHandleClick = () => {
    if (size === 0 && containerRef.current)
      setSize(containerRef.current[elSizeProp])

    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseout', onMouseUp)
    window.addEventListener('mousemove', onResize)
  }

  return (
    <Container
      ref={containerRef}
      css={{
        ...(props.css || {}),
        ...(size ? { [sizeProp]: `${size}px`} : {})
      }}
    >
      { props.children }

      <ResizeHandle
        position={props.handlePos}
        onMouseDown={onHandleClick}
      />
    </Container>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Container = styled('div', {
  position: 'relative'
})

const ResizeHandle = styled('span', {
  position: 'absolute',
  cursor: 'col-resize',

  variants: {
    position: {
      top: {
        width: '100%',
        height: 4,
        top: 0
      },
      bottom: {
        width: '100%',
        height: 4,
        bottom: 0
      },
      left: {
        height: '100%',
        width: 4,
        left: 0
      },
      right: {
        height: '100%',
        width: 4,
        right: 0
      },
    },
  }
})

export default ResizeableDiv

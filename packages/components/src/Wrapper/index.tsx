import type * as Stitches from '@stitches/react'
import { BaseWrapper } from '@ierik/react-generics'
import { styled } from '../stitched'

// -> Types
// --------

type HAlignValue = 'right' | 'center' | 'left' | 'stretch'
type VAlignValue = 'top' | 'center' | 'bottom'

interface WrapperProps extends React.PropsWithChildren {
  column?: boolean
  hAlign?: HAlignValue
  vAlign?: VAlignValue
  css?: Stitches.CSS
  className?: string
  onClick?: Function
}

// -> Main
// -------

const Wrapper = styled(BaseWrapper, {

})

export default Wrapper
export type { WrapperProps }


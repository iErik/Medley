export = ConcordGenerics
export as namespace ConcordGenerics

import {
  FunctionComponent as FC,
  PropsWithChildren
} from 'react'

import { ButtonProps } from './Button'
import { WrapperProps } from './Wrapper'
import { PanelProps } from './Panel'
import { ScrollViewProps } from './ScrollView'

interface PanelComponent extends FC<PanelProps> {
  Header: FC<PropsWithChildren>
  Body: FC<PropsWithChildren>
}

declare namespace ConcordGenerics {
  export {
    ButtonProps,
    WrapperProps,
    PanelProps
  }

  /**
   * A basic and stylish button component
   */
  export const Button: FC<ButtonProps>

  /**
   * A basic flexbox wrapper component
   */
  export const Wrapper: FC<WrapperProps>

  /**
   * A basic text component
   */
  export const Text: FC<PropsWithChildren>

  /**
   * A Card/Panel component that can show/hide and be
   * resized by the user
   */
  export const Panel: PanelComponent

  /**
   * A wrapper component for a scrollable area with a custom
   * scrollbar powered by overlayscrollbars-react
   */
  export const ScrollView: FC<ScrollViewProps>

  /**
   * Extends the generic config
   */
  export const extendConfig: (theme: Record<string, any>) =>
    Record<string, any>
}

type ReduxAction<
  ArgsType extends Record<string, any> = Record<string, any>
> = {
  type: string
  args: ArgsType
}

type Reducers = {
  [fnName: string]: Function
}

declare module '\*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<
    React.SVGProps<SVGSVGElement>
  >
}

import type { PropsWithChildren } from 'react'

type IfProps = PropsWithChildren & {
  condition: boolean
}

const If = (props: IfProps) => {
  return (
    <>
      { props.condition ? props.children : null }
    </>
  )
}

export default If

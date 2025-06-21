import { stitch } from '..'
import * as icons from '../static/icons'
import arrowDown from '../static/icons/arrow-down.svg'

// -> Types
// --------

type IconName = keyof typeof icons

type IconProps = {
  icnName: IconName,
  size?: number | string
}

// -> ELements
// -----------

const IconWrapper = stitch('div', {
  display: 'flex'
})

// -> Component
// ------------

const Icon = (props: IconProps) => {
  const IconSVG = icons[props.icnName]
  console.log({ IconSVG })
  const StyledIcon = stitch(IconSVG, {
    width: props.size || 24,
    height: props.size || 24
  })

  console.log({ StyledIcon })

  return (
    <IconWrapper className="icon-wrapper">
      <StyledIcon/>
    </IconWrapper>
  )
}

Icon.toString = () => '.icon-wrapper'
export default Icon

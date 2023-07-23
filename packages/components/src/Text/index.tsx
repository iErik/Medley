import { BaseText } from '@ierik/react-generics';
import { styled } from '../stitches.config'

const TextEl = styled(BaseText, {
  fontFamily: '$sans',
  color: '$fgBase'
})

interface TextProps extends React.PropsWithChildren {

}

const Text = (props: TextProps) => {
  const typeToEl = {}

  return (
    <TextEl className="cg-text" {...props}>
      { props.children }
    </TextEl>
  )
}

Text.toString = () => '.cg-text'

export default Text

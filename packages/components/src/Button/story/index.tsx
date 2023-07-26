import { BaseWrapper } from '@ierik/react-generics'
import Button, { ButtonProps } from '..'
import '../../fonts.ts'

export default {
  title: 'Concord Generics/Button',
  component: Button
}

const Template = (args: ButtonProps) =>
  <BaseWrapper
    hAlign="center"
    vAlign="center"
  >
    <Button { ...args } />
  </BaseWrapper>

export const Default = Template.bind({})
Default.args = {
  text: 'Login'
}

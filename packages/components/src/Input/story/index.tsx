import { BaseWrapper } from '@ierik/react-generics'
import Input from '..'
import '../../fonts.css'

export default {
  title: 'Concord Generics/Input',
  component: Input
}

const Template = (args: any) =>
  <BaseWrapper>
    <Input {...args} />
  </BaseWrapper>

export const Text = Template.bind({})
Text.args = {
  type: 'text',
  square: true
}

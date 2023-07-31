import { BaseWrapper } from '@ierik/react-generics'
import Input from '.'

export default {
  title: 'Components/Input',
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

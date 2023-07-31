import { BaseWrapper } from '@ierik/react-generics'
import Button, { ButtonProps } from '.'

export default {
  title: 'Components/Button',
  component: Button
}

const Template = (args: ButtonProps) =>
  <BaseWrapper
    hAlign="center"
    vAlign="center"
  >
    <Button { ...args } />
  </BaseWrapper>

export const Default = Template.bind(null, {
  text: 'Login'
})

export const Squared = Template.bind(null, {
  text: 'Squared',
  square: true
})

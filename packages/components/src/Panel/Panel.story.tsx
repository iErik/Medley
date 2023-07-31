import { BaseWrapper } from '@ierik/react-generics'
import Text from '../Text'
import Panel from '.'

export default {
  title: 'Components/Panel',
  component: Panel
}

const Template = (args: any) =>
  <BaseWrapper>
    <Panel {...args}>
      <Panel.Header>
        <Text css={{ marginLeft: 20 }}>
          Pixel Pals
        </Text>
      </Panel.Header>
      <Panel.Body>
        <Text css={{ marginLeft: 20 }}>
          I'm so hot
        </Text>
      </Panel.Body>
    </Panel>
  </BaseWrapper>

export const Default = Template.bind({})

import type * as Storybook from '@storybook/react'
import MessageInput from '..'

type Meta = Storybook.Meta<typeof MessageInput>
type Story = Storybook.StoryObj<typeof MessageInput>


const meta: Meta = {
  title: 'Concord/MessageInput',
  tags: [ 'autodocs' ],
  component: MessageInput,
}

export default meta
export const Primary: Story = {
  args: {
    placeholder: 'Message @gilly'
  }
}


import ChatWindow from '..'

export default {
  title: 'Concord/ChatWindow',
  component: ChatWindow,
}

const Template = (args) => <ChatWindow {...args} />

export const Default = Template.bind({})
Default.args = { }

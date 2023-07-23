import { ReactEditor } from 'slate-react'
import { styled } from '@/stitches.config'
import Editor from './Editor'

// -> Elements
// -----------

const Wrapper = styled('div', {
  // TODO: Hardcoded values
  $$bgColor: '#E0E0E0',

  display: 'flex',

  borderRadius: 10,
  height: 45,
  width: '100%',

  paddingLeft: 20,

  backgroundColor: '$$bgColor',

  minWidth: 300,

  [`& > ${Editor}`]: {
    flex: 1,
    height: '100%',
    padding: 0,
    margin: 0,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  }
})

// -> Main Component
// -----------------

interface MessageInputProps extends JSX.IntrinsicAttributes {
  /**
   * A placeholder for the field
   */
  placeholder?: string

  /**
   * The handler to call when the user presses enter while
   * the input has focus
   */
  onEnter?: (
    value: string,
    editor: ReactEditor,
    ev: React.KeyboardEvent
  ) => void

  /**
   * Optional class name to add to the component
   */
  className?: string

  /**
   * Optional styles to add to the component
   */
  css?: Record<string, any>
}

/**
 * The UI component for the message input with support for
 * Discord-like syntax through the use of the Slate library.
 */
const MessageInput = ({
  placeholder = 'Type a message',
  onEnter = () => {},
  ...props
}: MessageInputProps) => {

  return (
    <Wrapper className="message-input" {...props}>
      <Editor
        placeholder={placeholder}
        onEnter={onEnter}
      />
    </Wrapper>
  )
}

MessageInput.toString = () => '.message-input'
export default MessageInput
export type { MessageInputProps }

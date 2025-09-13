import { Editor as SlateEditor, Transforms } from 'slate'
import { styled } from '@stitched'
import Editor, { type OnEnterEvHandler } from './Editor'

// -> Elements
// -----------

// TODO: Make height adapt to contents
const Wrapper = styled('div', {
  display: 'flex',

  borderRadius: 10,
  minHeight: 45,
  width: '100%',

  padding: '0 20px',

  backgroundColor: '$bg500',

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
  onEnter?: OnEnterEvHandler

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

  const handleEnter: OnEnterEvHandler =
    (text, editor, ev) => {
      Transforms.delete(editor, {
        at: {
          anchor: SlateEditor.start(editor, []),
          focus: SlateEditor.end(editor, [])
        }
      })

      onEnter(text, editor, ev)
    }


  return (
    <Wrapper className="message-input" {...props}>
      <Editor
        placeholder={placeholder}
        onEnter={handleEnter}
      />
    </Wrapper>

  )
}


MessageInput.toString = () => '.message-input'
export default MessageInput
export type { MessageInputProps }

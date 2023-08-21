import { useState, useCallback } from 'react'

import {
  BaseEditor,
  Descendant,
  createEditor,
  Editor,
  Path,
  Transforms,
  Text,
  Node
} from 'slate'

import {
  Slate,
  Editable,
  withReact,

  ReactEditor
} from 'slate-react'

import {
  Bold,
  Italics,
  Strike,
  Normal,
  Spoiler
} from '@parser/elements'

import * as parser from '@parser'

import { styled } from '@stitched'

// -> Types
// --------

type CustomText = {
  text: string
  bold?: boolean
  italics?: boolean
  spoiler?: boolean
  strike?: boolean
  type: 'leaf'
}

type ParagraphType = {
  type: 'paragraph'
  children: CustomText[]
}

type CodeBlockType = {
  type: 'code'
  children: CustomText[]
}

type CustomElement = ParagraphType | CodeBlockType

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const applyMarks = (editor: ReactEditor): void => {
  const editorContent: string = Node.string(editor)
  const textTokens = parser.extractTokens(editorContent, {
    preserveTokens: true
  })

  Transforms.select(editor, {
    anchor: Editor.start(editor, []),
    focus: Editor.end(editor, [])
  })

  Transforms.insertNodes(editor, textTokens.map(token => ({
    ...token,
    type: 'leaf',
    text: token?.content || '',
  })))
}

// -> Generics
// -----------

const Paragraph = styled('p', {
  fontFamily: '$sans',
  fontWeight: '$medium',
  color: '#333',
  fontSize: '$base'
})

// -> Bold Node
// -----------

interface BoldNode {
  children: BoldNode[]
}

// -> Elements
// -----------

const EditableEl = styled(Editable, {
  width: '100%',

  // Center text
  display: 'flex',
  alignItems: 'center',

  fontFamily: '$sans',
  fontWeight: '$medium',
  color: '#333',
  fontSize: '$base'
})

const CodePre = styled('pre', {

})

const CodeEl = styled('code', {

})

const CodeBlock = (props: any) =>
  <CodePre { ...props.attributes }>
    <CodeEl>
      { props.children }
    </CodeEl>
  </CodePre>

const DefaultElement = (props: any) => {
  return (
    <Paragraph className="this-is-el" { ...props.attributes }>
      { props.children }
    </Paragraph>
  )
}

const leafMap = {
  bold: Bold,
  italics: Italics,
  strike: Strike,
  spoiler: Spoiler,
}

const Leaf = (props: any) => {
  const wrappedLeaf = Object.entries(leafMap)
    .reduce((acc, [ markName, LeafComponent ]) =>
      props.leaf[markName]
        ? <LeafComponent>{ acc }</LeafComponent>
        : acc, <Normal>{ props.children }</Normal>)

  return (
    <span
      { ...props.attributes }
      className="this-is-leaf"
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      { wrappedLeaf }
    </span>

  )
}

// -> Main Component
// -----------------

export interface TextEditorProps {
  /**
   * Optional initial value for the field, defaults to an empty
   * array, can be used to re-use previous serialized state of
   * the editor
   */
  initialValue?: Descendant[]

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
   * An optional placeholder string for the field
   */
  placeholder?: string
}

const defaultInitial: Descendant[] = [
  {
    type: 'paragraph',
    children: [ { text: '', type: 'leaf' } ]
  }
]

const TextEditor = ({
  initialValue = defaultInitial,
  onEnter = () => {},
  placeholder = ''
}: TextEditorProps) => {
  const [ editor ] = useState(() =>
    withReact(createEditor()))

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case 'code':
        return <CodeBlock { ...props } />
      default:
        return <DefaultElement { ...props } />
    }
  }, [])

  const renderLeaf = useCallback((props) =>
    <Leaf { ...props } />, [])

  const handleKeyUp = (ev: React.KeyboardEvent) => {
    applyMarks(editor)

    if (ev.key === 'Enter')
      onEnter(Node.string(editor), editor, ev)
  }

  return (
    <Slate
      editor={editor}
      value={initialValue}
      className="text-editor"
    >
      <EditableEl
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyUp={handleKeyUp}
        placeholder={placeholder}
      />
    </Slate>
  )
}

export default TextEditor

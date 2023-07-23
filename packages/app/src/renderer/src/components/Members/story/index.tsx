import type * as Storybook from '@storybook/react'

import { styled } from '@/stitches.config'
import { members } from './mock'

import MemberList from '../List'
import MemberPanel from '../Panel'

// -> Types
// --------
type Meta = Storybook.Meta<typeof MemberPanel>
type ListStory = Storybook.StoryObj<typeof MemberList>

// -> Elements
// -----------

const Container = styled('div', {
  display: 'grid',
  gridTemplateRows: 'max(100%)',
  justifyContent: 'center',

  maxHeight: 800,
  width: 500,

  border: '4px solid $bgDark',
  borderRadius: 10,
})

// -> Stories
// ----------

const meta: Meta = {
  title: 'Concord/Members',
  tags: [ 'autodocs' ],
  component: MemberPanel,
}

export const List: ListStory = {
  render: () =>
    <Container>
      <MemberList members={members.items} />
    </Container>
}

export default meta

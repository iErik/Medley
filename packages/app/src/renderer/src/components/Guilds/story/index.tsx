import type * as Storybook from '@storybook/react'

import { styled } from '@/stitches.config'

import GuildPanel from '../Panel'
import GuildList from '../List'
import { guilds } from './mock'

// -> Types
// --------

type Meta = Storybook.Meta<typeof GuildPanel>
type ListStory = Storybook.StoryObj<typeof GuildList>
type PanelStory = Storybook.StoryObj<typeof GuildPanel>

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
  title: 'Concord/Guilds',
  tags: [ 'autodocs' ],
  component: GuildPanel,
}

export const List: ListStory = {
  render: () =>
    <Container>
      <GuildList
        guilds={guilds}
        css={{ maxHeight: '100%' }}
      />
    </Container>
}

export const Panel: PanelStory = {
  render: () => <GuildPanel guild={guilds[0]} />,
}

export default meta

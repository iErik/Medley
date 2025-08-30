import { memo, useMemo } from 'react'

import { styled } from '@/stitches.config'
import { Guild} from '@ierik/discordance-api'

import { Wrapper } from '@ierik/medley-components'
import GuildPanel from '@components/Guilds/Panel'
import Icon from '@components/Icon'

// -> Elements
// -----------

const headerHeight = 65

const GridContainer = styled('div', {
  display: 'grid',
  gridTemplateRows: '1fr',
})

const HeaderWrapper = styled(Wrapper, {
  fleShrink: 0,
  paddingTop: 20,
  height: 'fit-content',

  [`& > ${Icon}`]: {
    marginLeft: 10,
    visibility: 'hidden',

    '& > svg': { fill: '#FFF' }
  }
})

const ListWrapper = styled(Wrapper, {
  flexDirection: 'column',
  flexShrink: 0,

  width: 'fit-content',
  overflowY: 'auto',

  paddingBottom: 20,
  paddingTop: 20,

  [`& > ${GuildPanel}:not(:last-child)`]: { marginBottom: 10 },

  '&::-webkit-scrollbar': { display: 'none' },
})

// -> Component Export
// -------------------

export interface GuildListProps extends JSX.IntrinsicAttributes {
  guilds: Guild.MappedGuild[]
  onSelectChannel?: (channelId: string, guildId: string) => void
  className?: string
  css?: Record<string, any>
}

const GuildList = ({
  onSelectChannel,
  guilds,
  ...props
}: GuildListProps) => {
  const mapGuild = (guild: Guild.MappedGuild) =>
    <GuildPanel
      key={guild.id}
      guild={guild}
      onSelectChannel={onSelectChannel}
    />

  const mappedGuilds = useMemo(() =>
    guilds?.map(mapGuild), [ guilds ])

  return (
    <GridContainer { ...props }>
      <ListWrapper>
        { mappedGuilds }
      </ListWrapper>
    </GridContainer>
  )
}

export default memo(GuildList)

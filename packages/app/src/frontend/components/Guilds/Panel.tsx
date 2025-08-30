import { memo, useMemo } from 'react'

import type { Guild } from '@ierik/discordance-api'

import {
  Wrapper,
  Text,
  Panel,
} from '@ierik/medley-components'

import { styled } from '@/stitches.config'
import Icon from '@components/Icon'


// -> Type Aliases
// ---------------

type MappedGuild   = Guild.MappedGuild
type ChatChannel   = Guild.ChatChannel
type GuildCategory = Guild.GuildCategory

// -> Elements
// -----------

const GuildPanelEl = styled(Panel, {
  width: 250
})

const PanelText = styled(Text, {
  fontFamily: '$sans',
  color: '$fgBase'
})

// -> Header
// ---------

const GuildName = styled(PanelText, {
  fontFamily: '$sans',
  fontSize: 18,
  marginLeft: 10,
  ellipsis: 'calc(100% - 70px)'
})

const GuildIcon = styled('div', {
  height: '100%',
  width: 43,
  backgroundSize: '100% 100%',
  borderTopLeftRadius: 10,
})

const GuildHeader = styled(Wrapper, {
  height: 45,
  flexShrink: 0,
  padding: 0,
  alignItems: 'center',

  [`& > ${Icon} > svg`]: {
    fill: '#FFF',
    marginRight: 10
  }
})

// -> Body/Categories
// ------------------

const CategoriesList = styled(Wrapper, {
  overflowX: 'hidden',
  overflowY: 'auto',
  position: 'relative',
  height: 'fit-content',
  flexShrink: 0,

  '& > div': { flexShrink: 0 },
  '& > :first-child': { marginTop: 15 },
  '& > :last-child': { marginBottom: 20 },
  '& > :not(:last-child)': { marginBottom: 15 },
})

const CategoryItem = styled(Wrapper, {
  flexDirection: 'column',
  flexShrink: 0,
  margin: '0 10px',
  height: 'fit-content',
  width: 'calc(100% - 20px)'
})

const CategoryName = styled(PanelText, {
  // TODO: Hardcoded color: '#DB3F8A',
  textTransform: 'uppercase',
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 5,
  ellipsis: '100%',

  '&:before': {
    content: '☆',
    marginRight: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
})

// -> Channel
// ----------

const ChannelName = styled(PanelText, {
  color: 'rgba(255, 255, 255, .53)',
  ellipsis: '100%',
  fontFamily: '$sans',

  variants: {
    unread: {
      true: { color: '#FFF' }
    }
  },
})

const ChannelWrapper = styled(Wrapper, {
  alignItems: 'center',
  height: 'fit-content',
  cursor: 'pointer',
  borderRadius: 4,
  backgroundColor: 'transparent',
  transition: 'background-color 300ms ease',

  padding: '6px 13px',

  '&:not(:last-child)': { marginBottom: 5 },
  '&:hover': {
    backgroundColor: '$bgBase'
  },

  [`& > ${Icon} > svg`]: { fill: '$fgBase' },
  [`& > ${ChannelName}`]: { marginLeft: 8 }
})

// -> Types
// --------

type GuildPanelProps = {
  guild: MappedGuild,
  css?: Record<string, any>
  onSelectChannel?: (channelId: string, guildId: string) => void
}

// -> Component Export
// -------------------

const GuildPanel = ({
  guild,
  onSelectChannel = () => {},
}: GuildPanelProps) => {
  const onChannelClick = (channel: ChatChannel): void =>
    onSelectChannel(channel.id, channel.guild_id)

  const mapChannels = (channels: Array<ChatChannel>) =>
    channels.map(channel => (
      <ChannelWrapper
        key={channel.id}
        onClick={onChannelClick.bind(null, channel)}
      >
        <Icon icon="Chat" size={18} />
        <ChannelName unread={channel.unread}>
          { channel.name }
        </ChannelName>
      </ChannelWrapper>))

  const categories = useMemo(() => guild.categories
    ?.map((cat: GuildCategory) => (
      <CategoryItem key={cat.id}>
        <CategoryName>
          { cat?.name }
        </CategoryName>

        { mapChannels(cat?.children) }
      </CategoryItem>)), [ guild.categories ])

  return (
    <GuildPanelEl
      className="guild-panel"
      initialBodyHeight={400}
      initialHide
    >
      <Panel.Header>
        <GuildHeader>
          <GuildIcon
            css={{
              backgroundImage: `url(${guild?.info?.icon_src})`
            }}
          />

          <GuildName>
            { guild.name }
          </GuildName>
        </GuildHeader>
      </Panel.Header>

      <Panel.Body>
        <CategoriesList column>
          { categories }
        </CategoriesList>
      </Panel.Body>
    </GuildPanelEl>
  )
}

GuildPanel.toString = () => '.guild-panel'

export default memo(GuildPanel)

import { useNavigate } from 'react-router-dom'

import { styled } from '@stitched'
import {
  Text,
  Icon,
  ScrollView
} from '@ierik/medley-components'

import type {
  PopulatedServer,
  PopulatedCategory,
  ServerChannel,
  Asset
} from '@store/chat'

// -> Elements
// -----------

type ServerBannerProps = { banner: Asset }
const ServerBanner = ({ banner }: ServerBannerProps) => {
  const bgUrl = banner?.src || ''

  const ServerBannerEl = styled('div', {
    flexShrink: 0,
    width: '$panelWidth',
    height: 115,

    borderRadius: '$panelBorderRadius',

    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundImage: `url(${bgUrl})`
  })

  return <ServerBannerEl />
}

// Channel
// -------

const ChannelWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',

  padding: '8px 8px 8px 15px',
  borderRadius: 5,

  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'background-color 300ms ease',

  '&:hover': {
    backgroundColor: '$bgLight'
  },

  [`& > ${Icon}`]: {
    marginRight: 10,

    'svg path': { fill: '$fg40' }
  }
})

const ChannelName = styled(Text, {
  fontFamily: '$decorative',
  color: '$fg40',
  fontSize: 16,

  ellipsis: '100%'
})

const ChannelList = styled('div', {})

// Category
// --------

const CategoryWrapper = styled('div', {
  padding: '30px 12px 0 12px',

  '&:first-child': {
    paddingTop: 20
  }
})


const CategoryNameWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginBottom: 12,

  [`& > ${Icon}`]: {
    marginRight: 5
  },

  [`& > ${Icon} svg path`]: {
    fill: '#4CB0E3'
  }
})

const CategoryName = styled(Text, {
  fontFamily: '$decorative',
  color: '$fg40',
  fontSize: 16,
})

// -> Wrapper/ChannelBox
// ---------------------

const ChannelsBox = styled('div', {
  width: '$panelWidth',
  flexGrow: 1,

  padding: '10px 0',

  background: '$channelsPanelBgDark',
  borderRadius: '$panelBorderRadius',
})

const ChannelsInner = styled(ScrollView, {

})

const PanelWrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto',
  gridTemplateRows: 'auto minmax(100px, 3fr)',

  padding: '10px 15px 15px',

  [`& > ${ChannelsBox}`]: {
    marginTop: 10
  }
})

// -> Component
// ------------

type ServerPanelProps = { server: PopulatedServer }
const ServerPanel = ({ server }: ServerPanelProps) => {
  const navigate = useNavigate()

  const onChannelSelect = (channel: ServerChannel) => {
    const { server, _id } = channel
    navigate(`/servers/${server}/${_id}`)
  }

  const mapChannels = (
    channels: ServerChannel[]
  ) => channels.map(channel =>
    <ChannelWrapper
      key={channel._id}
      onClick={onChannelSelect.bind(null, channel)}
    >
      <Icon
        icnName="channel"
        size={15}
      />
      <ChannelName>
        { channel?.name }
      </ChannelName>
    </ChannelWrapper>
  )

  const categories = server?.categories
    ?.map((cat: PopulatedCategory) =>
      <CategoryWrapper key={cat.id}>
        <CategoryNameWrapper>
          <Icon
            icnName="arrowRight"
            size={10}
          />

          <CategoryName>
            { cat?.title }
          </CategoryName>
        </CategoryNameWrapper>

        <ChannelList>
          { mapChannels(cat?.channels) }
        </ChannelList>
      </CategoryWrapper>
    )

  return (
    <PanelWrapper>
      <ServerBanner banner={server?.banner} />

      <ChannelsBox>
        <ChannelsInner>
          { categories }
        </ChannelsInner>
      </ChannelsBox>
    </PanelWrapper>
  )
}


export default ServerPanel

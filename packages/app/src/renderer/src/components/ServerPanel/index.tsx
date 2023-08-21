import { useNavigate } from 'react-router-dom'
import { Chat } from '@ierik/revolt'
import { Text, ScrollView } from '@ierik/medley-components'
import { styled } from '@stitched'

import type { MappedServer, MappedAsset } from '@store/chat'

// -> Elements
// -----------

type ServerBannerProps = { banner: MappedAsset }
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
  padding: '8px 8px 8px 15px',
  borderRadius: 5,

  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'background-color 300ms ease',

  '&:hover': {
    backgroundColor: '$bgLight'
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
})

const CategoryName = styled(Text, {
  fontFamily: '$decorative',
  color: '$fg40',
  fontSize: 16,
  marginBottom: 12
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

type ServerPanelProps = { server: MappedServer }
const ServerPanel = ({ server }: ServerPanelProps) => {

  const onChannelSelect = (channel: Chat.RevoltChannel) => {

  }

  const mapChannels = (
    channels: Array<Record<string, any>>
  ) => channels.map(channel =>
    <ChannelWrapper
      key={channel._id}
      onClick={onChannelSelect}
    >
      <ChannelName>
        { channel?.name }
      </ChannelName>
    </ChannelWrapper>
  )

  const categories = server?.categories
    ?.map((cat: Record<string, any>) =>
      <CategoryWrapper key={cat.id}>
        <CategoryNameWrapper>
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

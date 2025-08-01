import { useNavigate } from 'react-router'
import { Text, ScrollView } from '@ierik/medley-components'
import { styled } from '@stitched'

import type {
  MServer,
  MCategory,
  ServerChannel,
} from '@store/chat'

import { Asset } from '@store/shared/types'


type ServerPanelProps = {
  server: MServer
  onSelectChannel?: (channelId: ServerChannel) => any
}

const ServerPanel = (props: ServerPanelProps) => {
  const mapChannels = (
    channels: ServerChannel[]
  ) => channels.map(channel =>
    <ChannelWrapper
      key={channel._id}
      onClick={props.onSelectChannel?.bind(null, channel)}
    >
      <ChannelName>
        { channel?.name }
      </ChannelName>
    </ChannelWrapper>
  )

  const categories = props.server?.categories
    ?.map((cat: MCategory) =>
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
      <ServerBanner banner={props.server?.banner} />

      <ChannelsBox>
        <ChannelsInner>
          { categories }
        </ChannelsInner>
      </ChannelsBox>
    </PanelWrapper>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

type ServerBannerProps = {
  banner: Asset
}

const ServerBanner = ({ banner }: ServerBannerProps) => {
  const bgUrl = banner?.src || ''

  const ServerBannerEl = styled('div', {
    flexShrink: 0,
    width: '$panelWidth',
    //height: 115,
    height: 180,

    //borderRadius: '$panelBorderRadius',
    borderBottomLeftRadius: '$panelBorderRadius',
    borderBottomRightRadius: '$panelBorderRadius',

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
    paddingTop: 10
  }
})


const CategoryNameWrapper = styled('div', { })

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

  background: '$serverPaneBg',
  //borderRadius: '$panelBorderRadius',

  //[`& > ${ChannelsBox}`]: { marginTop: 10 }
})

export default ServerPanel

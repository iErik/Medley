import {
  useContext,
  createContext,
  useState
} from 'react'

import {
  If,
  Text,
  ScrollView,
  Flexbox
} from '@ierik/medley-components'

import Icon from '@components/Icon'
import { styled } from '@stitched'

import type {
  MServer,
  MCategory,
  ServerChannel,
  ChannelUnread,
} from '@store/chat'

import { Asset } from '@store/shared/types'


const BANNER_HEIGHT = 180


type onSelectChannelFn = (channelId: ServerChannel) => any

type ServerPanelProps = {
  server: MServer,
  unreads: Record<string, ChannelUnread>,
  activeChannel?: string,
  onSelectChannel?: onSelectChannelFn
}


// TODO: Unread logic is wrong
const ServerPanel = (props: ServerPanelProps) => {
  const categories = (props.server?.categories || [])
    .map(cat =>
      <Category
        key={cat.id}
        onSelectChannel={props.onSelectChannel}
        category={cat}
      />)

  const uncategorized = (props?.server?.uncategorized || [])
    .map(chan =>
      <Channel
        key={chan._id}
        onSelect={props.onSelectChannel}
        channel={chan}
      />)

  const isChannelUnread = (channelId: string) =>
    channelId in props.unreads

  return (
    <ServerPanelContext.Provider value={{
      activeChannel: props.activeChannel || '',
      onSelectChannel: props.onSelectChannel || null,
      isChannelUnread,
    }}>
      <PanelWrapper>
        <ServerHeader server={props.server} />

        <ChannelsBox>
          <ChannelsInner>
            { uncategorized }
            { categories }
          </ChannelsInner>
        </ChannelsBox>
      </PanelWrapper>
    </ServerPanelContext.Provider>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

type ServerBannerProps = {
  banner: Asset | null
}

const ServerBanner = ({ banner }: ServerBannerProps) => {
  const bgUrl = banner?.src || ''

  const ServerBannerEl = styled('div', {
    position: 'absolute',
    top: 0,
    left: 0,

    flexShrink: 0,
    width: '$panelWidth',
    height: BANNER_HEIGHT,

    //borderRadius: '$panelBorderRadius',
    borderBottomLeftRadius: '$panelBorderRadius',
    borderBottomRightRadius: '$panelBorderRadius',

    borderTopLeftRadius: '$baseRadius',
    borderTopRightRadius: '$baseRadius',

    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundImage: `url(${bgUrl})`
  })

  return <ServerBannerEl />
}

const ServerHeaderWrapper = styled('div', {
  position: 'relative',
  maxWidth: '100%',

  variants: {
    hasBanner: {
      true: { height: BANNER_HEIGHT },
      false: {  }
    }
  }
})


const ServerTitleWrapper = styled('div', {
  position: 'relative',
  zIndex: '1',

  display: 'flex',
  alignItems: 'center',
  //justifyContent: 'center',

  height: 40,
  background: '$bg200',

  borderTopLeftRadius: '$baseRadius',
  borderTopRightRadius: '$baseRadius',

  padding: '0 20px',

  variants: {
    blurred: {
      true: {
        opacity: .6,
        backdropFilter: 'blur(4px)'
      }
    }
  }
})

const ServerTitle = styled(Text, {
  fontFamily: '$sans',
  color: '$fgBase',
  fontSize: 16,
  fontWeight: '$semibold',
  useSelect: 'none',

  ellipsis: '100%'
})

const ServerHeader = (props: { server: MServer }) => {
  const hasBanner = !!props.server?.banner?.src

  return (
    <ServerHeaderWrapper hasBanner={hasBanner}>
      <ServerTitleWrapper blurred={hasBanner}>
        <ServerTitle>
        { props.server?.name }
        </ServerTitle>
      </ServerTitleWrapper>

      <If condition={hasBanner}>
        <ServerBanner banner={props.server?.banner} />
      </If>
    </ServerHeaderWrapper>
  )
}

// Channel
// -------

const ChannelName = styled(Text, {
  fontFamily: '$decorative',
  color: '$fg40',
  fontSize: 16,
  userSelect: 'none',

  ellipsis: '100%'
})

const ChannelWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 11,
  padding: '8px 8px 8px 15px',
  borderRadius: 5,

  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'background-color 300ms ease',

  '& img': {
    height: 18,
    width: 18
  },

  [`${Icon} svg`]: {
    fill: '$fg30'
  },

  '&:hover': {
    backgroundColor: '$bg500',

    [`${ChannelName}`]: {}
  },

  variants: {
    active: { true: { backgroundColor: '$bg500' } },
    unread: {
      true: {
        [`${ChannelName}`]: { color: '$fg90' },
        [`${Icon} svg`]: { fill: '$fg90' }
      }
    }
  }
})

const Channel = (props: {
  channel: ServerChannel
  onSelect?: onSelectChannelFn
}) => {
  const {
    activeChannel,
    isChannelUnread
  } = useContext(ServerPanelContext)

  const { icon } = props.channel
  const iconEl = 'src' in (icon || {})
    ? <img src={icon?.src || ''} />
    : <Icon icnName="textChannel" size={18} />

  // Disabled for now
  const isUnread =
    isChannelUnread(props.channel._id) &&
    false

  return (
    <ChannelWrapper
      onClick={props.onSelect?.bind(null, props.channel)}
      active={props.channel._id === activeChannel}
      unread={isUnread}
    >
      <Flexbox>
        { iconEl }
      </Flexbox>

      <ChannelName>
        { props.channel.name }
      </ChannelName>
    </ChannelWrapper>
  )
}

// Category
// --------

const ChannelList = styled('div', {
  overflow: 'hidden'
})


const CategoryToggleArrow = styled(Icon, {
  background: 'red',
  '& svg': { fill: 'red' }
})

const CategoryNameWrapper = styled('div', {
  display: 'flex',
  padding: '8px 8px 0px 10px',
  gap: 7,

  cursor: 'pointer',

  marginBottom: 12
})

const CategoryName = styled(Text, {
  fontFamily: '$decorative',
  color: '$fg40',
  fontSize: 16,
  ellipsis: '100%',
  userSelect: 'none'
})

const CategoryWrapper = styled('div', {
  padding: '10px 10px 0 10px',

  '&:first-child': {
    paddingTop: 10
  },

  [`${CategoryNameWrapper} ${Icon}`]: {
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 300ms ease',

    'svg': { fill: '$primaryBase' }
  },

  [`${ChannelList}`]: {
    transition: 'height 300ms ease'
  },

  variants: {
    collapse: {
      true: {
        [`${CategoryNameWrapper} ${Icon}`]: {
          transform: 'rotate(0deg)'
        },

        [`${ChannelList}`]: { height: 0 }
      },
      false: {
        [`${CategoryNameWrapper} ${Icon}`]: {
          transform: 'rotate(90deg)'
        },

        [`${ChannelList}`]: { height: 'auto' }
      }

    }
  },

  defaultVariants: {
    collapse: false
  }
})


const Category = (props: {
  category: MCategory,
  onSelectChannel?: onSelectChannelFn
}) => {
  const [ isCollapsed, setCollapsed ] = useState(false)

  const channels = (props.category?.channels || [])
    .map(chan =>
      <Channel
        key={chan._id}
        channel={chan}
        onSelect={props.onSelectChannel}
      />)

  const toggle = () => setCollapsed(!isCollapsed)

  return (
    <CategoryWrapper collapse={isCollapsed}>
      <CategoryNameWrapper onClick={toggle}>
        <Icon
          icnName="arrowRight"
          size={13}
        />
        <CategoryName>
          { props.category?.title }
        </CategoryName>
      </CategoryNameWrapper>

      <ChannelList>
        { channels }
      </ChannelList>
    </CategoryWrapper>
  )
}

// -> Wrapper/ChannelBox
// ---------------------

const ChannelsBox = styled('div', {
  flexGrow: 1,

  padding: '10px 0',

  background: '$channelsPanelBgDark',
  borderRadius: '$panelBorderRadius',
})

const ChannelsInner = styled(ScrollView, { })

const PanelWrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'minmax(0px, 1fr)',
  gridTemplateRows: 'auto minmax(100px, 3fr)',

  height: '100%',
  width: '$panelWidth',
})

// -> Context
// ----------

type ServerPanelContext = {
  activeChannel: string,
  onSelectChannel?: onSelectChannelFn | null
  isChannelUnread: (channelId: string) => boolean
}

const ServerPanelContext = createContext<ServerPanelContext>({
  activeChannel: '',
  onSelectChannel: null,
  isChannelUnread: () => false
})

export default ServerPanel

import { useState } from 'react'
import { useSelf } from '@store/auth'

import { styled } from '@stitched'
import { If, Flexbox } from '@packages/components'

import { routeSlotsFor } from '@utils/router'

import Icon from '@components/Icon'
import UserCard from '@components/UserCard'

import { Chat, HomeScreen, ServerSidebar } from './shared'
import { FriendList } from './friends'
import { ServerPanel } from './server'


const IS_MAC = ElectronIPC.platform() === 'darwin'

type RouteParams = { params: Record<string, any> }

const SubRoutes = {
  server: {
    path: '/server/:serverId/channel/:channelId?',
    components: {
      sidebar: () => <ServerPanel />,
      main: ({ params }: RouteParams) =>
        <Chat channelId={params.channelId} />,
      header: () => <></>
    }
  },
  directs: {
    path: '/directs/:channelId',
    components: {
      sidebar: () => <FriendList />,
      main: ({ params }: RouteParams) =>
        <Chat channelId={params.channelId} />,
      header: () => <></>
    }
  },
  home: {
    components: {
      sidebar: () => <FriendList />,
      main: () => <HomeScreen />,
      header: () => <></>
    }
  }
}



// TODO: Properly set max-width for sidebar slot
export default function App() {
  const [hideServers, setHideServers] = useState(false)
  const user = useSelf()

  const toggleServers = () => {
    setHideServers(!hideServers)
  }

  // The structure and behaviour of the layout differs on
  // macOS because of the positioning of the
  // "traffic lights" window controls
  const sidebarVisibility = !hideServers
    ? 'visible'
    : IS_MAC
    ? 'autohide'
    : 'hidden'

  return (
    <Root>
      <Grid>
        <HeaderbarLeft macos={IS_MAC}>
          <If condition={!IS_MAC}>
            <Button onClick={toggleServers}>
              <Icon
                icon="ArrowSquareLeft"
                size={25}
              />
            </Button>
          </If>

          <If condition={!!user}>
            <UserCard user={user} />
          </If>
        </HeaderbarLeft>

        <LeftColumn>
          <ServerSidebar
            visibility={sidebarVisibility}
            showToggle={IS_MAC}
            hidden={hideServers}
            onToggleVisibility={toggleServers}
          />

          { routeSlotsFor(SubRoutes, 'sidebar') }
        </LeftColumn>
      </Grid>

      <Grid>
        <HeaderbarRight macos={IS_MAC}>
        </HeaderbarRight>

        <RightColumn>
          { routeSlotsFor(SubRoutes, 'main') }
        </RightColumn>
      </Grid>
    </Root>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const HEADER_HEIGHT = 55

const Root = styled('div', {
  display: 'grid',
  height: '100%',
  width: '100%',
  gridTemplateColumns: 'auto minmax(0px, 1fr)'
})

const Grid = styled('div', {
  display: 'grid',
  gridTemplateRows: `${HEADER_HEIGHT}px minmax(0, 1fr)`,
  gridTemplateColumns: `minmax(0, 1fr)`,
  height: '100vh'
})

const HeaderbarLeft = styled(Flexbox, {
  height: HEADER_HEIGHT,
  paddingLeft: 5,
  paddingBottom: 5,
  paddingTop: 5,
  gap: 5,


  variants: {
    macos: {
      true: {
        '-webkit-app-region': 'drag',
        paddingLeft: 80
      }
    }
  },

  defaultVariants: { }
})

const HeaderbarRight = styled(Flexbox, {
  height: HEADER_HEIGHT,
  padding: 5,

  variants: {
    macos: { true: { '-webkit-app-region': 'drag', } }
  },

  defaultVariants: {
    vAlign: 'start',
    direction: 'row'
  }
})

const LeftColumn = styled(Flexbox, {
  position: 'relative',
  paddingLeft: 5,
  paddingBottom: 5,

  flexGrow: 1
})

const RightColumn = styled(Flexbox, {
  width: '100%',
  transition: 'width 300ms ease',
  paddingBottom: 5,
  paddingRight: 5,

  flexGrow: 1
})

// This Button *has* to be the same width as our Server
// List, otherwise the layout will look incoherent and
// disgruntled.
const Button = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  background: '$bg300',
  padding: 10,
  borderRadius: 5,
  flexShrink: 0,

  cursor: 'pointer',
  width: '$serverList',
})

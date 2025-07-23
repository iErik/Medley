import { useSelector } from '@store'

import { styled } from '@stitched'
import Icon from '@components/Icon'

import ServerList from '@components/ServerList'
import FriendList from './FriendList'
import UserCard from './UserCard'

const HEADER_HEIGHT = 55

const Root = styled('div', {
  display: 'grid',
  height: '100%',
  width: '100%',
  gridTemplateColumns: 'auto 1fr'
})


const Box = styled('div', {
  display: 'flex',

  variants: {
    hAlign: {
      right: {
        alignItems: 'flex-start'
      },
      center: {
        alignItems: 'center'
      },
      left: {
        alignItems: 'flex-end'
      },
      stretch: {
        alignItems: 'stretch'
      }
    },

    vAlign: {
      top: {
        justifyContent: 'flex-start'
      },
      center: {
        justifyContent: 'center'
      },
      bottom: {
        justifyContent: 'flex-end'
      }
    },

    direction: {
      column: { flexDirection: 'column' },
      row: { flexDirection: 'row' },
    },

    hFill: { width: '100%' },
    vFill: { height: '100%' },
    fill: { width: '100%', height: '100%' },

    background: {
      none: { background: 'none' },
      500: { background: '$bg500' },
      400: { background: '$bg400' },
      300: { background: '$bg300' },
      200: { background: '$bg200' },
      100: { background: '$bg100' },
    }
  }
})


const GridBox = styled('div', {
  display: 'grid',
})


// This Button *has* to be the same width as our Server
// List, otherwise the layout will look incoherent and
// disgruntled.
const Button = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  background: '$bg400',
  padding: 10,
  borderRadius: 5,

  width: '$serverList',

  variants: {

  }
})

const Headerbar = styled(Box, {
  height: HEADER_HEIGHT,
  padding: 5,

  defaultVariants: {
    vAlign: 'start',
    direction: 'row'
  }
})

const LeftColumn = styled(Box, {
  paddingLeft: 5,
  paddingBottom: 5,

  flexGrow: 1
})

const RightColumn = styled(Box, {
  paddingBottom: 5,
  paddingRight: 5,

  flexGrow: 1
})

const Authenticated = () => {
  const user = useSelector(state => state.user.user)


  return (
    <Root>
      <Box direction="column">
        <Headerbar direction="row">
          <Button>
            <Icon
              icnName="arrowSquareLeft"
              size={25}
            />
          </Button>

          <UserCard user={user} />
        </Headerbar>

        <LeftColumn>
          <ServerList />
          <FriendList />
        </LeftColumn>
      </Box>

      <Box direction="column">
        <Headerbar>
          { /* ChatBar */ }
        </Headerbar>

        <RightColumn>
          { /* ChatWindow + ServerMembers Panel */}
        </RightColumn>
      </Box>
    </Root>
  )
}

export default Authenticated

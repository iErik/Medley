import { useEffect, useState, useCallback } from 'react'

import { type Server, } from '@store/chat'

import { Flexbox } from '@packages/components'
import { styled } from '@stitched'

import Icon from '@components/Icon'


// TODO <ServerList>:
// 1 - We also need to render and be able to select direct
// message channels, either the ones who are pinned or that
// have unread messages in them
//
// 2 - The fallback design for server without icons should
// be revised
//
// 3 - The server list must be able to be shown and hidden
// based on a prop (perhaps?)
//
// 4 - Implement or integrate a tooltip component here for
// the server/channel buttons

type TimeoutId = ReturnType<typeof setTimeout>

export const Visibility  = {
  Hidden: 'hidden',
  Visible: 'visible',
  AutoHide: 'autohide'
} as const

export type VisibilityKey = keyof typeof Visibility
export type VisibilityType = typeof Visibility[VisibilityKey]

type ServerListProps = {
  servers: Server[]
  visibility: VisibilityType

  onSelectHome: () => any
  onSelectDM: () => any
  onSelectServer: (server: Server) => any
  onPinSidebar: (pin: boolean) => any
}


const AUTOHIDE_TOLERANCE = 10
// Delay to hide the sidebar in milliseconds
const AUTOHIDE_DELAY = 300

export default function ServerList(props: ServerListProps) {
  const [ peek, setPeek ] = useState(false)
  const [
    autohideTimeout,
    setAutohideTimeout
  ] = useState<TimeoutId | null>(null)

  const serverBtns = props.servers.map(server =>
    <ServerBtn
      key={server._id}
      serverIcon={server.icon?.src || undefined}
      name={server.name}
      onClick={props.onSelectServer.bind(null, server)}
    />)

  const handlePinSidebar = () => {
    console.log('handlePinSidebar')
    props.onPinSidebar(!props.hidden)
  }

  const onMouseMove = useCallback((ev: MouseEvent) => {
    if (props.visibility !== Visibility.AutoHide) {
      return
    }

    if (ev.clientX <= AUTOHIDE_TOLERANCE && !peek) {
      console.log('Peek set to true')
      setPeek(true)
    }
  }, [ props.visibility, peek ])

  const onMouseLeave = useCallback((ev: React.MouseEvent) => {
    setAutohideTimeout(setTimeout(() => setPeek(false), AUTOHIDE_DELAY))
  }, [ autohideTimeout, setAutohideTimeout ])

  const onMouseEnter = useCallback(() => {
    if (!autohideTimeout) return

    clearTimeout(autohideTimeout)
    setAutohideTimeout(null)
  }, [ autohideTimeout, setAutohideTimeout ])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [ onMouseMove ])

  console.log({ props })

  return (
    <Wrapper
      visibility={props.visibility}
      autohide={peek ? 'show' : 'hide'}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <Container column>
        <ServerBtn
          name="home"
          onClick={props.onSelectHome}
        >
          <Icon icon="Home" />
        </ServerBtn>

        { serverBtns }

        <Toggle onClick={handlePinSidebar}>
          <Icon icon="SidebarLeft" />
        </Toggle>
      </Container>
    </Wrapper>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Wrapper = styled('div', {
  display: 'grid',
  gridTemplateRows: '1fr',
  overflow: 'hidden',
  height: '100%',
  transition: 'width 300ms ease',
  zIndex: 10,
  width: '$serverList',

  marginRight: 2,

  variants: {
    // Deprecated:
    hidden: { true: { width: 0 } },

    visibility: {
      hidden: { width: 0 },
      visible: { width: 'auto' },
      autohide: {
        //position: 'absolute',
        //borderRight: '2px solid $bg500',
        //boxShadow: '-5px -2px 15px rgba(0, 0, 0, 0.3)',
        //transition: 'left 300ms'
      },
    },

    autohide: {
      show: {
        //width: 'auto'
        //left: 0,
        //overflow: 'visible'
      },

      hide: {
        //width: 0
        //left: -60
      }
    }
  },

  compoundVariants: [
    {
      visibility: 'autohide',
      autohide: 'show',
      css: { width: 'auto' }
    },
    {
      visibility: 'autohide',
      autohide: 'hide',
      css: { width: 0 }
    }
  ]
})

const Container = styled(Flexbox, {
  position: 'relative',
  width: '$serverList',
  padding: '$serverListPad',
  gap: 10,
  //marginRight: 2,

  borderTopLeftRadius: '$baseRadius',
  borderBottomLeftRadius: '$baseRadius',

  background: '$bg300',
})

const mkBgStyles = (backgroundUrl: string) => ({
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: `url(${backgroundUrl})`,
})

const mkServerBtnEl = (icon?: string) => styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: 45,
  height: 45,

  // TODO: Maybe this alternative borderRadius should be in
  // variable
  borderRadius: 12,
  overflow: 'visible',

  position: 'relative',
  backgroundColor: '$bg100',

  boxShadow: '0 0px 0px 0 rbga(0, 0, 0, 0.0)',
  transition: 'box-shadow 300ms',
  cursor: 'pointer',

  '&:hover:before': { },

  '&:before': {
    content: '',
    display: 'inline-block',
    position: 'absolute',
    overflow: 'visible',
    zIndex: 1,

    filter: 'blur(10px) opacity(.8)',

    top: 6,
    left: '50%',
    // translate3d is to stop GIF's from beind deformed
    transform: 'translate3d(1px, 1px, 1px) translateX(-50%)',

    height: '80%',
    width: '80%',
    borderRadius: 12,

    ...(icon ? mkBgStyles(icon) : {})
  },

  '&:after': {
    content: '',
    display: 'inline-block',
    position: 'absolute',
    zIndex: 2,

    //filter: 'blur(10px)',

    top: 0,
    left: 0,
    borderRadius: 12,

    height: '100%',
    width: '100%',

    ...(icon ? mkBgStyles(icon) : {})
  },

  variants: {
    fallback: {
      false: { },

      true: { }
    }
  },

  '> .fallback': {
    fontWeight: '$semiBold',
    fontSize: 16,
    letterSpacing: 2,
    color: '$fg80'
  }
})


const ServerBtn = (props: {
  name: string,
  serverIcon?: string,
  children?: React.ReactNode,
  onClick: React.MouseEventHandler<HTMLDivElement>
}) => {
  const ServerBtnEl = mkServerBtnEl(props.serverIcon)
  const getInitials = () => {
    const [ first, second ] = props.name.trim().split(/\s+/)
    return second
      ? `${first[0] || ''}${second[0] || ''}`
      : `${first[0] || ''}${first[1] || ''}`
  }

  return (
    <ServerBtnEl
      onClick={props.onClick}
      style={
        props.serverIcon
          ? { backgroundImage: `url(${props.serverIcon})`}
          : {}
      }
    >
      { props.children
          ? props.children
          : !props.serverIcon
          ? <span className="fallback">
              { getInitials() }
            </span>
          : null
      }
    </ServerBtnEl>
  )
}

const Toggle = styled('button', {
  position: 'absolute',
  bottom: 2,
  left: 2,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  background: '$bg500',
  transition: 'background 300ms ease',
  flexShrink: 0,
  borderRadius: 5,

  width: 'calc(100% - 4px)',
  height: 45,

  [`& ${Icon}`]: { },

  '&:hover': { background: '$bg300' },

  variants: {
    active: {
      true: { background: '$bg300' }
    }
  }
})

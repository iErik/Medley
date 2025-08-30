import { type Server, } from '@store/chat'

import { Flexbox } from '@ierik/medley-components'
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

type ServerListProps = {
  servers: Server[]
  onSelectHome: () => any
  onSelectDM: () => any
  onSelectServer: (server: Server) => any
}

export default function ServerList(props: ServerListProps) {
  const serverBtns = props.servers.map(server =>
    <ServerBtn
      key={server._id}
      serverIcon={server.icon?.src || undefined}
      name={server.name}
      onClick={props.onSelectServer.bind(null, server)}
    />)

  return (
    <Container column>
      <ServerBtn
        name="home"
        onClick={props.onSelectHome}
      >
        <Icon icon="Home" />
      </ServerBtn>

      { serverBtns }
    </Container>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Container = styled(Flexbox, {
  width: '$serverList',
  padding: '$serverListPad',
  gap: 10,
  marginRight: 2,

  borderTopLeftRadius: '$baseRadius',
  borderBottomLeftRadius: '$baseRadius',

  background: '$bg300'
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



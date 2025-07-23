import { useSelector } from '@store'
import {
  type Server,
  actions as chatActions
} from '@store/chat'

import { Flexbox } from '@ierik/medley-components'
import { styled } from '@stitched'

import { useAction } from '@hooks'
import { useNavigate } from 'react-router-dom'


const Container = styled(Flexbox, {
  width: '$serverList',
  padding: '$serverListPad',
  gap: 10,
  marginRight: 2,

  borderTopLeftRadius: '$baseRadius',
  borderBottomLeftRadius: '$baseRadius',

  background: '$bg400'
})


const mkBgStyles = (backgroundUrl: string) => ({
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: `url(${backgroundUrl})`,
})

const ServerBtn = (props: {
  name: string,
  icon: string | null,
  onClick: Function
}) => {
  const ServerBtnEl = styled('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    width: 45,
    height: 45,
    borderRadius: 12,
    overflow: 'visible',

    position: 'relative',
    backgroundColor: '$bg500',

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

      ...(props.icon
        ? mkBgStyles(props?.icon)
        : {}),
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

      ...(props.icon
        ? mkBgStyles(props?.icon)
        : {}),
    },

    '> .fallback': {
      fontWeight: '$semiBold',
      fontSize: 16,
      letterSpacing: 2,
      color: '$fg80'
    }
  })

  const getInitials = () => {
    const [ first, second ] = props.name.trim().split(/\s+/)
    return second
      ? `${first[0] || ''}${second[0] || ''}`
      : `${first[0] || ''}${first[1] || ''}`
  }

  return (
    <ServerBtnEl onClick={props.onClick}>
      { !props.icon
        ? <span className="fallback">{ getInitials() }</span>
        : null
      }
    </ServerBtnEl>
  )
}


const ServerList = () => {
  const navigate = useNavigate()
  const setActiveServer = useAction(
    chatActions.setActiveServer)

  const onSelectServer = ({ _id }: Server) => {
    navigate(`servers/${_id}`)
    setActiveServer(_id)
  }

  const servers = useSelector(state => state.chat.servers)

  const serverBtns = Object.values(servers).map(server =>
    <ServerBtn
      key={server._id}
      icon={server.icon?.src}
      name={server.name}
      onClick={onSelectServer.bind(null, server)}
    />)

  return (
    <Container column>
      { serverBtns }
    </Container>
  )
}

export default ServerList

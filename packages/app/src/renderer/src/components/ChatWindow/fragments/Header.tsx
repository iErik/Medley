import { Wrapper, Text }  from '@ierik/concord-generics'
import { styled } from '@/stitches.config'
import Icon from '@components/Icon'

// -> Header
// ---------

const HeaderWrapper = styled(Wrapper, {
  height: 70,
  paddingBottom: 15,

  //borderBottom: '1px solid rgba(255, 255, 255, .2)'
})

const ChannelName = styled('div', {
  display: 'flex',
  alignItems: 'center',
  paddingTop: 20,

  [`& > ${Icon} > svg`]: {
    fill: '#FFF',
    marginRight: 15
  },

  [`& > ${Text}`]: {
    fontFamily: '$decorative',
    fontSize: 20,
    whiteSpace: 'nowrap'
  }
})

const ChannelDescription = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',

  paddingTop: 20,
  marginLeft: 20,
  minWidth: 0,

  '&::before': {
    content: '',
    display: 'block',
    position: 'absolute',
    background: '#FFF',
    opacity: 0.63,
    width: 1,
    bottom: 2,
    height: 'calc(100% - 20px)'
  },

  [`& > ${Text}`]: {
    fontFamily: '$decorative',
    fontSize: 17,
    marginLeft: 20,
    color: 'rgba(255, 255, 255, 0.68)',
    ellipsis: '100%'
  }
})

interface ChannelHeaderProps extends JSX.IntrinsicAttributes {
  channelName: string,
  channelDescription: string
}

const ChatHeader = ({
  channelName,
  channelDescription,
}: ChannelHeaderProps) => {
  return (
    <HeaderWrapper>
      <ChannelName>
        <Icon icnName="chat" size={23} />

        <Text>
          { channelName }
        </Text>
      </ChannelName>

      { channelDescription &&
        <ChannelDescription>
          <Text>
            { channelDescription }
          </Text>
        </ChannelDescription>
      }
    </HeaderWrapper>
  )
}

export default ChatHeader

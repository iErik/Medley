import { useSelector } from '@store'
import { AuthState } from '@store/user'

import { Flexbox, Text } from '@ierik/medley-components'
import { styled } from '@stitched'

import { productName } from '@pkg/package.json'

const Container = styled(Flexbox, {
  width: '100%',
  height: '$headerHeight',
  flexShrink: 0,

  backgroundColor: '$headerBgDark',

  '-webkit-app-region': 'drag',

  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
})

const LabelWrapper = styled(Flexbox, {

})

const Title = styled(Text, {
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 3.5,
  lineHeight: '$headerHeight',
  color: '$fgBase',
  textTransform: 'uppercase',

  userSelect: 'none',
  cursor: 'default',
})

const mkBgStyles = (backgroundUrl: string) => ({
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundImage: `url(${backgroundUrl})`,
})

const ServerBtn = (props: { background: string }) => {
  const ServerBtnEl = styled('div', {
    width: 45,
    height: 45,
    borderRadius: 12,
    overflow: 'visible',

    position: 'relative',

    boxShadow: '0 0px 0px 0 rbga(0, 0, 0, 0.0)',
    transition: 'box-shadow 300ms',
    cursor: 'pointer',

    '&:hover:before': {
    },

    '&:before': {
      content: '',
      display: 'inline-block',
      position: 'absolute',
      overflow: 'visible',
      zIndex: 1,

      filter: 'blur(10px) opacity(.8)',

      top: 10,
      left: '50%',
      // translate3d is to stop GIF's from beind deformed
      transform: 'translate3d(1px, 1px, 1px) translateX(-50%)',

      height: '80%',
      width: '80%',
      borderRadius: 12,

      ...mkBgStyles(props?.background),
      //backgroundColor: 'red'
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

      ...mkBgStyles(props?.background),
      //backgroundColor: 'blue'
    }

  })


  return <ServerBtnEl />
}

const GuildsContainer = styled(Flexbox, {
  marginLeft: 20,
  width: 'fit-content',

  // The drag option disables hover events and other pointer
  // events on child elements
  '-webkit-app-region': 'no-drag',

  '& > div:not(:last-child)': {
    marginRight: 25
  }
})

const Header = () => {
  const authState = useSelector(state => state.user.authState)
  const servers = useSelector(state => state?.chat?.servers)
  const isAuthenticated = authState === AuthState.Authenticated

  const serverBtns = servers.map(server =>
    <ServerBtn
      key={server?._id}
      background={server?.icon?.src}
    />)

  return (
    <Container
      vAlign="center"
      hAlign="left"
    >
      { isAuthenticated &&
        <GuildsContainer
          hAlign="center"
        >
          { serverBtns }
        </GuildsContainer>
      }

      { !isAuthenticated &&
        <LabelWrapper
          vAlign="center"
          hAlign="center"
        >
          <Title as="h2">
            { productName }
          </Title>
        </LabelWrapper>
      }
    </Container>
  )
}

export default Header

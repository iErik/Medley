import { useSelector } from 'react-redux'

import { Wrapper, Heading } from '@ierik/medley-components'

import { styled } from '@/stitches.config'
import { productName } from '@pkg/package.json'

const Container = styled(Wrapper, {
  width: '100%',
  height: '$headerHeight',
  flexShrink: 0,

  backgroundColor: '$bgHeader',

  //'-webkit-app-region': 'drag',
})

const LabelWrapper = styled(Wrapper, {

})

const Title = styled(Heading, {
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 3.5,
  lineHeight: '$headerHeight',
  color: '$fgBase',
  textTransform: 'uppercase',

  userSelect: 'none',
  cursor: 'default',
})

const ServerBtn = styled('div', {
  width: 45,
  height: 45,
  borderRadius: 12,

  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  boxShadow: '0 0px 0px 0 rbga(0, 0, 0, 0.0)',
  transition: 'box-shadow 300ms',

  '&:hover': {
    cursor: 'pointer',
    boxShadow: '0 4px 17px -3px rgba(0, 0, 0, 0.4)'
  }
})

const GuildsContainer = styled(Wrapper, {
  marginLeft: 20,

  '& > div:not(:last-child)': {
    marginRight: 10
  }
})

const Header = () => {
  const { guilds, isAuthenticated } = useSelector(state =>
    state.user)

  const serverBtns = guilds.map(server =>
    <ServerBtn
      key={server?.id}
      css={{ backgroundImage: `url(${server?.iconSrc})` }}
    />)

  return (
    <Container
      vAlign="center"
      hAlign="center"
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
          <Title as="h2">{ productName }</Title>
        </LabelWrapper>
      }
    </Container>
  )
}

export default Header

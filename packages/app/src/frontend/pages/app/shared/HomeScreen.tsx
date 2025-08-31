import { styled } from '@stitched'

const HomeScreen = () => {
  return (
    <Root>

    </Root>
  )
}

/*--------------------------------------------------------/
/ -> Fragments                                            /
/--------------------------------------------------------*/

const Root = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  background: '$bg300',

  width: '100%',
  height: '100%',
  transition: 'width 300ms ease',

  '&:not(:last-child)': {
    marginRight: '2px',
  },

  borderTopRightRadius: '$baseRadius',
  borderBottomRightRadius: '$baseRadius',
})


export default HomeScreen

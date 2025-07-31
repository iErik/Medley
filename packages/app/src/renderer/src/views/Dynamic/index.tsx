import { useSelf } from '@store/user'

import { styled } from '@stitched'
import { If, Flexbox } from '@ierik/medley-components'

import IndexedOutlet from '@components/IndexedOutlet'
import Icon from '@components/Icon'

import ServerSidebar from '@views/Authenticated/ServerSidebar'
import UserCard from '@views/Authenticated/UserCard'


export default function DynamicView() {
  const user = useSelf()

  return (
    <Root>
      <Flexbox column>
        <HeaderbarLeft>
          <Button>
            <Icon
              icnName="arrowSquareLeft"
              size={25}
            />
          </Button>

          <If condition={!!user}>
            <UserCard user={user} />
          </If>
        </HeaderbarLeft>

        <LeftColumn>
          <ServerSidebar />
          <IndexedOutlet index={0} />
        </LeftColumn>
      </Flexbox>

      <Flexbox column>
        <HeaderbarRight>
        </HeaderbarRight>

        <RightColumn>
          <IndexedOutlet index={1} />
        </RightColumn>
      </Flexbox>
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
  gridTemplateColumns: 'auto 1fr'
})

const HeaderbarLeft = styled(Flexbox, {
  height: HEADER_HEIGHT,
  paddingLeft: 5,
  paddingBottom: 5,
  paddingTop: 5,
  gap: 5,

  defaultVariants: {
    vAlign: 'start',
    direction: 'row'
  }
})

const HeaderbarRight = styled(Flexbox, {
  height: HEADER_HEIGHT,
  padding: 5,

  defaultVariants: {
    vAlign: 'start',
    direction: 'row'
  }
})

const LeftColumn = styled(Flexbox, {
  paddingLeft: 5,
  paddingBottom: 5,

  flexGrow: 1
})

const RightColumn = styled(Flexbox, {
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

  width: '$serverList',
})


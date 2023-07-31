import { Outlet } from 'react-router-dom'
import { Wrapper, Text } from '@ierik/medley-components'

const Unauthenticated = () => {
  return (
    <Wrapper
      column
      hAlign="center"
      vAlign="top"
    >
      <Text
        mono
        type="h2"
        css={{
          marginTop: '300px',
          marginBottom: '50px',
        }}
      >
        You should totally log in
      </Text>

      <Outlet />
   </Wrapper>
  )
}

export default Unauthenticated

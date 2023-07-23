import { Outlet } from 'react-router-dom'
import { Wrapper, Heading } from '@ierik/concord-generics'

const Unauthenticated = () => {
  return (
    <Wrapper
      column
      hAlign="center"
      vAlign="top"
    >
      <Heading
        css={{
          marginTop: '300px',
          marginBottom: '50px',
          fontWeight: '700'
        }}
      >
        You should totally log in
      </Heading>

      <Outlet />
   </Wrapper>
  )
}

export default Unauthenticated

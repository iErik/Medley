import { styled, keyframes } from '@stitched'

const blinkingAnim = keyframes({
  '0%': {
    transform: 'scale(0)',
    opacity: 1
  },

  '100%': {
    transform: 'scale(1)',
    opacity: 0
  }
})

const Blinking = styled('span', {
  display: 'inline-block',
  position: 'relative',

  width: 48,
  height: 48,

  '&::after, &::before': {
    content: '',
    boxSizing: 'border-box',
    height: '100%',
    width: '100%',
    borderRadius: '50%',
    background: '#FFF',
    position: 'absolute',
    left: 0,
    top: 0,
    animation: `${blinkingAnim} 2s linear infinite`
  },

  '&after': { animationDelay: '1s' }
})

type LoaderProps = {
  size: number
}

const Loader = () => {
  return (
    <Blinking />
  )
}

export default Loader

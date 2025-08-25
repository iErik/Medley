import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'

import store from '@store'
import { browserRouter } from './routes'
import '@styles/index.scss'

createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <Provider store={store}>
        <RouterProvider router={browserRouter}/>
      </Provider>
    </StrictMode>
  )

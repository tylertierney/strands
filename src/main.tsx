import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home/Home.tsx'
import GamePage from './components/GamePage/GamePage.tsx'
import gamesArr from '../games.json'
import type { Game } from './models/models.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'games/:gameIndex',
        element: <GamePage />,
        loader: ({ params }) => {
          const games = gamesArr as unknown as Game[]
          const asNumber = parseInt(params.gameIndex ?? '0', 10)
          const found = games.find(({ index }) => index === asNumber) ?? null
          return found
        },
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
)

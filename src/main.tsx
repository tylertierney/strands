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
        path: 'games/:gameId',
        element: <GamePage />,
        loader: ({ params }) => {
          const games = gamesArr as unknown as Game[]
          const asNumber = parseInt(params.gameId ?? '0', 10)
          const found = games.find(({ id }) => id === asNumber) ?? null
          console.log(games)
          console.log(found)
          return found
          // return games[0]
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

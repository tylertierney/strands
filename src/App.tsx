import Navbar from './components/Navbar/Navbar.tsx'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar />
      <Outlet></Outlet>
    </>
  )
}

export default App

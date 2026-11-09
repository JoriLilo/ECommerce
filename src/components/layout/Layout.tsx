import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

// Displays the shared navigation and the matched child route.
export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}
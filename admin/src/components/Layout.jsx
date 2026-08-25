import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#f7fcf8]">
      <Navbar />

      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 bg-[#f7fcf8]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
